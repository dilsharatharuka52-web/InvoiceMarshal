import { notFound } from "next/navigation";
import { getClients } from "@/actions/client.actions";
import { getInvoiceById } from "@/actions/invoice.actions";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const [invoice, clients] = await Promise.all([
    getInvoiceById(invoiceId),
    getClients(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">Edit Invoice</h1>
        <p className="mt-1 text-gray-500">
          Update invoice details, line items, and payment terms.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{invoice.invoiceNumber}</CardTitle>
          <CardDescription>
            Changes will regenerate the PDF the next time it is requested or sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            mode="edit"
            invoiceId={invoice.id}
            clients={clients.map((client) => ({
              id: client.id,
              name: client.name,
              email: client.email,
            }))}
            defaultCurrency={invoice.currency}
            initialValues={{
              clientId: invoice.clientId,
              issueDate: new Date(invoice.issueDate).toISOString().slice(0, 10),
              dueDate: new Date(invoice.dueDate).toISOString().slice(0, 10),
              currency: invoice.currency,
              taxRate: invoice.taxRate,
              discountPct: invoice.discountPct,
              notes: invoice.notes ?? "",
              terms: invoice.terms ?? "",
              recurrenceEnabled: invoice.recurrenceEnabled,
              recurrenceFrequency: invoice.recurrenceFrequency,
              autoSendRecurring: invoice.autoSendRecurring,
              reminderEnabled: invoice.reminderEnabled,
              reminderFrequency: invoice.reminderFrequency,
              lineItems: invoice.lineItems.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
              })),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
