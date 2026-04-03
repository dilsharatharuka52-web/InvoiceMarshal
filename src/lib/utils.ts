import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "LKR") {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM dd, yyyy");
}

export function generateInvoiceNumber(prefix: string, num: number) {
  const year = new Date().getFullYear();
  const paddedNum = String(num).padStart(4, "0");
  return `${prefix}-${year}-${paddedNum}`;
}

export function calculateInvoiceTotals(
  lineItems: { quantity: number; unitPrice: number; taxRate: number }[],
  discountPct = 0,
) {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const discountAmount = subtotal * (discountPct / 100);
  const discountedSubtotal = subtotal - discountAmount;

  const taxAmount = lineItems.reduce((sum, item) => {
    const lineTotal = item.quantity * item.unitPrice;
    return sum + lineTotal * (item.taxRate / 100);
  }, 0);

  const totalAmount = discountedSubtotal + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    totalAmount,
  };
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
    SENT: "bg-blue-100 text-blue-700 border-blue-200",
    PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
    OVERDUE: "bg-red-100 text-red-700 border-red-200",
    CANCELLED: "bg-orange-100 text-orange-700 border-orange-200",
    PARTIAL: "bg-amber-100 text-amber-700 border-amber-200",
  };

  return map[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function getDaysOverdue(dueDate: Date | string) {
  const due = new Date(dueDate);
  const today = new Date();
  const diffMs = today.getTime() - due.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function addScheduleFrequency(
  date: Date | string,
  frequency: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY",
) {
  const value = new Date(date);

  if (frequency === "DAILY") {
    value.setDate(value.getDate() + 1);
  } else if (frequency === "WEEKLY") {
    value.setDate(value.getDate() + 7);
  } else if (frequency === "MONTHLY") {
    value.setMonth(value.getMonth() + 1);
  }

  return value;
}

export function formatScheduleFrequency(
  frequency: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY",
) {
  if (frequency === "NONE") {
    return "Off";
  }

  return frequency.charAt(0) + frequency.slice(1).toLowerCase();
}

export function normalizeHexColor(value: string | null | undefined, fallback: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value ?? "") ? value! : fallback;
}

export function hexToRgbTuple(value: string | null | undefined, fallback: string) {
  const normalized = normalizeHexColor(value, fallback).slice(1);

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ] as const;
}

export function sanitizePhoneNumber(value: string | null | undefined) {
  return (value ?? "").replace(/[^\d]/g, "");
}

export function getAppBaseUrl() {
  const rawValue =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return rawValue.replace(/\/+$/, "");
}
