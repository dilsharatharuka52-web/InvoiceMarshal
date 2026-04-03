import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RecentInvoicesProps {
  invoices: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    balanceDue: number;
    dueDate: Date;
    status: string;
    client: {
      name: string;
    };
  }[];
  currency: string;
}

export function RecentInvoices({ invoices, currency }: RecentInvoicesProps) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-100 p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          <p className="text-sm text-gray-500">Latest activity across your account</p>
        </div>
        <Link href="/invoices">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-brand-50">
        {invoices.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No invoices yet. Create your first invoice to get started.</div>
        ) : (
          invoices.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/invoices/${invoice.id}`}
              className="grid gap-3 p-6 transition-colors hover:bg-brand-50/50 md:grid-cols-[1.2fr_1fr_1fr_auto]"
            >
              <div>
                <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-500">{invoice.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium text-gray-900">
                  {formatCurrency(invoice.totalAmount, currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due</p>
                <p className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
              <div className="flex items-center justify-end gap-3">
                {invoice.balanceDue > 0 && (
                  <span className="text-sm font-medium text-red-600">
                    {formatCurrency(invoice.balanceDue, currency)}
                  </span>
                )}
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
