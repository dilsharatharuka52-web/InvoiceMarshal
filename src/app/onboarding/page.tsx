"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { onboardUser } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      defaultCurrency: "LKR",
      brandPrimaryColor: "#6D28D9",
      brandAccentColor: "#F5F3FF",
      logoUrl: "",
    },
  });

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
      setLogoPreview(result);
      setValue("logoUrl", result, { shouldValidate: true });
    };
    reader.onerror = () => {
      toast.error("Failed to read the selected logo.");
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(data: OnboardingInput) {
    setLoading(true);
    try {
      await onboardUser(data);
      toast.success("Business profile saved.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-brand-soft flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in rounded-2xl border border-brand-100 bg-white p-8 shadow-violet-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-700">Set Up Your Business</h1>
            <p className="text-sm text-gray-500">This information appears on your invoices.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} className="mt-1" />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} className="mt-1" />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="businessName">Business / Company Name</Label>
            <Input
              id="businessName"
              {...register("businessName")}
              placeholder="Your Business (Pvt) Ltd"
              className="mt-1"
            />
            {errors.businessName && (
              <p className="mt-1 text-xs text-red-500">{errors.businessName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="businessAddress">Business Address</Label>
            <Input
              id="businessAddress"
              {...register("businessAddress")}
              placeholder="No. 45, Galle Road"
              className="mt-1"
            />
            {errors.businessAddress && (
              <p className="mt-1 text-xs text-red-500">
                {errors.businessAddress.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessCity">City</Label>
              <Input
                id="businessCity"
                {...register("businessCity")}
                placeholder="Colombo"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="businessPhone">Phone</Label>
              <Input
                id="businessPhone"
                {...register("businessPhone")}
                placeholder="+94 77 123 4567"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vatNumber">VAT Registration No. (optional)</Label>
              <Input
                id="vatNumber"
                {...register("vatNumber")}
                placeholder="VAT123456789"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <select
                id="defaultCurrency"
                defaultValue="LKR"
                onChange={(event) =>
                  setValue("defaultCurrency", event.target.value as OnboardingInput["defaultCurrency"])
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
          </div>

          <input type="hidden" {...register("logoUrl")} />

          <div>
            <Label htmlFor="logoFile">Company Logo (optional)</Label>
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
            <p className="mt-1 text-xs text-gray-500">Choose a local image file up to 2MB.</p>
            {errors.logoUrl && (
              <p className="mt-1 text-xs text-red-500">{errors.logoUrl.message}</p>
            )}
            {logoPreview && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/40 p-3">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-12 w-12 rounded-lg bg-white object-contain p-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Logo selected</p>
                  <p className="text-xs text-gray-500">This file will be used on your invoices.</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setLogoPreview("");
                    setValue("logoUrl", "", { shouldValidate: true });
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brandPrimaryColor">Primary Brand Color</Label>
              <Input
                id="brandPrimaryColor"
                type="color"
                {...register("brandPrimaryColor")}
                className="mt-1 h-10 p-1"
              />
              {errors.brandPrimaryColor && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.brandPrimaryColor.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="brandAccentColor">Accent Brand Color</Label>
              <Input
                id="brandAccentColor"
                type="color"
                {...register("brandAccentColor")}
                className="mt-1 h-10 p-1"
              />
              {errors.brandAccentColor && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.brandAccentColor.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 w-full text-base font-semibold text-white shadow-violet-md hover:opacity-90 gradient-brand"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up your account...
              </>
            ) : (
              "Complete Setup & Go to Dashboard"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
