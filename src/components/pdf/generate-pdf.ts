import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { formatCurrency, formatDate, hexToRgbTuple, normalizeHexColor } from "@/lib/utils";

interface InvoiceForPDF {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountPct: number;
  discountAmount: number;
  totalAmount: number;
  balanceDue: number;
  notes?: string | null;
  terms?: string | null;
  status: string;
  client: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    vatNumber?: string | null;
  };
  user: {
    businessName?: string | null;
    businessAddress?: string | null;
    businessCity?: string | null;
    businessPhone?: string | null;
    businessEmail?: string | null;
    vatNumber?: string | null;
    email: string;
    logoUrl?: string | null;
    brandPrimaryColor?: string | null;
    brandAccentColor?: string | null;
  };
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    amount: number;
  }[];
  paidAmount?: number;
}

const FALLBACK_PRIMARY = "#6D28D9";
const FALLBACK_ACCENT = "#F5F3FF";
const GRAY_DARK = [31, 41, 55] as const;
const GRAY_MED = [107, 114, 128] as const;
const WHITE = [255, 255, 255] as const;

async function getRemoteImageData(logoUrl: string) {
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "image/png";
    if (!contentType.startsWith("image/")) {
      return null;
    }

    const bytes = await response.arrayBuffer();
    const dataUrl = `data:${contentType};base64,${Buffer.from(bytes).toString("base64")}`;
    const format = contentType.includes("png")
      ? "PNG"
      : contentType.includes("webp")
        ? "WEBP"
        : "JPEG";

    return { dataUrl, format };
  } catch {
    return null;
  }
}

export async function generateInvoicePDF(invoice: InvoiceForPDF): Promise<Uint8Array> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const primaryHex = normalizeHexColor(invoice.user.brandPrimaryColor, FALLBACK_PRIMARY);
  const accentHex = normalizeHexColor(invoice.user.brandAccentColor, FALLBACK_ACCENT);
  const primary = hexToRgbTuple(primaryHex, FALLBACK_PRIMARY);
  const accent = hexToRgbTuple(accentHex, FALLBACK_ACCENT);
  const businessName = invoice.user.businessName ?? "Your Business";
  const logo = invoice.user.logoUrl ? await getRemoteImageData(invoice.user.logoUrl) : null;
  let y = 0;

  doc.setFillColor(...primary);
  doc.rect(0, 0, pageW, 40, "F");

  if (logo) {
    try {
      doc.addImage(logo.dataUrl, logo.format, margin, 9, 18, 18);
    } catch {
      // Ignore invalid logo assets and continue with text branding.
    }
  }

  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(businessName, logo ? margin + 24 : margin, 18);

  doc.setFontSize(28);
  doc.text("INVOICE", pageW - margin, 18, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.invoiceNumber, pageW - margin, 26, { align: "right" });

  const statusColors: Record<string, [number, number, number]> = {
    PAID: [16, 185, 129],
    SENT: [59, 130, 246],
    OVERDUE: [239, 68, 68],
    DRAFT: [156, 163, 175],
    CANCELLED: [249, 115, 22],
    PARTIAL: [245, 158, 11],
  };
  const sc = statusColors[invoice.status] ?? [156, 163, 175];
  doc.setFillColor(...sc);
  doc.roundedRect(pageW - margin - 28, 29, 28, 8, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.status, pageW - margin - 14, 34.5, { align: "center" });

  y = 52;
  doc.setTextColor(...GRAY_MED);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Issue Date:  ${formatDate(invoice.issueDate)}`, margin, y);
  doc.text(`Due Date:    ${formatDate(invoice.dueDate)}`, margin + 80, y);
  doc.text(`Currency:    ${invoice.currency}`, margin + 160, y);
  y += 12;

  doc.setFillColor(...accent);
  doc.rect(margin, y, 80, 8, "F");
  doc.rect(pageW / 2, y, 80, 8, "F");

  doc.setTextColor(...primary);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BILL FROM", margin + 2, y + 5.5);
  doc.text("BILL TO", pageW / 2 + 2, y + 5.5);
  y += 12;

  doc.setTextColor(...GRAY_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(businessName, margin, y);

  let businessY = y + 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY_MED);
  const businessLines = [
    invoice.user.businessAddress,
    invoice.user.businessCity,
    invoice.user.businessPhone ? `Tel: ${invoice.user.businessPhone}` : null,
    invoice.user.businessEmail,
    invoice.user.vatNumber ? `VAT: ${invoice.user.vatNumber}` : null,
  ].filter(Boolean) as string[];
  businessLines.forEach((line) => {
    doc.text(line, margin, businessY);
    businessY += 5;
  });

  const clientX = pageW / 2;
  let clientY = y;
  doc.setTextColor(...GRAY_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(invoice.client.name, clientX, clientY);
  clientY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY_MED);
  const clientLines = [
    invoice.client.email,
    invoice.client.phone ? `Tel: ${invoice.client.phone}` : null,
    invoice.client.address,
    invoice.client.city,
    invoice.client.country,
    invoice.client.vatNumber ? `VAT: ${invoice.client.vatNumber}` : null,
  ].filter(Boolean) as string[];
  clientLines.forEach((line) => {
    doc.text(line, clientX, clientY);
    clientY += 5;
  });

  y = Math.max(businessY, clientY) + 8;

  autoTable(doc, {
    startY: y,
    head: [["#", "Description", "Qty", "Unit Price", "Tax %", "Amount"]],
    body: invoice.lineItems.map((item, index) => [
      String(index + 1),
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice, invoice.currency),
      `${item.taxRate}%`,
      formatCurrency(item.amount, invoice.currency),
    ]),
    headStyles: {
      fillColor: [...primary],
      textColor: [...WHITE],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [...GRAY_DARK],
      cellPadding: 4,
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 70 },
      2: { cellWidth: 18, halign: "center" },
      3: { cellWidth: 32, halign: "right" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 30, halign: "right" },
    },
    margin: { left: margin, right: margin },
    theme: "grid",
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  const totalsX = pageW - margin - 80;

  const addTotalsRow = (label: string, value: string, bold = false, highlight = false) => {
    if (highlight) {
      doc.setFillColor(...primary);
      doc.rect(totalsX - 4, y - 5, 84, 9, "F");
      doc.setTextColor(...WHITE);
    } else {
      const color = bold ? GRAY_DARK : GRAY_MED;
      doc.setTextColor(color[0], color[1], color[2]);
    }

    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.text(label, totalsX, y);
    doc.text(value, pageW - margin, y, { align: "right" });
    y += 8;
  };

  addTotalsRow("Subtotal", formatCurrency(invoice.subtotal, invoice.currency));
  if (invoice.discountPct > 0) {
    addTotalsRow(
      `Discount (${invoice.discountPct}%)`,
      `- ${formatCurrency(invoice.discountAmount, invoice.currency)}`,
    );
  }
  if (invoice.taxRate > 0) {
    addTotalsRow(`VAT (${invoice.taxRate}%)`, formatCurrency(invoice.taxAmount, invoice.currency));
  }

  doc.setDrawColor(...primary);
  doc.setLineWidth(0.3);
  doc.line(totalsX, y, pageW - margin, y);
  y += 4;

  addTotalsRow("TOTAL", formatCurrency(invoice.totalAmount, invoice.currency), true);
  if ((invoice.paidAmount ?? 0) > 0) {
    addTotalsRow("Paid", `- ${formatCurrency(invoice.paidAmount ?? 0, invoice.currency)}`);
  }
  addTotalsRow("BALANCE DUE", formatCurrency(invoice.balanceDue, invoice.currency), true, true);
  y += 12;

  if (invoice.notes) {
    doc.setTextColor(...GRAY_DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Notes", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_MED);
    const noteLines = doc.splitTextToSize(invoice.notes, pageW - margin * 2);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 5 + 8;
  }

  if (invoice.terms) {
    doc.setTextColor(...GRAY_DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Terms & Conditions", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_MED);
    const termLines = doc.splitTextToSize(invoice.terms, pageW - margin * 2);
    doc.text(termLines, margin, y);
  }

  doc.setFillColor(...accent);
  doc.rect(0, pageH - 18, pageW, 18, "F");
  doc.setTextColor(...primary);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    `Generated for ${businessName} · ${invoice.invoiceNumber} · Thank you for your business!`,
    pageW / 2,
    pageH - 7,
    { align: "center" },
  );

  return doc.output("arraybuffer") as unknown as Uint8Array;
}
