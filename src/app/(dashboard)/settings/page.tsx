import { redirect } from "next/navigation";
import { requireAppUser } from "@/lib/auth-user";
import { BusinessSettingsForm } from "@/components/settings/business-settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  let user;
  try {
    user = await requireAppUser();
  } catch {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">Settings</h1>
        <p className="mt-1 text-gray-500">
          Review the business profile and defaults currently stored for your account.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>Information used on invoices and outgoing email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Business Name</span>
              <span className="font-medium text-gray-900">
                {user.businessName || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900">{user.businessEmail || user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-900">
                {user.businessPhone || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">VAT Number</span>
              <span className="font-medium text-gray-900">{user.vatNumber || "Not set"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Settings</CardTitle>
            <CardDescription>
              Control the logo, brand colors, and invoice defaults used for customer-facing documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BusinessSettingsForm
              initialValues={{
                businessName: user.businessName || "",
                businessEmail: user.businessEmail || user.email,
                businessPhone: user.businessPhone || "",
                businessAddress: user.businessAddress || "",
                businessCity: user.businessCity || "",
                vatNumber: user.vatNumber || "",
                logoUrl: user.logoUrl || "",
                brandPrimaryColor: user.brandPrimaryColor,
                brandAccentColor: user.brandAccentColor,
                invoicePrefix: user.invoicePrefix,
                defaultCurrency: user.defaultCurrency,
                defaultTaxRate: user.defaultTaxRate,
                defaultDueDays: user.defaultDueDays,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
