import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "InvoiceMarshal — Smart Invoicing for South Asia",
  description:
    "Professional invoice management for Sri Lankan businesses. Create, send, and track invoices with ease.",
  keywords: ["invoice", "Sri Lanka", "LKR", "billing", "SaaS", "small business"],
  openGraph: {
    title: "InvoiceMarshal",
    description: "Smart Invoicing for South Asia",
    type: "website",
    locale: "en_LK",
  },
};

const hasClerkPublishableKey =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en-LK">
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );

  if (!hasClerkPublishableKey) {
    return content;
  }

  return (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  );
}
