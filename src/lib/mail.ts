import { normalizeHexColor } from "@/lib/utils";

const MAILTRAP_TOKEN = process.env.MAILTRAP_API_TOKEN;
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL;
const SENDER_NAME = process.env.MAILTRAP_SENDER_NAME ?? "InvoiceMarshal";
const FALLBACK_PRIMARY = "#6D28D9";
const FALLBACK_ACCENT = "#F5F3FF";

interface SendInvoiceEmailParams {
  to: string;
  invoice: {
    invoiceNumber: string;
    totalAmount: number;
    balanceDue: number;
    currency: string;
    dueDate: Date;
    pdfUrl?: string | null;
    user: {
      businessName?: string | null;
      businessEmail?: string | null;
      logoUrl?: string | null;
      brandPrimaryColor?: string | null;
      brandAccentColor?: string | null;
    };
    client: { name: string };
  };
}

function ensureMailtrapConfig() {
  if (!MAILTRAP_TOKEN || !SENDER_EMAIL) {
    throw new Error("Mailtrap is not configured. Set MAILTRAP_API_TOKEN and MAILTRAP_SENDER_EMAIL.");
  }
}

function getBranding(user: {
  businessName?: string | null;
  businessEmail?: string | null;
  logoUrl?: string | null;
  brandPrimaryColor?: string | null;
  brandAccentColor?: string | null;
}) {
  return {
    businessName: user.businessName ?? "InvoiceMarshal",
    contactEmail: user.businessEmail ?? SENDER_EMAIL,
    logoUrl: user.logoUrl,
    primaryColor: normalizeHexColor(user.brandPrimaryColor, FALLBACK_PRIMARY),
    accentColor: normalizeHexColor(user.brandAccentColor, FALLBACK_ACCENT),
  };
}

async function sendMail(to: string, subject: string, html: string) {
  const response = await fetch("https://send.api.mailtrap.io/api/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MAILTRAP_TOKEN}`,
    },
    body: JSON.stringify({
      from: { email: SENDER_EMAIL, name: SENDER_NAME },
      to: [{ email: to }],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mailtrap error: ${error}`);
  }
}

export async function sendInvoiceEmail({ to, invoice }: SendInvoiceEmailParams) {
  ensureMailtrapConfig();

  const branding = getBranding(invoice.user);
  const subject = `Invoice ${invoice.invoiceNumber} from ${branding.businessName}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${branding.accentColor};font-family:Inter,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
    <div style="background:${branding.primaryColor};padding:32px 40px;">
      <div style="display:flex;align-items:center;gap:14px;">
        ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.businessName} logo" style="height:44px;width:44px;border-radius:12px;object-fit:contain;background:rgba(255,255,255,0.14);padding:6px;" />` : ""}
        <div>
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">${branding.businessName}</h1>
          <p style="color:rgba(255,255,255,0.78);margin:8px 0 0;font-size:14px;">Invoice ${invoice.invoiceNumber}</p>
        </div>
      </div>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Hello ${invoice.client.name},</h2>
      <p style="color:#6b7280;line-height:1.6;margin:0 0 24px;">
        Your invoice from ${branding.businessName} is ready. Please review the amount due and arrange payment before the due date.
      </p>
      <div style="background:${branding.accentColor};border:1px solid ${branding.primaryColor}22;border-radius:12px;padding:24px;margin:0 0 24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#6b7280;font-size:13px;padding:4px 0;">Invoice Number</td>
            <td style="color:${branding.primaryColor};font-size:13px;font-weight:600;text-align:right;">${invoice.invoiceNumber}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;font-size:13px;padding:4px 0;">Amount Due</td>
            <td style="color:#1f2937;font-size:20px;font-weight:700;text-align:right;">
              ${new Intl.NumberFormat("en-LK", { style: "currency", currency: invoice.currency }).format(invoice.balanceDue)}
            </td>
          </tr>
          <tr>
            <td style="color:#6b7280;font-size:13px;padding:4px 0;">Due Date</td>
            <td style="color:#ef4444;font-size:13px;font-weight:600;text-align:right;">
              ${new Date(invoice.dueDate).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })}
            </td>
          </tr>
        </table>
      </div>
      ${invoice.pdfUrl ? `<div style="text-align:center;margin:0 0 32px;">
        <a href="${invoice.pdfUrl}"
           style="display:inline-block;background:${branding.primaryColor};color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;">
          Download Invoice PDF
        </a>
      </div>` : ""}
      <p style="color:#9ca3af;font-size:12px;line-height:1.5;">
        This invoice was sent by ${branding.businessName}. If you have questions, please contact ${branding.contactEmail}.
      </p>
    </div>
    <div style="background:${branding.accentColor};padding:20px 40px;text-align:center;">
      <p style="color:${branding.primaryColor};font-size:12px;margin:0;">
        Sent securely by <strong>${branding.businessName}</strong>
      </p>
    </div>
  </div>
</body>
</html>`;

  await sendMail(to, subject, html);
}

export async function sendOverdueReminder({
  to,
  clientName,
  invoiceNumber,
  balanceDue,
  currency,
  daysOverdue,
  pdfUrl,
  businessName,
  businessEmail,
  logoUrl,
  brandPrimaryColor,
  brandAccentColor,
}: {
  to: string;
  clientName: string;
  invoiceNumber: string;
  balanceDue: number;
  currency: string;
  daysOverdue: number;
  pdfUrl?: string | null;
  businessName?: string | null;
  businessEmail?: string | null;
  logoUrl?: string | null;
  brandPrimaryColor?: string | null;
  brandAccentColor?: string | null;
}) {
  ensureMailtrapConfig();

  const branding = getBranding({
    businessName,
    businessEmail,
    logoUrl,
    brandPrimaryColor,
    brandAccentColor,
  });
  const subject = `[OVERDUE] Invoice ${invoiceNumber} from ${branding.businessName}`;
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:${branding.accentColor};font-family:Inter,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border-top:4px solid #ef4444;">
    <div style="background:${branding.primaryColor};padding:24px 40px;">
      <div style="display:flex;align-items:center;gap:14px;">
        ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.businessName} logo" style="height:40px;width:40px;border-radius:10px;object-fit:contain;background:rgba(255,255,255,0.14);padding:6px;" />` : ""}
        <div>
          <h2 style="color:#fff;margin:0;font-size:18px;">${branding.businessName}</h2>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">Payment reminder for invoice ${invoiceNumber}</p>
        </div>
      </div>
    </div>
    <div style="padding:40px;">
      <p style="color:#374151;">Dear ${clientName},</p>
      <p style="color:#6b7280;line-height:1.6;">
        Invoice <strong>${invoiceNumber}</strong> from ${branding.businessName} is
        <strong style="color:#dc2626;"> ${daysOverdue} days overdue</strong>.
        Amount outstanding:
        <strong>${new Intl.NumberFormat("en-LK", { style: "currency", currency }).format(balanceDue)}</strong>.
      </p>
      ${pdfUrl ? `<a href="${pdfUrl}" style="display:inline-block;background:${branding.primaryColor};color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Invoice</a>` : ""}
      <p style="margin-top:24px;color:#9ca3af;font-size:12px;">For assistance, contact ${branding.contactEmail}.</p>
    </div>
  </div>
</body>
</html>`;

  await sendMail(to, subject, html);
}
