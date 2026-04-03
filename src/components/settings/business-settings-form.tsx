"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateBusinessSettings } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessSettingsFormProps {
  initialValues: {
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    businessAddress: string;
    businessCity: string;
    vatNumber: string;
    logoUrl: string;
    brandPrimaryColor: string;
    brandAccentColor: string;
    invoicePrefix: string;
    defaultCurrency: "LKR" | "USD" | "EUR" | "GBP" | "INR" | "AED";
    defaultTaxRate: number;
    defaultDueDays: number;
  };
}

export function BusinessSettingsForm({ initialValues }: BusinessSettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialValues);

  async function handleLogoSelect(file: File | null) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo image must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((current) => ({ ...current, logoUrl: result }));
    };
    reader.onerror = () => {
      toast.error("Failed to read the selected logo.");
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      await updateBusinessSettings({
        ...form,
        defaultTaxRate: Number(form.defaultTaxRate),
        defaultDueDays: Number(form.defaultDueDays),
      });
      toast.success("Business branding updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="businessName">Brand / Business Name</Label>
          <Input
            id="businessName"
            value={form.businessName}
            onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="businessEmail">Business Email</Label>
          <Input
            id="businessEmail"
            type="email"
            value={form.businessEmail}
            onChange={(event) => setForm((current) => ({ ...current, businessEmail: event.target.value }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="businessPhone">Business Phone</Label>
          <Input
            id="businessPhone"
            value={form.businessPhone}
            onChange={(event) => setForm((current) => ({ ...current, businessPhone: event.target.value }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="vatNumber">VAT Number</Label>
          <Input
            id="vatNumber"
            value={form.vatNumber}
            onChange={(event) => setForm((current) => ({ ...current, vatNumber: event.target.value }))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="businessAddress">Business Address</Label>
          <Input
            id="businessAddress"
            value={form.businessAddress}
            onChange={(event) => setForm((current) => ({ ...current, businessAddress: event.target.value }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="businessCity">Business City</Label>
          <Input
            id="businessCity"
            value={form.businessCity}
            onChange={(event) => setForm((current) => ({ ...current, businessCity: event.target.value }))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Label htmlFor="logoFile">Company Logo</Label>
          <Input
            id="logoFile"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(event) => {
              void handleLogoSelect(event.target.files?.[0] ?? null);
              event.currentTarget.value = "";
            }}
            className="mt-1 cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500">Upload a local image file up to 2MB.</p>
          {form.logoUrl && (
            <Button
              type="button"
              variant="ghost"
              className="mt-2 h-auto px-0 text-sm"
              onClick={() => setForm((current) => ({ ...current, logoUrl: "" }))}
            >
              Remove logo
            </Button>
          )}
        </div>
        <div>
          <Label htmlFor="brandPrimaryColor">Primary Color</Label>
          <Input
            id="brandPrimaryColor"
            type="color"
            value={form.brandPrimaryColor}
            onChange={(event) =>
              setForm((current) => ({ ...current, brandPrimaryColor: event.target.value }))
            }
            className="mt-1 h-10 p-1"
          />
        </div>
        <div>
          <Label htmlFor="brandAccentColor">Accent Color</Label>
          <Input
            id="brandAccentColor"
            type="color"
            value={form.brandAccentColor}
            onChange={(event) =>
              setForm((current) => ({ ...current, brandAccentColor: event.target.value }))
            }
            className="mt-1 h-10 p-1"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-5">
        <p className="text-sm font-semibold text-gray-900">Invoice Brand Preview</p>
        <p className="mt-1 text-sm text-gray-500">
          Your logo, business name, and colors will appear on invoice PDFs and emails.
        </p>
        <div
          className="mt-4 overflow-hidden rounded-2xl border bg-white"
          style={{ borderColor: form.brandAccentColor }}
        >
          <div
            className="flex items-center gap-3 px-5 py-4 text-white"
            style={{ backgroundColor: form.brandPrimaryColor }}
          >
            {form.logoUrl ? (
              <img src={form.logoUrl} alt="Brand logo preview" className="h-10 w-10 rounded-lg bg-white/10 object-contain p-1" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-sm font-bold">
                {form.businessName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm opacity-80">Branded Invoice</p>
              <p className="text-lg font-semibold">{form.businessName}</p>
            </div>
          </div>
          <div className="space-y-2 px-5 py-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Invoice Prefix</span>
              <span className="font-medium text-gray-900">{form.invoicePrefix.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Default Currency</span>
              <span className="font-medium text-gray-900">{form.defaultCurrency}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
          <Input
            id="invoicePrefix"
            value={form.invoicePrefix}
            onChange={(event) => setForm((current) => ({ ...current, invoicePrefix: event.target.value.toUpperCase() }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="defaultCurrency">Default Currency</Label>
          <select
            id="defaultCurrency"
            value={form.defaultCurrency}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                defaultCurrency: event.target.value as BusinessSettingsFormProps["initialValues"]["defaultCurrency"],
              }))
            }
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
          <Label htmlFor="defaultTaxRate">Default Tax %</Label>
          <Input
            id="defaultTaxRate"
            type="number"
            min="0"
            max="100"
            value={form.defaultTaxRate}
            onChange={(event) => setForm((current) => ({ ...current, defaultTaxRate: Number(event.target.value) }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="defaultDueDays">Default Due Days</Label>
          <Input
            id="defaultDueDays"
            type="number"
            min="1"
            max="365"
            value={form.defaultDueDays}
            onChange={(event) => setForm((current) => ({ ...current, defaultDueDays: Number(event.target.value) }))}
            className="mt-1"
          />
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving branding...
          </>
        ) : (
          "Save Brand Settings"
        )}
      </Button>
    </form>
  );
}
