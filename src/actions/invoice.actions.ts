"use server";

import { randomBytes } from "node:crypto";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAppUser } from "@/lib/auth-user";
import { sendInvoiceEmail, sendOverdueReminder } from "@/lib/mail";
import { invoiceSchema, paymentSchema } from "@/lib/validations";
import {
  addScheduleFrequency,
  calculateInvoiceTotals,
  generateInvoiceNumber,
  getDaysOverdue,
  getAppBaseUrl,
  sanitizePhoneNumber,
} from "@/lib/utils";
import { generateInvoicePDF } from "@/components/pdf/generate-pdf";

type ScheduleFrequency = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

async function getVerifiedUser() {
  return requireAppUser();
}

function normalizeSchedule(
  enabled: boolean,
  frequency: ScheduleFrequency,
) {
  if (!enabled || frequency === "NONE") {
    return { enabled: false, frequency: "NONE" as const };
  }

  return { enabled: true, frequency };
}

function getReminderDate(
  dueDate: Date,
  enabled: boolean,
  frequency: ScheduleFrequency,
) {
  if (!enabled || frequency === "NONE") {
    return null;
  }

  return new Date(dueDate);
}

function getRecurringDate(
  issueDate: Date,
  enabled: boolean,
  frequency: ScheduleFrequency,
) {
  if (!enabled || frequency === "NONE") {
    return null;
  }

  return addScheduleFrequency(issueDate, frequency);
}

export async function createInvoice(raw: unknown) {
  const user = await getVerifiedUser();
  const data = invoiceSchema.parse(raw);

  const client = await prisma.client.findFirst({
    where: { id: data.clientId, userId: user.id },
  });
  if (!client) {
    throw new Error("Client not found or access denied");
  }

  const invoiceNumber = generateInvoiceNumber(user.invoicePrefix, user.nextInvoiceNum);
  const totals = calculateInvoiceTotals(data.lineItems, data.discountPct);
  const issueDate = new Date(data.issueDate);
  const dueDate = new Date(data.dueDate);
  const recurrence = normalizeSchedule(data.recurrenceEnabled, data.recurrenceFrequency);
  const reminder = normalizeSchedule(data.reminderEnabled, data.reminderFrequency);

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.invoice.create({
      data: {
        userId: user.id,
        clientId: data.clientId,
        invoiceNumber,
        status: "DRAFT",
        issueDate,
        dueDate,
        currency: data.currency,
        taxRate: data.taxRate,
        discountPct: data.discountPct,
        notes: data.notes,
        terms: data.terms,
        recurrenceEnabled: recurrence.enabled,
        recurrenceFrequency: recurrence.frequency,
        nextRecurringDate: getRecurringDate(issueDate, recurrence.enabled, recurrence.frequency),
        autoSendRecurring: recurrence.enabled ? data.autoSendRecurring : false,
        reminderEnabled: reminder.enabled,
        reminderFrequency: reminder.frequency,
        nextReminderDate: getReminderDate(dueDate, reminder.enabled, reminder.frequency),
        ...totals,
        balanceDue: totals.totalAmount,
        lineItems: {
          create: data.lineItems.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            amount: item.quantity * item.unitPrice,
            sortOrder: index,
          })),
        },
      },
      include: {
        lineItems: true,
        client: true,
        user: true,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: { nextInvoiceNum: { increment: 1 } },
    });

    return created;
  });

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true, invoice };
}

export async function updateInvoice(invoiceId: string, raw: unknown) {
  const user = await getVerifiedUser();
  const data = invoiceSchema.parse(raw);

  const existingInvoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
    include: {
      payments: true,
    },
  });
  if (!existingInvoice) {
    throw new Error("Invoice not found or access denied");
  }
  if (existingInvoice.status === "PAID") {
    throw new Error("Paid invoices cannot be edited");
  }

  const client = await prisma.client.findFirst({
    where: { id: data.clientId, userId: user.id },
  });
  if (!client) {
    throw new Error("Client not found or access denied");
  }

  const totals = calculateInvoiceTotals(data.lineItems, data.discountPct);
  const balanceDue = Math.max(0, totals.totalAmount - existingInvoice.paidAmount);
  const issueDate = new Date(data.issueDate);
  const dueDate = new Date(data.dueDate);
  const recurrence = normalizeSchedule(data.recurrenceEnabled, data.recurrenceFrequency);
  const reminder = normalizeSchedule(data.reminderEnabled, data.reminderFrequency);
  const nextStatus =
    balanceDue <= 0
      ? "PAID"
      : existingInvoice.paidAmount > 0
        ? "PARTIAL"
        : existingInvoice.status;

  const invoice = await prisma.$transaction(async (tx) => {
    await tx.lineItem.deleteMany({ where: { invoiceId } });

    return tx.invoice.update({
      where: { id: invoiceId },
      data: {
        clientId: data.clientId,
        issueDate,
        dueDate,
        currency: data.currency,
        taxRate: data.taxRate,
        discountPct: data.discountPct,
        notes: data.notes,
        terms: data.terms,
        recurrenceEnabled: recurrence.enabled,
        recurrenceFrequency: recurrence.frequency,
        nextRecurringDate: getRecurringDate(issueDate, recurrence.enabled, recurrence.frequency),
        autoSendRecurring: recurrence.enabled ? data.autoSendRecurring : false,
        reminderEnabled: reminder.enabled,
        reminderFrequency: reminder.frequency,
        nextReminderDate: getReminderDate(dueDate, reminder.enabled, reminder.frequency),
        ...totals,
        balanceDue,
        status: nextStatus,
        pdfUrl: null,
        lineItems: {
          create: data.lineItems.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            amount: item.quantity * item.unitPrice,
            sortOrder: index,
          })),
        },
      },
      include: {
        lineItems: true,
        client: true,
        user: true,
      },
    });
  });

  if (existingInvoice.pdfUrl) {
    await del(existingInvoice.pdfUrl).catch(() => {
      // Ignore stale blob cleanup failures so invoice edits still succeed.
    });
  }

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true, invoice };
}

export async function generateAndStorePDF(invoiceId: string) {
  const user = await getVerifiedUser();

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
    include: {
      lineItems: true,
      client: true,
      user: true,
    },
  });
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const pdfBytes = await generateInvoicePDF(invoice);
  const blob = await put(`invoices/${user.id}/${invoiceId}.pdf`, Buffer.from(pdfBytes), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/pdf",
  });

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { pdfUrl: blob.url },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true, pdfUrl: blob.url };
}

export async function sendInvoice(invoiceId: string) {
  const user = await getVerifiedUser();

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
    include: {
      client: true,
      user: true,
      lineItems: true,
    },
  });
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  let pdfUrl = invoice.pdfUrl;
  if (!pdfUrl) {
    const generated = await generateAndStorePDF(invoiceId);
    pdfUrl = generated.pdfUrl;
  }

  await sendInvoiceEmail({
    to: invoice.client.email,
    invoice: {
      ...invoice,
      pdfUrl,
    },
  });

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "SENT", sentAt: new Date(), pdfUrl },
  });

  await prisma.emailLog.create({
    data: {
      invoiceId,
      toEmail: invoice.client.email,
      subject: `Invoice ${invoice.invoiceNumber} from ${invoice.user.businessName ?? "InvoiceMarshal"}`,
      type: "INVOICE_SENT",
    },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
  return { success: true };
}

export async function sendReminder(invoiceId: string) {
  const user = await getVerifiedUser();

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
    include: {
      client: true,
      user: true,
    },
  });
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  if (invoice.status === "PAID") {
    throw new Error("Paid invoices do not need a reminder");
  }
  if (invoice.status === "CANCELLED") {
    throw new Error("Cancelled invoices cannot send reminders");
  }
  if (invoice.balanceDue <= 0) {
    throw new Error("This invoice has no outstanding balance");
  }

  const daysOverdue = getDaysOverdue(invoice.dueDate);
  const nextReminderDate =
    invoice.reminderEnabled && invoice.reminderFrequency !== "NONE"
      ? addScheduleFrequency(
          invoice.nextReminderDate ?? invoice.dueDate,
          invoice.reminderFrequency,
        )
      : null;

  await sendOverdueReminder({
    to: invoice.client.email,
    clientName: invoice.client.name,
    invoiceNumber: invoice.invoiceNumber,
    balanceDue: invoice.balanceDue,
    currency: invoice.currency,
    daysOverdue,
    pdfUrl: invoice.pdfUrl,
    businessName: invoice.user.businessName,
    businessEmail: invoice.user.businessEmail,
    logoUrl: invoice.user.logoUrl,
    brandPrimaryColor: invoice.user.brandPrimaryColor,
    brandAccentColor: invoice.user.brandAccentColor,
  });

  await prisma.$transaction([
    prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        reminderSentAt: new Date(),
        nextReminderDate,
        status:
          daysOverdue > 0 && invoice.status !== "PARTIAL"
            ? "OVERDUE"
            : daysOverdue > 0
              ? "PARTIAL"
              : invoice.status,
      },
    }),
    prisma.emailLog.create({
      data: {
        invoiceId,
        toEmail: invoice.client.email,
        subject: `Reminder: Invoice ${invoice.invoiceNumber}`,
        type: "REMINDER",
      },
    }),
  ]);

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function prepareInvoiceShare(invoiceId: string) {
  const user = await getVerifiedUser();

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
    include: {
      client: true,
      user: true,
    },
  });
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  let pdfUrl = invoice.pdfUrl;
  if (!pdfUrl) {
    const generated = await generateAndStorePDF(invoiceId);
    pdfUrl = generated.pdfUrl;
  }

  let shareToken = invoice.shareToken;
  if (!shareToken) {
    shareToken = randomBytes(16).toString("hex");
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { shareToken },
    });
  }

  const shareUrl = `${getAppBaseUrl()}/share/invoices/${invoiceId}?token=${shareToken}`;
  const businessName = invoice.user.businessName ?? "Our team";
  const amount = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: invoice.currency,
  }).format(invoice.balanceDue);
  const dueDate = invoice.dueDate.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const message = [
    `Hello ${invoice.client.name},`,
    "",
    `Invoice ${invoice.invoiceNumber} from ${businessName} is ready.`,
    `Outstanding amount: ${amount}`,
    `Due date: ${dueDate}`,
    `View invoice: ${shareUrl}`,
    "",
    "Please let us know once payment is completed. Thank you.",
  ].join("\n");

  const phone = sanitizePhoneNumber(invoice.client.phone);
  const baseUrl = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  const whatsappUrl = `${baseUrl}?text=${encodeURIComponent(message)}`;
  const emailSubject = `Invoice ${invoice.invoiceNumber} from ${businessName}`;
  const emailDraftUrl = `mailto:${invoice.client.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(message)}`;

  if (invoice.status === "DRAFT") {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "SENT", sentAt: invoice.sentAt ?? new Date(), pdfUrl, shareToken },
    });
  } else {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { pdfUrl, shareToken },
    });
  }

  await prisma.emailLog.create({
    data: {
      invoiceId,
      toEmail: invoice.client.phone || invoice.client.email,
      subject: `WhatsApp share link for invoice ${invoice.invoiceNumber}`,
      type: "WHATSAPP_SHARE",
    },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");

  return {
    success: true,
    shareUrl,
    whatsappUrl,
    emailDraftUrl,
    message,
  };
}

export async function recordPayment(raw: unknown) {
  const user = await getVerifiedUser();
  const data = paymentSchema.parse(raw);

  const invoice = await prisma.invoice.findFirst({
    where: { id: data.invoiceId, userId: user.id },
  });
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const payment = await prisma.$transaction(async (tx) => {
    const created = await tx.payment.create({
      data: {
        invoiceId: data.invoiceId,
        userId: user.id,
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        note: data.note,
        paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
        currency: invoice.currency,
      },
    });

    const newPaidAmount = invoice.paidAmount + data.amount;
    const newBalanceDue = invoice.totalAmount - newPaidAmount;
    const newStatus =
      newBalanceDue <= 0 ? "PAID" : newPaidAmount > 0 ? "PARTIAL" : invoice.status;

    await tx.invoice.update({
      where: { id: data.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        balanceDue: Math.max(0, newBalanceDue),
        status: newStatus,
        paidAt: newBalanceDue <= 0 ? new Date() : undefined,
      },
    });

    return created;
  });

  revalidatePath(`/invoices/${data.invoiceId}`);
  revalidatePath("/dashboard");
  return { success: true, payment };
}

export async function deleteInvoice(invoiceId: string) {
  const user = await getVerifiedUser();
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
  });

  if (!invoice) {
    throw new Error("Invoice not found or access denied");
  }
  if (invoice.status === "PAID") {
    throw new Error("Cannot delete a paid invoice");
  }

  if (invoice.pdfUrl) {
    await del(invoice.pdfUrl).catch(() => {
      // Ignore cleanup errors; the invoice record still needs to be removed.
    });
  }

  await prisma.invoice.delete({ where: { id: invoiceId } });
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getInvoiceById(invoiceId: string) {
  const user = await getVerifiedUser();
  return prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
    include: {
      client: true,
      user: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
      payments: { orderBy: { paidAt: "desc" } },
    },
  });
}

export async function getInvoices() {
  const user = await getVerifiedUser();
  return prisma.invoice.findMany({
    where: { userId: user.id },
    include: {
      client: true,
      lineItems: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDashboardStats() {
  const user = await getVerifiedUser();

  const [
    totalInvoices,
    paidInvoices,
    overdueInvoices,
    draftInvoices,
    recentInvoices,
    monthlyRevenueRaw,
  ] = await Promise.all([
    prisma.invoice.count({ where: { userId: user.id } }),
    prisma.invoice.aggregate({
      where: { userId: user.id, status: "PAID" },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: {
        userId: user.id,
        status: { in: ["SENT", "PARTIAL"] },
        dueDate: { lt: new Date() },
      },
      _sum: { balanceDue: true },
      _count: true,
    }),
    prisma.invoice.count({
      where: { userId: user.id, status: "DRAFT" },
    }),
    prisma.invoice.findMany({
      where: { userId: user.id },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.$queryRaw<{ month: string; revenue: number | string | bigint | null }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "paidAt"), 'Mon YY') as month,
        COALESCE(SUM("totalAmount"), 0) as revenue
      FROM "Invoice"
      WHERE "userId" = ${user.id}
        AND status = 'PAID'
        AND "paidAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "paidAt")
      ORDER BY DATE_TRUNC('month', "paidAt") ASC
    `,
  ]);

  const monthlyRevenue = monthlyRevenueRaw.map((entry) => ({
    month: entry.month,
    revenue:
      typeof entry.revenue === "bigint"
        ? Number(entry.revenue)
        : Number(entry.revenue ?? 0),
  }));

  return {
    totalInvoices,
    totalRevenue: paidInvoices._sum.totalAmount ?? 0,
    paidCount: paidInvoices._count,
    overdueAmount: overdueInvoices._sum.balanceDue ?? 0,
    overdueCount: overdueInvoices._count,
    draftCount: draftInvoices,
    recentInvoices,
    monthlyRevenue,
    currency: user.defaultCurrency,
  };
}

export async function runScheduledInvoiceJobs() {
  const user = await getVerifiedUser();
  const now = new Date();

  const dueReminders = await prisma.invoice.findMany({
    where: {
      userId: user.id,
      reminderEnabled: true,
      reminderFrequency: { not: "NONE" },
      nextReminderDate: { lte: now },
      balanceDue: { gt: 0 },
      status: { in: ["SENT", "PARTIAL", "OVERDUE"] },
    },
    select: { id: true },
    orderBy: { nextReminderDate: "asc" },
  });

  let remindersSent = 0;
  for (const invoice of dueReminders) {
    await sendReminder(invoice.id);
    remindersSent += 1;
  }

  const recurringInvoices = await prisma.invoice.findMany({
    where: {
      userId: user.id,
      recurrenceEnabled: true,
      recurrenceFrequency: { not: "NONE" },
      nextRecurringDate: { lte: now },
      status: { not: "CANCELLED" },
    },
    include: {
      lineItems: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { nextRecurringDate: "asc" },
  });

  let recurringCreated = 0;
  let recurringSent = 0;

  for (const template of recurringInvoices) {
    const currentIssueDate = template.nextRecurringDate ?? template.issueDate;
    const dueOffset = Math.max(0, template.dueDate.getTime() - template.issueDate.getTime());
    const nextDueDate = new Date(currentIssueDate.getTime() + dueOffset);
    const nextTemplateRecurringDate = addScheduleFrequency(
      currentIssueDate,
      template.recurrenceFrequency,
    );

    const createdInvoice = await prisma.$transaction(async (tx) => {
      const currentUser = await tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          invoicePrefix: true,
          nextInvoiceNum: true,
        },
      });
      if (!currentUser) {
        throw new Error("User not found");
      }

      const invoiceNumber = generateInvoiceNumber(
        currentUser.invoicePrefix,
        currentUser.nextInvoiceNum,
      );

      const created = await tx.invoice.create({
        data: {
          userId: user.id,
          clientId: template.clientId,
          invoiceNumber,
          status: "DRAFT",
          issueDate: currentIssueDate,
          dueDate: nextDueDate,
          currency: template.currency,
          subtotal: template.subtotal,
          taxRate: template.taxRate,
          taxAmount: template.taxAmount,
          discountPct: template.discountPct,
          discountAmount: template.discountAmount,
          totalAmount: template.totalAmount,
          paidAmount: 0,
          balanceDue: template.totalAmount,
          notes: template.notes,
          terms: template.terms,
          recurrenceEnabled: false,
          recurrenceFrequency: "NONE",
          nextRecurringDate: null,
          autoSendRecurring: false,
          reminderEnabled: template.reminderEnabled,
          reminderFrequency: template.reminderEnabled ? template.reminderFrequency : "NONE",
          nextReminderDate: getReminderDate(
            nextDueDate,
            template.reminderEnabled,
            template.reminderFrequency,
          ),
          lineItems: {
            create: template.lineItems.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxRate: item.taxRate,
              amount: item.amount,
              sortOrder: item.sortOrder,
            })),
          },
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { nextInvoiceNum: { increment: 1 } },
      });

      await tx.invoice.update({
        where: { id: template.id },
        data: {
          nextRecurringDate: nextTemplateRecurringDate,
        },
      });

      return created;
    });

    recurringCreated += 1;

    if (template.autoSendRecurring) {
      await sendInvoice(createdInvoice.id);
      recurringSent += 1;
    }
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");

  return {
    success: true,
    remindersSent,
    recurringCreated,
    recurringSent,
  };
}
