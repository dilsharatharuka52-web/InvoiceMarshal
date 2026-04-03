"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createInvoice, updateInvoice } from "@/actions/invoice.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvoiceFormProps {
  clients: {
    id: string;
    name: string;
    email: string;
  }[];
  defaultCurrency: string;
  mode?: "create" | "edit";
  invoiceId?: string;
  initialValues?: {
    clientId: string;
    issueDate: string;
    dueDate: string;
    currency: string;
    taxRate: number;
    discountPct: number;
    notes: string;
    terms: string;
    recurrenceEnabled: boolean;
    recurrenceFrequency: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
    autoSendRecurring: boolean;
    reminderEnabled: boolean;
    reminderFrequency: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
    lineItems: LineItemState[];
  };
}

interface LineItemState {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export function InvoiceForm({
  clients,
  defaultCurrency,
  mode = "create",
  invoiceId,
  initialValues,
}: InvoiceFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    .toISOString()
    .slice(0, 10);

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    clientId: initialValues?.clientId ?? clients[0]?.id ?? "",
    issueDate: initialValues?.issueDate ?? today,
    dueDate: initialValues?.dueDate ?? dueDate,
    currency: initialValues?.currency ?? defaultCurrency,
    taxRate: initialValues?.taxRate ?? 18,
    discountPct: initialValues?.discountPct ?? 0,
    notes: initialValues?.notes ?? "",
    terms: initialValues?.terms ?? "Payment due within 30 days.",
    recurrenceEnabled: initialValues?.recurrenceEnabled ?? false,
    recurrenceFrequency: initialValues?.recurrenceFrequency ?? "NONE",
    autoSendRecurring: initialValues?.autoSendRecurring ?? false,
    reminderEnabled: initialValues?.reminderEnabled ?? true,
    reminderFrequency: initialValues?.reminderFrequency ?? "WEEKLY",
  });
  const [lineItems, setLineItems] = useState<LineItemState[]>(
    initialValues?.lineItems?.length
      ? initialValues.lineItems
      : [{ description: "Design services", quantity: 1, unitPrice: 15000, taxRate: 18 }],
  );

  function updateLineItem(index: number, key: keyof LineItemState, value: string) {
    setLineItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]:
                key === "description"
                  ? value
                  : Number.parseFloat(value || "0"),
            }
          : item,
      ),
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        issueDate: new Date(form.issueDate).toISOString(),
        dueDate: new Date(form.dueDate).toISOString(),
        taxRate: Number(form.taxRate),
        discountPct: Number(form.discountPct),
        lineItems: lineItems.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          taxRate: Number(item.taxRate),
        })),
      };

      const result =
        mode === "edit" && invoiceId
          ? await updateInvoice(invoiceId, payload)
          : await createInvoice(payload);

      toast.success(
        mode === "edit" ? "Invoice updated successfully." : "Invoice created successfully.",
      );
      router.push(`/invoices/${result.invoice.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="clientId">Client</Label>
          <select
            id="clientId"
            value={form.clientId}
            onChange={(event) => setForm((current) => ({ ...current, clientId: event.target.value }))}
            className="mt-1 flex h-10 w-full rounded-lg border border-brand-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={form.issueDate}
            onChange={(event) => setForm((current) => ({ ...current, issueDate: event.target.value }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            value={form.currency}
            onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}
            className="mt-1 flex h-10 w-full rounded-lg border border-brand-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {["LKR", "USD", "EUR", "GBP", "INR", "AED"].map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="taxRate">Default Tax %</Label>
          <Input
            id="taxRate"
            type="number"
            min="0"
            max="100"
            value={form.taxRate}
            onChange={(event) => setForm((current) => ({ ...current, taxRate: Number(event.target.value) }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="discountPct">Discount %</Label>
          <Input
            id="discountPct"
            type="number"
            min="0"
            max="100"
            value={form.discountPct}
            onChange={(event) => setForm((current) => ({ ...current, discountPct: Number(event.target.value) }))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
        <p className="text-sm text-gray-500">Add each billable item to the invoice.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setLineItems((current) => [
                ...current,
                { description: "", quantity: 1, unitPrice: 0, taxRate: form.taxRate },
              ])
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {lineItems.map((item, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-brand-100 bg-white p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(event) => updateLineItem(index, "description", event.target.value)}
              />
              <Input
                type="number"
                min="1"
                step="0.01"
                placeholder="Qty"
                value={item.quantity}
                onChange={(event) => updateLineItem(index, "quantity", event.target.value)}
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(event) => updateLineItem(index, "unitPrice", event.target.value)}
              />
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Tax %"
                value={item.taxRate}
                onChange={(event) => updateLineItem(index, "taxRate", event.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setLineItems((current) =>
                    current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                aria-label="Remove line item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            rows={4}
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>
        <div>
          <Label htmlFor="terms">Terms</Label>
          <textarea
            id="terms"
            rows={4}
            value={form.terms}
            onChange={(event) => setForm((current) => ({ ...current, terms: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>
      </div>

      <div className="grid gap-6 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recurring Invoice</h3>
            <p className="text-sm text-gray-500">
              Generate the next invoice automatically on a daily, weekly, or monthly cycle.
            </p>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.recurrenceEnabled}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  recurrenceEnabled: event.target.checked,
                  recurrenceFrequency: event.target.checked
                    ? current.recurrenceFrequency === "NONE"
                      ? "MONTHLY"
                      : current.recurrenceFrequency
                    : "NONE",
                }))
              }
            />
            Enable recurring invoice schedule
          </label>

          <div>
            <Label htmlFor="recurrenceFrequency">Recurring Frequency</Label>
            <select
              id="recurrenceFrequency"
              value={form.recurrenceFrequency}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  recurrenceFrequency: event.target.value as
                    | "NONE"
                    | "DAILY"
                    | "WEEKLY"
                    | "MONTHLY",
                  recurrenceEnabled: event.target.value !== "NONE",
                }))
              }
              className="mt-1 flex h-10 w-full rounded-lg border border-brand-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {["NONE", "DAILY", "WEEKLY", "MONTHLY"].map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency === "NONE"
                    ? "Off"
                    : frequency.charAt(0) + frequency.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.autoSendRecurring}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  autoSendRecurring: event.target.checked,
                }))
              }
            />
            Auto-send recurring invoices when created
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Reminder</h3>
            <p className="text-sm text-gray-500">
              Keep following up with customers who have not paid yet.
            </p>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.reminderEnabled}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  reminderEnabled: event.target.checked,
                  reminderFrequency: event.target.checked
                    ? current.reminderFrequency === "NONE"
                      ? "WEEKLY"
                      : current.reminderFrequency
                    : "NONE",
                }))
              }
            />
            Enable unpaid reminder emails
          </label>

          <div>
            <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
            <select
              id="reminderFrequency"
              value={form.reminderFrequency}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  reminderFrequency: event.target.value as
                    | "NONE"
                    | "DAILY"
                    | "WEEKLY"
                    | "MONTHLY",
                  reminderEnabled: event.target.value !== "NONE",
                }))
              }
              className="mt-1 flex h-10 w-full rounded-lg border border-brand-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {["NONE", "DAILY", "WEEKLY", "MONTHLY"].map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency === "NONE"
                    ? "Off"
                    : frequency.charAt(0) + frequency.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={submitting || !form.clientId}>
          {submitting
            ? mode === "edit"
              ? "Saving changes..."
              : "Creating invoice..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
