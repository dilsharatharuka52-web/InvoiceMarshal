import Link from "next/link";
import { Plus } from "lucide-react";
import { getClients } from "@/actions/client.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Clients</h1>
          <p className="mt-1 text-gray-500">Manage your customer list and billing contacts.</p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>All clients available for new invoices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {clients.length === 0 ? (
            <p className="text-sm text-gray-500">
              No clients yet. Add your first client to begin invoicing.
            </p>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                className="grid gap-2 rounded-xl border border-brand-100 p-4 md:grid-cols-[1.2fr_1fr_1fr]"
              >
                <div>
                  <p className="font-semibold text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
                <p className="text-sm text-gray-600">{client.phone || "No phone"}</p>
                <p className="text-sm text-gray-600">{client.city || client.country || "No location"}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
