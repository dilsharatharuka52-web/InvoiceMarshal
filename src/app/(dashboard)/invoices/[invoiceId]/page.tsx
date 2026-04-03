import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  deleteInvoice,
  generateAndStorePDF,
  getInvoiceById,
  runScheduledInvoiceJobs,
  sendReminder,
  sendInvoice,
} from "@/actions/invoice.actions";
import { InvoiceShareActions } from "@/components/invoices/invoice-share-actions";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, formatScheduleFrequency } from "@/lib/utils";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    notFound();
  }

  async function generatePdfAction() {
    "use server";
    await generateAndStorePDF(invoiceId);
  }

  async function sendInvoiceAction() {
    "use server";
    await sendInvoice(invoiceId);
  }

  async function recordPaymentAction(formData: FormData) {
    "use server";

    const { recordPayment } = await import("@/actions/invoice.actions");

    await recordPayment({
      invoiceId,
      amount: Number(formData.get("amount")),
      method: formData.get("method"),
      reference: String(formData.get("reference") || ""),
      note: String(formData.get("note") || ""),
      paidAt: new Date().toISOString(),
    });
  }

  async function deleteInvoiceAction() {
    "use server";
    await deleteInvoice(invoiceId);
    redirect("/invoices");
  }

  async function sendReminderAction() {
    "use server";
    await sendReminder(invoiceId);
  }

  async function runScheduleAction() {
    "use server";
    await runScheduledInvoiceJobs();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-brand-700">{invoice.invoiceNumber}</h1>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="text-gray-500">
            Issued on {formatDate(invoice.issueDate)} and due by {formatDate(invoice.dueDate)}.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/invoices/${invoice.id}/edit`}>
            <Button variant="outline">Edit Invoice</Button>
          </Link>
          <form action={generatePdfAction}>
            <Button variant="outline" type="submit">
              Generate PDF
            </Button>
          </form>
          <form action={sendInvoiceAction}>
            <Button type="submit">Send Email</Button>
          </form>
          {invoice.pdfUrl && (
            <Link href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
              <Button variant="outline">Open PDF</Button>
            </Link>
          )}
          <form action={sendReminderAction}>
            <Button variant="outline" type="submit" disabled={invoice.balanceDue <= 0}>
              Send Reminder
            </Button>
          </form>
          <form action={runScheduleAction}>
            <Button variant="outline" type="submit">
              Run Schedules
            </Button>
          </form>
          <form action={deleteInvoiceAction}>
            <Button
              variant="destructive"
              type="submit"
              disabled={invoice.status === "PAID"}
            >
              Delete Invoice
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
            <CardDescription>Review the billed services and totals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-brand-100 pb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Description</span>
              <span>Qty</span>
              <span>Unit Price</span>
              <span className="text-right">Amount</span>
            </div>
            {invoice.lineItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 border-b border-brand-50 pb-3 text-sm last:border-b-0"
              >
                <span className="text-gray-900">{item.description}</span>
                <span className="text-gray-600">{item.quantity}</span>
                <span className="text-gray-600">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </span>
                <span className="text-right font-medium text-gray-900">
                  {formatCurrency(item.amount, invoice.currency)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Client</span>
                <span className="font-medium text-gray-900">{invoice.client.name}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Paid</span>
                <span>{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
              </div>
              <div className="flex justify-between border-t border-brand-100 pt-3 text-base font-semibold text-brand-700">
                <span>Balance Due</span>
                <span>{formatCurrency(invoice.balanceDue, invoice.currency)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share Invoice</CardTitle>
              <CardDescription>
                Copy invoice text or open WhatsApp and email with the invoice message.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceShareActions invoiceId={invoice.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automation</CardTitle>
              <CardDescription>
                Reminder and recurring schedule settings for this invoice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Recurring Invoice</span>
                <span className="font-medium text-gray-900">
                  {invoice.recurrenceEnabled
                    ? formatScheduleFrequency(invoice.recurrenceFrequency)
                    : "Off"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Next Recurring Date</span>
                <span className="font-medium text-gray-900">
                  {invoice.nextRecurringDate ? formatDate(invoice.nextRecurringDate) : "Not scheduled"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Reminder Schedule</span>
                <span className="font-medium text-gray-900">
                  {invoice.reminderEnabled
                    ? formatScheduleFrequency(invoice.reminderFrequency)
                    : "Off"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Next Reminder</span>
                <span className="font-medium text-gray-900">
                  {invoice.nextReminderDate ? formatDate(invoice.nextReminderDate) : "Not scheduled"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Record Payment</CardTitle>
              <CardDescription>
                Capture a payment and update the invoice balance automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={recordPaymentAction} className="space-y-3">
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0"
                  placeholder="Amount"
                  className="flex h-10 w-full rounded-lg border border-brand-200 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  required
                />
                <select
                  name="method"
                  className="flex h-10 w-full rounded-lg border border-brand-200 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  defaultValue="BANK_TRANSFER"
                >
                  {["BANK_TRANSFER", "CASH", "CHEQUE", "CARD", "ONLINE", "OTHER"].map((method) => (
                    <option key={method} value={method}>
                      {method.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="reference"
                  placeholder="Reference"
                  className="flex h-10 w-full rounded-lg border border-brand-200 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                />
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Optional note"
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                />
                <Button className="w-full" type="submit">
                  Save Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
