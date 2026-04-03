"use server";

import { revalidatePath } from "next/cache";
import { requireAppUser, requireClerkId } from "@/lib/auth-user";
import { businessSettingsSchema, onboardingSchema } from "@/lib/validations";

async function getAuthenticatedUser() {
  return requireAppUser();
}

export async function onboardUser(raw: unknown) {
  const clerkId = await requireClerkId();

  const data = onboardingSchema.parse(raw);
  const existing = await getAuthenticatedUser();

  if (existing.isOnboarded) {
    return { success: true, alreadyOnboarded: true };
  }

  const { prisma } = await import("@/lib/db");
  await prisma.user.update({
    where: { clerkId },
    data: {
      ...data,
      logoUrl: data.logoUrl || null,
      businessEmail: existing.businessEmail ?? existing.email,
      isOnboarded: true,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getCurrentUser() {
  return getAuthenticatedUser();
}

export async function updateBusinessSettings(raw: unknown) {
  const user = await getAuthenticatedUser();
  const data = businessSettingsSchema.parse(raw);

  const { prisma } = await import("@/lib/db");
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      businessName: data.businessName,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      businessAddress: data.businessAddress,
      businessCity: data.businessCity,
      vatNumber: data.vatNumber || null,
      logoUrl: data.logoUrl || null,
      brandPrimaryColor: data.brandPrimaryColor,
      brandAccentColor: data.brandAccentColor,
      invoicePrefix: data.invoicePrefix.toUpperCase(),
      defaultCurrency: data.defaultCurrency,
      defaultTaxRate: data.defaultTaxRate,
      defaultDueDays: data.defaultDueDays,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/invoices");
  return { success: true, user: updatedUser };
}
