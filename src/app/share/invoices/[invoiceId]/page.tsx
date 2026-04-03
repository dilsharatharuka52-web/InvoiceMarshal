import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PublicInvoiceSharePage({
  params,
  searchParams,
}: {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { invoiceId } = await params;
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      shareToken: token,
    },
    include: {
      client: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
      user: true,
    },
  });

  if (!invoice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-50/30 px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{invoice.invoiceNumber}</CardTitle>
            <CardDescription>
              Shared invoice from {invoice.user.businessName ?? "InvoiceMarshal"} for {invoice.client.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm text-gray-600 md:grid-cols-2">
              <div className="flex justify-between rounded-xl border border-brand-100 bg-white p-4">
                <span>Issue Date</span>
                <span className="font-medium text-gray-900">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between rounded-xl border border-brand-100 bg-white p-4">
                <span>Due Date</span>
                <span className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="flex justify-between rounded-xl border border-brand-100 bg-white p-4">
                <span>Total</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between rounded-xl border border-brand-100 bg-white p-4">
                <span>Balance Due</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.balanceDue, invoice.currency)}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-brand-100 bg-white">
              <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-brand-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span>Description</span>
                <span>Qty</span>
                <span className="text-right">Amount</span>
              </div>
              {invoice.lineItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[2fr_1fr_1fr] items-center border-b border-brand-50 px-4 py-3 text-sm last:border-b-0"
                >
                  <span className="text-gray-900">{item.description}</span>
                  <span className="text-gray-600">{item.quantity}</span>
                  <span className="text-right font-medium text-gray-900">
                    {formatCurrency(item.amount, invoice.currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`/api/share/invoices/${invoice.id}/pdf?token=${token}`} target="_blank">
                <Button>Open PDF</Button>
              </Link>
              {invoice.user.businessEmail && (
                <Link href={`mailto:${invoice.user.businessEmail}`}>
                  <Button variant="outline">Contact Sender</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
