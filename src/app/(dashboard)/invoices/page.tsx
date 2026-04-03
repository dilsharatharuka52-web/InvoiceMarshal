import Link from "next/link";
import { Plus } from "lucide-react";
import { getInvoices } from "@/actions/invoice.actions";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Invoices</h1>
          <p className="mt-1 text-gray-500">Create, review, and send invoices.</p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] border-b border-brand-100 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <span>Invoice</span>
          <span>Client</span>
          <span>Due Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        {invoices.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No invoices yet. Create your first one to start tracking revenue.
          </div>
        ) : (
          invoices.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/invoices/${invoice.id}`}
              className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] items-center gap-4 border-b border-brand-50 px-6 py-4 text-sm transition-colors hover:bg-brand-50/50 last:border-b-0"
            >
              <div>
                <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                <p className="text-xs text-gray-500">{formatDate(invoice.issueDate)}</p>
              </div>
              <span className="text-gray-700">{invoice.client.name}</span>
              <span className="text-gray-700">{formatDate(invoice.dueDate)}</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(invoice.totalAmount, invoice.currency)}
              </span>
              <div className="flex justify-end">
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
