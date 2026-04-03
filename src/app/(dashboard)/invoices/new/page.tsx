import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAppUser } from "@/lib/auth-user";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

export default async function NewInvoicePage() {
  let appUser;
  try {
    appUser = await requireAppUser();
  } catch {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: appUser.id },
    include: { clients: { orderBy: { name: "asc" } } },
  });
  if (!user) {
    redirect("/sign-in");
  }

  if (user.clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create a client first</CardTitle>
          <CardDescription>
            You need at least one client before you can issue an invoice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/clients/new">
            <Button>Add Client</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">New Invoice</h1>
        <p className="mt-1 text-gray-500">Build a new invoice and save it as a draft.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>
            Complete the billing details, add line items, and save the invoice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            clients={user.clients.map((client) => ({
              id: client.id,
              name: client.name,
              email: client.email,
            }))}
            defaultCurrency={user.defaultCurrency}
            initialValues={{
              clientId: user.clients[0]?.id ?? "",
              issueDate: new Date().toISOString().slice(0, 10),
              dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * user.defaultDueDays)
                .toISOString()
                .slice(0, 10),
              currency: user.defaultCurrency,
              taxRate: user.defaultTaxRate,
              discountPct: 0,
              notes: "",
              terms: "Payment due within 30 days.",
              recurrenceEnabled: false,
              recurrenceFrequency: "NONE",
              autoSendRecurring: false,
              reminderEnabled: true,
              reminderFrequency: "WEEKLY",
              lineItems: [
                {
                  description: "Design services",
                  quantity: 1,
                  unitPrice: 15000,
                  taxRate: user.defaultTaxRate,
                },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
