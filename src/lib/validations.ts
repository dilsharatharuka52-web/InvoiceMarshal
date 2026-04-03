import { z } from "zod";

const logoValueSchema = z
  .string()
  .max(3_000_000, "Logo image is too large")
  .refine(
    (value) =>
      value === "" ||
      /^https?:\/\/.+/i.test(value) ||
      /^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(value),
    "Upload an image file or use a valid logo value",
  );

export const onboardingSchema = z.object({
  firstName: z.string().min(2, "Min 2 chars").max(50),
  lastName: z.string().min(2, "Min 2 chars").max(50),
  businessName: z.string().min(2, "Min 2 chars").max(100),
  businessAddress: z.string().min(5, "Min 5 chars").max(300),
  businessCity: z.string().min(2).max(100),
  businessPhone: z.string().regex(/^\+?[0-9\s\-]{7,15}$/, "Invalid phone"),
  vatNumber: z.string().optional(),
  logoUrl: logoValueSchema.optional(),
  brandPrimaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use a valid hex color")
    .default("#6D28D9"),
  brandAccentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use a valid hex color")
    .default("#F5F3FF"),
  defaultCurrency: z
    .enum(["LKR", "USD", "EUR", "GBP", "INR", "AED"])
    .default("LKR"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const clientSchema = z.object({
  name: z.string().min(2, "Client name required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  vatNumber: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;

export const lineItemSchema = z.object({
  description: z
    .string()
    .min(1, "Description required")
    .max(500)
    .refine(
      (val) => !/<script|javascript:|on\w+=/i.test(val),
      "Invalid characters detected",
    ),
  quantity: z.number().positive("Must be > 0").max(100000),
  unitPrice: z.number().nonnegative("Must be ≥ 0").max(100000000),
  taxRate: z.number().min(0).max(100).default(0),
});

export type LineItemInput = z.infer<typeof lineItemSchema>;

export const invoiceSchema = z.object({
  clientId: z.string().cuid("Invalid client ID"),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  currency: z.enum(["LKR", "USD", "EUR", "GBP", "INR", "AED"]),
  taxRate: z.number().min(0).max(100).default(0),
  discountPct: z.number().min(0).max(100).default(0),
  notes: z.string().max(1000).optional(),
  terms: z.string().max(500).optional(),
  recurrenceEnabled: z.boolean().default(false),
  recurrenceFrequency: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]).default("NONE"),
  autoSendRecurring: z.boolean().default(false),
  reminderEnabled: z.boolean().default(true),
  reminderFrequency: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]).default("WEEKLY"),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item required").max(50),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

export const businessSettingsSchema = z.object({
  businessName: z.string().min(2, "Min 2 chars").max(100),
  businessEmail: z.string().email("Valid email required"),
  businessPhone: z.string().regex(/^\+?[0-9\s\-]{7,15}$/, "Invalid phone"),
  businessAddress: z.string().min(5, "Min 5 chars").max(300),
  businessCity: z.string().min(2, "Min 2 chars").max(100),
  vatNumber: z.string().max(50).optional(),
  logoUrl: logoValueSchema.optional(),
  brandPrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use a valid hex color"),
  brandAccentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use a valid hex color"),
  invoicePrefix: z.string().min(2, "Min 2 chars").max(10),
  defaultCurrency: z.enum(["LKR", "USD", "EUR", "GBP", "INR", "AED"]),
  defaultTaxRate: z.number().min(0).max(100),
  defaultDueDays: z.number().int().min(1).max(365),
});

export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>;

export const paymentSchema = z.object({
  invoiceId: z.string().cuid(),
  amount: z.number().positive("Amount must be > 0"),
  method: z.enum(["BANK_TRANSFER", "CASH", "CHEQUE", "CARD", "ONLINE", "OTHER"]),
  reference: z.string().max(100).optional(),
  note: z.string().max(300).optional(),
  paidAt: z.string().datetime().optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
