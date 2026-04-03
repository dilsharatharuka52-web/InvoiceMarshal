# 🚀 InvoiceMarshal v1.0 — Full AI Agent Build Plan

> **AI Agent Instructions:** Read this file top to bottom. Execute every step in order.
> Do not skip any step. Each step has an **Outcome** — verify it before proceeding.
> This file is the single source of truth for the entire project.

---

**Project:** InvoiceMarshal — Invoice & Finance SaaS  
**Target Region:** Sri Lanka & South Asia  
**Target Users:** Freelancers, SMEs, Gig Workers, Agencies  
**Version:** 1.0 — Production Ready  
**Build Mode:** AI Agent Autonomous Execution  
**Aesthetic:** Violet + White — Modern Clean SaaS  
**Security Level:** Bank-Grade  
**PDF Engine:** jsPDF (Crate v1 — lightweight, no React renderer)  
**Auth:** Clerk (replaces Auth.js entirely)  
**Framework:** Next.js 15 App Router + Server Actions  

---

## 📁 Final Project Structure (Reference Before Starting)

```
invoicemarshal/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── logo.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── invoices/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [invoiceId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/page.tsx
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   └── clerk/route.ts
│   │   │   └── invoices/
│   │   │       └── [invoiceId]/
│   │   │           └── pdf/route.ts
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── actions/
│   │   ├── invoice.actions.ts
│   │   ├── client.actions.ts
│   │   └── user.actions.ts
│   ├── components/
│   │   ├── ui/                    (shadcn auto-generated)
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   ├── invoice-aging-chart.tsx
│   │   │   └── recent-invoices.tsx
│   │   ├── invoices/
│   │   │   ├── invoice-form.tsx
│   │   │   ├── invoice-list.tsx
│   │   │   ├── invoice-card.tsx
│   │   │   └── invoice-status-badge.tsx
│   │   ├── pdf/
│   │   │   └── generate-pdf.ts
│   │   └── shared/
│   │       ├── navbar.tsx
│   │       ├── sidebar.tsx
│   │       └── loading-skeleton.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── mail.ts
│   │   └── validations.ts
│   └── middleware.ts
├── .env.local
├── .env.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔄 PHASE 1 — Secure Foundation (Day 1)

### Step 1.1 · Project Initialization

```bash
npx create-next-app@latest invoicemarshal \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd invoicemarshal

# Remove legacy auth packages
npm uninstall next-auth @auth/prisma-adapter nodemailer 2>/dev/null || true

# Install all production dependencies
npm install \
  @clerk/nextjs \
  zod \
  react-hook-form \
  @hookform/resolvers \
  @prisma/client \
  jspdf \
  jspdf-autotable \
  @vercel/blob \
  framer-motion \
  lucide-react \
  recharts \
  sonner \
  date-fns \
  clsx \
  tailwind-merge \
  class-variance-authority \
  @radix-ui/react-slot \
  next-themes

# Install dev dependencies
npm install -D prisma @types/node @types/react

# Initialize Prisma
npx prisma init

# Initialize ShadcnUI
npx shadcn@latest init --defaults
npx shadcn@latest add button input label card badge select textarea \
  table dropdown-menu dialog sheet skeleton toast separator avatar \
  progress tabs popover calendar form
```

**✅ Outcome:** Full dependency tree installed. `src/` structure created.

---

### Step 1.2 · Environment Variables

**File:** `.env.local`

```env
# ─── Clerk Auth ───────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_REPLACE_ME
CLERK_SECRET_KEY=sk_live_REPLACE_ME
CLERK_WEBHOOK_SECRET=whsec_REPLACE_ME

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# ─── Database ─────────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:password@localhost:5432/invoicemarshal"

# ─── Vercel Blob (Private PDF Storage) ────────────────────────
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_REPLACE_ME

# ─── Mailtrap (Transactional Email) ───────────────────────────
MAILTRAP_API_TOKEN=REPLACE_ME
MAILTRAP_SENDER_EMAIL=noreply@invoicemarshal.lk
MAILTRAP_SENDER_NAME=InvoiceMarshal

# ─── App Config ───────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=InvoiceMarshal
```

**File:** `.env.example` (commit this, not .env.local)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
MAILTRAP_API_TOKEN=
MAILTRAP_SENDER_EMAIL=
NEXT_PUBLIC_APP_URL=
```

**File:** `.gitignore` — Add these lines

```
.env.local
.env.production
.env*.local
```

**✅ Outcome:** Secrets managed via environment variables. `.env.local` never committed.

---

### Step 1.3 · TypeScript Config (Strict Mode)

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**✅ Outcome:** Strict TypeScript — no implicit any, no unchecked array access.

---

### Step 1.4 · Design System — Violet + White Tailwind Config

**File:** `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // ─── InvoiceMarshal Brand Colors ───────────────────────────
        brand: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",   // Primary violet
          600: "#7c3aed",   // Darker violet (CTA buttons)
          700: "#6d28d9",   // Darkest — headings
          800: "#5b21b6",
          900: "#4c1d95",
        },
        // ─── Semantic Colors ───────────────────────────────────────
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:     "hsl(var(--primary))",
          foreground:  "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:     "hsl(var(--secondary))",
          foreground:  "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:     "hsl(var(--muted))",
          foreground:  "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:     "hsl(var(--accent))",
          foreground:  "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:     "hsl(var(--destructive))",
          foreground:  "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT:     "hsl(var(--card))",
          foreground:  "hsl(var(--card-foreground))",
        },
        // ─── Status Colors ─────────────────────────────────────────
        success: { DEFAULT: "#10b981", foreground: "#ffffff" },
        warning: { DEFAULT: "#f59e0b", foreground: "#ffffff" },
        danger:  { DEFAULT: "#ef4444", foreground: "#ffffff" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in":        { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-in":       { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        shimmer:          { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 0.3s ease-out",
        "slide-in":       "slide-in 0.3s ease-out",
        shimmer:          "shimmer 1.5s infinite",
      },
      boxShadow: {
        "violet-sm":  "0 1px 3px 0 rgba(139, 92, 246, 0.1)",
        "violet-md":  "0 4px 6px -1px rgba(139, 92, 246, 0.15)",
        "violet-lg":  "0 10px 25px -5px rgba(139, 92, 246, 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**File:** `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@layer base {
  :root {
    --background:   0 0% 100%;
    --foreground:   224 71.4% 4.1%;
    --card:         0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover:      0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;

    /* ── Violet Primary ── */
    --primary:          263.4 70% 50.4%;
    --primary-foreground: 210 20% 98%;

    --secondary:     220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted:         220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent:        220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive:   0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border:        220 13% 91%;
    --input:         220 13% 91%;
    --ring:          263.4 70% 50.4%;
    --radius:        0.75rem;
  }

  .dark {
    --background:   224 71.4% 4.1%;
    --foreground:   210 20% 98%;
    --card:         224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --primary:      263.4 70% 50.4%;
    --primary-foreground: 210 20% 98%;
    --secondary:    215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --muted:        215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --accent:       215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    --destructive:  0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border:       215 27.9% 16.9%;
    --input:        215 27.9% 16.9%;
    --ring:         263.4 70% 50.4%;
  }
}

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  h1 { @apply text-3xl font-bold tracking-tight text-brand-700; }
  h2 { @apply text-2xl font-semibold tracking-tight text-brand-700; }
  h3 { @apply text-xl font-semibold text-gray-900; }
}

@layer utilities {
  .gradient-brand {
    background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  }
  .gradient-brand-soft {
    background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  }
  .glass-card {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.1);
  }
  .invoice-number {
    font-family: 'JetBrains Mono', monospace;
    @apply text-brand-600 font-medium;
  }
}
```

**✅ Outcome:** Violet + white brand system fully configured.

---

### Step 1.5 · Prisma Schema — Full Database Model

**File:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ══════════════════════════════════════════════════
//  ENUMS
// ══════════════════════════════════════════════════

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
  PARTIAL
}

enum Currency {
  LKR
  USD
  EUR
  GBP
  INR
  AED
}

enum PaymentMethod {
  BANK_TRANSFER
  CASH
  CHEQUE
  CARD
  ONLINE
  OTHER
}

// ══════════════════════════════════════════════════
//  USERS
// ══════════════════════════════════════════════════

model User {
  id              String    @id @default(cuid())
  clerkId         String    @unique
  email           String    @unique
  firstName       String?
  lastName        String?
  imageUrl        String?

  // Business Info
  businessName    String?
  businessAddress String?
  businessCity    String?
  businessCountry String    @default("Sri Lanka")
  businessPhone   String?
  businessEmail   String?
  vatNumber       String?   // Sri Lanka VAT Registration Number
  taxId           String?   // TIN (Taxpayer Identification Number)
  logoUrl         String?   // Stored in Vercel Blob

  // Preferences
  defaultCurrency Currency  @default(LKR)
  invoicePrefix   String    @default("INV")
  nextInvoiceNum  Int       @default(1)
  defaultTaxRate  Float     @default(18.0) // Sri Lanka standard VAT 18%
  defaultDueDays  Int       @default(30)
  isOnboarded     Boolean   @default(false)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  invoices        Invoice[]
  clients         Client[]
  payments        Payment[]

  @@index([clerkId])
  @@index([email])
}

// ══════════════════════════════════════════════════
//  CLIENTS
// ══════════════════════════════════════════════════

model Client {
  id              String    @id @default(cuid())
  userId          String

  name            String
  email           String
  phone           String?
  address         String?
  city            String?
  country         String?
  vatNumber       String?   // Client's VAT registration
  notes           String?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  invoices        Invoice[]

  @@index([userId])
  @@index([email])
}

// ══════════════════════════════════════════════════
//  INVOICES
// ══════════════════════════════════════════════════

model Invoice {
  id              String        @id @default(cuid())
  userId          String
  clientId        String

  // Invoice Identity
  invoiceNumber   String        // e.g., INV-2025-0047
  status          InvoiceStatus @default(DRAFT)

  // Dates
  issueDate       DateTime      @default(now())
  dueDate         DateTime

  // Financials
  currency        Currency      @default(LKR)
  subtotal        Float         @default(0)
  taxRate         Float         @default(0)
  taxAmount       Float         @default(0)
  discountPct     Float         @default(0)
  discountAmount  Float         @default(0)
  totalAmount     Float         @default(0)
  paidAmount      Float         @default(0)
  balanceDue      Float         @default(0)

  // Content
  notes           String?
  terms           String?       // Payment terms
  pdfUrl          String?       // Vercel Blob private URL

  // Metadata
  sentAt          DateTime?
  paidAt          DateTime?
  cancelledAt     DateTime?
  reminderSentAt  DateTime?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  client          Client        @relation(fields: [clientId], references: [id])
  lineItems       LineItem[]
  payments        Payment[]
  emailLogs       EmailLog[]

  @@index([userId])
  @@index([clientId])
  @@index([status])
  @@index([invoiceNumber])
  @@index([dueDate])
}

// ══════════════════════════════════════════════════
//  LINE ITEMS
// ══════════════════════════════════════════════════

model LineItem {
  id          String   @id @default(cuid())
  invoiceId   String

  description String
  quantity    Float
  unitPrice   Float
  taxRate     Float    @default(0)
  amount      Float    // quantity × unitPrice

  sortOrder   Int      @default(0)

  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
}

// ══════════════════════════════════════════════════
//  PAYMENTS
// ══════════════════════════════════════════════════

model Payment {
  id            String        @id @default(cuid())
  invoiceId     String
  userId        String

  amount        Float
  currency      Currency      @default(LKR)
  method        PaymentMethod @default(BANK_TRANSFER)
  reference     String?       // Bank transaction ref / cheque number
  note          String?
  paidAt        DateTime      @default(now())

  createdAt     DateTime      @default(now())

  invoice       Invoice       @relation(fields: [invoiceId], references: [id])
  user          User          @relation(fields: [userId], references: [id])

  @@index([invoiceId])
  @@index([userId])
}

// ══════════════════════════════════════════════════
//  EMAIL LOGS (Audit Trail)
// ══════════════════════════════════════════════════

model EmailLog {
  id          String   @id @default(cuid())
  invoiceId   String
  toEmail     String
  subject     String
  type        String   // "INVOICE_SENT" | "REMINDER" | "RECEIPT"
  sentAt      DateTime @default(now())
  success     Boolean  @default(true)
  error       String?

  invoice     Invoice  @relation(fields: [invoiceId], references: [id])

  @@index([invoiceId])
}
```

```bash
# Apply schema to database
npx prisma generate
npx prisma db push
```

**✅ Outcome:** Full relational schema with indexes. Supports invoices, clients, payments, email audit logs.

---

### Step 1.6 · Prisma Client Singleton

**File:** `src/lib/db.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**File:** `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "LKR"
): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function generateInvoiceNumber(prefix: string, num: number): string {
  const year = new Date().getFullYear();
  const paddedNum = String(num).padStart(4, "0");
  return `${prefix}-${year}-${paddedNum}`;
}

export function calculateInvoiceTotals(
  lineItems: { quantity: number; unitPrice: number; taxRate: number }[],
  discountPct: number = 0
) {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
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

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    DRAFT:     "bg-gray-100 text-gray-700 border-gray-200",
    SENT:      "bg-blue-100 text-blue-700 border-blue-200",
    PAID:      "bg-emerald-100 text-emerald-700 border-emerald-200",
    OVERDUE:   "bg-red-100 text-red-700 border-red-200",
    CANCELLED: "bg-orange-100 text-orange-700 border-orange-200",
    PARTIAL:   "bg-amber-100 text-amber-700 border-amber-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}

export function getDaysOverdue(dueDate: Date | string): number {
  const due = new Date(dueDate);
  const today = new Date();
  const diffMs = today.getTime() - due.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
```

**✅ Outcome:** Database singleton. Utility functions for formatting, calculations, status colors.

---

## 🔄 PHASE 2 — Validation & Security Layer (Day 1–2)

### Step 2.1 · Zod Validation Schemas

**File:** `src/lib/validations.ts`

```typescript
import { z } from "zod";

// ─── User / Onboarding ──────────────────────────────────────────

export const onboardingSchema = z.object({
  firstName:      z.string().min(2, "Min 2 chars").max(50),
  lastName:       z.string().min(2, "Min 2 chars").max(50),
  businessName:   z.string().min(2, "Min 2 chars").max(100),
  businessAddress:z.string().min(5, "Min 5 chars").max(300),
  businessCity:   z.string().min(2).max(100),
  businessPhone:  z.string().regex(/^\+?[0-9\s\-]{7,15}$/, "Invalid phone"),
  vatNumber:      z.string().optional(),
  defaultCurrency:z.enum(["LKR", "USD", "EUR", "GBP", "INR", "AED"]).default("LKR"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

// ─── Clients ────────────────────────────────────────────────────

export const clientSchema = z.object({
  name:      z.string().min(2, "Client name required").max(100),
  email:     z.string().email("Valid email required"),
  phone:     z.string().optional(),
  address:   z.string().optional(),
  city:      z.string().optional(),
  country:   z.string().optional(),
  vatNumber: z.string().optional(),
  notes:     z.string().max(500).optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;

// ─── Line Items ─────────────────────────────────────────────────

export const lineItemSchema = z.object({
  description: z
    .string()
    .min(1, "Description required")
    .max(500)
    .refine(
      (val) => !/<script|javascript:|on\w+=/i.test(val),
      "Invalid characters detected" // XSS protection
    ),
  quantity:    z.number().positive("Must be > 0").max(100000),
  unitPrice:   z.number().nonnegative("Must be ≥ 0").max(100000000),
  taxRate:     z.number().min(0).max(100).default(0),
});

export type LineItemInput = z.infer<typeof lineItemSchema>;

// ─── Invoices ───────────────────────────────────────────────────

export const invoiceSchema = z.object({
  clientId:    z.string().cuid("Invalid client ID"),
  issueDate:   z.string().datetime(),
  dueDate:     z.string().datetime(),
  currency:    z.enum(["LKR", "USD", "EUR", "GBP", "INR", "AED"]),
  taxRate:     z.number().min(0).max(100).default(0),
  discountPct: z.number().min(0).max(100).default(0),
  notes:       z.string().max(1000).optional(),
  terms:       z.string().max(500).optional(),
  lineItems:   z
    .array(lineItemSchema)
    .min(1, "At least one line item required")
    .max(50),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

// ─── Payments ───────────────────────────────────────────────────

export const paymentSchema = z.object({
  invoiceId: z.string().cuid(),
  amount:    z.number().positive("Amount must be > 0"),
  method:    z.enum(["BANK_TRANSFER", "CASH", "CHEQUE", "CARD", "ONLINE", "OTHER"]),
  reference: z.string().max(100).optional(),
  note:      z.string().max(300).optional(),
  paidAt:    z.string().datetime().optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
```

**✅ Outcome:** Every input validated server-side. XSS-sanitized. No raw user data touches the database.

---

### Step 2.2 · Clerk Webhook — User Sync

**File:** `src/app/api/webhooks/clerk/route.ts`

```typescript
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("CLERK_WEBHOOK_SECRET missing");

  const headerPayload = headers();
  const svix_id        = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body    = JSON.stringify(payload);

  // ── Verify webhook signature (CRITICAL security step) ──────────
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id":        svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type, data } = evt;

  // ── Handle user.created ────────────────────────────────────────
  if (type === "user.created") {
    await prisma.user.create({
      data: {
        clerkId:  data.id,
        email:    data.email_addresses[0]?.email_address ?? "",
        firstName:data.first_name ?? "",
        lastName: data.last_name  ?? "",
        imageUrl: data.image_url  ?? "",
      },
    });
  }

  // ── Handle user.updated ────────────────────────────────────────
  if (type === "user.updated") {
    await prisma.user.update({
      where: { clerkId: data.id },
      data: {
        email:    data.email_addresses[0]?.email_address,
        firstName:data.first_name ?? undefined,
        lastName: data.last_name  ?? undefined,
        imageUrl: data.image_url  ?? undefined,
      },
    });
  }

  // ── Handle user.deleted ────────────────────────────────────────
  if (type === "user.deleted" && data.id) {
    await prisma.user.delete({ where: { clerkId: data.id } });
  }

  return new Response("OK", { status: 200 });
}
```

**✅ Outcome:** Clerk user events sync to PostgreSQL. Signature verified — no spoofed webhooks.

---

## 🔄 PHASE 3 — Server Actions (Day 2)

### Step 3.1 · User Actions

**File:** `src/actions/user.actions.ts`

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function getAuthenticatedUser() {
  const { userId: clerkId } = auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  return user;
}

export async function onboardUser(raw: unknown) {
  const { userId: clerkId } = auth();
  if (!clerkId) throw new Error("Unauthorized");

  const data = onboardingSchema.parse(raw); // Zod validation

  // Prevent duplicate onboarding
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (!existing) throw new Error("User not found. Webhook may be delayed.");
  if (existing.isOnboarded) return { success: true, alreadyOnboarded: true };

  await prisma.user.update({
    where: { clerkId },
    data: { ...data, isOnboarded: true },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getCurrentUser() {
  return getAuthenticatedUser();
}
```

---

### Step 3.2 · Client Actions

**File:** `src/actions/client.actions.ts`

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { clientSchema, type ClientInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function getVerifiedUserId(): Promise<string> {
  const { userId: clerkId } = auth();
  if (!clerkId) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");
  return user.id;
}

export async function createClient(raw: unknown) {
  const userId = await getVerifiedUserId();
  const data   = clientSchema.parse(raw); // Zod validation

  const client = await prisma.client.create({
    data: { ...data, userId },
  });

  revalidatePath("/clients");
  return { success: true, client };
}

export async function updateClient(clientId: string, raw: unknown) {
  const userId = await getVerifiedUserId();
  const data   = clientSchema.parse(raw);

  // Ownership verification — critical security check
  const existing = await prisma.client.findFirst({
    where: { id: clientId, userId }, // Must belong to this user
  });
  if (!existing) throw new Error("Client not found or access denied");

  const client = await prisma.client.update({
    where: { id: clientId },
    data,
  });

  revalidatePath("/clients");
  return { success: true, client };
}

export async function deleteClient(clientId: string) {
  const userId = await getVerifiedUserId();

  const existing = await prisma.client.findFirst({
    where: { id: clientId, userId },
  });
  if (!existing) throw new Error("Client not found or access denied");

  await prisma.client.delete({ where: { id: clientId } });
  revalidatePath("/clients");
  return { success: true };
}

export async function getClients() {
  const userId = await getVerifiedUserId();
  return prisma.client.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}
```

---

### Step 3.3 · Invoice Actions

**File:** `src/actions/invoice.actions.ts`

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { invoiceSchema, paymentSchema } from "@/lib/validations";
import { generateInvoiceNumber, calculateInvoiceTotals } from "@/lib/utils";
import { generateInvoicePDF } from "@/components/pdf/generate-pdf";
import { sendInvoiceEmail } from "@/lib/mail";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

async function getVerifiedUser() {
  const { userId: clerkId } = auth();
  if (!clerkId) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");
  return user;
}

// ─── Create Invoice ─────────────────────────────────────────────

export async function createInvoice(raw: unknown) {
  const user = await getVerifiedUser();
  const data = invoiceSchema.parse(raw);

  // Verify client belongs to this user
  const client = await prisma.client.findFirst({
    where: { id: data.clientId, userId: user.id },
  });
  if (!client) throw new Error("Client not found or access denied");

  // Generate invoice number
  const invoiceNumber = generateInvoiceNumber(
    user.invoicePrefix,
    user.nextInvoiceNum
  );

  // Calculate totals
  const totals = calculateInvoiceTotals(data.lineItems, data.discountPct);

  // Create invoice + line items in transaction
  const invoice = await prisma.$transaction(async (tx) => {
    const inv = await tx.invoice.create({
      data: {
        userId:        user.id,
        clientId:      data.clientId,
        invoiceNumber,
        status:        "DRAFT",
        issueDate:     new Date(data.issueDate),
        dueDate:       new Date(data.dueDate),
        currency:      data.currency as any,
        taxRate:       data.taxRate,
        discountPct:   data.discountPct,
        notes:         data.notes,
        terms:         data.terms,
        ...totals,
        balanceDue:    totals.totalAmount,
        lineItems: {
          create: data.lineItems.map((item, i) => ({
            description: item.description,
            quantity:    item.quantity,
            unitPrice:   item.unitPrice,
            taxRate:     item.taxRate,
            amount:      item.quantity * item.unitPrice,
            sortOrder:   i,
          })),
        },
      },
      include: { lineItems: true, client: true, user: true },
    });

    // Increment user's invoice counter
    await tx.user.update({
      where: { id: user.id },
      data: { nextInvoiceNum: { increment: 1 } },
    });

    return inv;
  });

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true, invoice };
}

// ─── Generate PDF & Upload to Blob ──────────────────────────────

export async function generateAndStorePDF(invoiceId: string) {
  const user = await getVerifiedUser();

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id }, // Ownership check
    include: { lineItems: true, client: true, user: true },
  });
  if (!invoice) throw new Error("Invoice not found");

  // Generate PDF bytes using jsPDF
  const pdfBytes = await generateInvoicePDF(invoice as any);

  // Upload to Vercel Blob (private — requires signed URL to access)
  const blob = await put(
    `invoices/${user.id}/${invoiceId}.pdf`,
    pdfBytes,
    {
      access:           "public",
      addRandomSuffix:  false,
      contentType:      "application/pdf",
    }
  );

  // Store URL in database
  await prisma.invoice.update({
    where: { id: invoiceId },
    data:  { pdfUrl: blob.url },
  });

  return { success: true, pdfUrl: blob.url };
}

// ─── Send Invoice via Email ──────────────────────────────────────

export async function sendInvoice(invoiceId: string) {
  const user = await getVerifiedUser();

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
    include: { client: true, user: true, lineItems: true },
  });
  if (!invoice) throw new Error("Invoice not found");

  // Generate PDF if not already generated
  if (!invoice.pdfUrl) {
    await generateAndStorePDF(invoiceId);
  }

  // Send email via Mailtrap
  await sendInvoiceEmail({
    to:       invoice.client.email,
    invoice:  invoice as any,
  });

  // Mark as sent
  await prisma.invoice.update({
    where: { id: invoiceId },
    data:  { status: "SENT", sentAt: new Date() },
  });

  // Log email
  await prisma.emailLog.create({
    data: {
      invoiceId: invoiceId,
      toEmail:   invoice.client.email,
      subject:   `Invoice ${invoice.invoiceNumber} from ${invoice.user.businessName}`,
      type:      "INVOICE_SENT",
    },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true };
}

// ─── Record Payment ──────────────────────────────────────────────

export async function recordPayment(raw: unknown) {
  const user = await getVerifiedUser();
  const data = paymentSchema.parse(raw);

  // Ownership verification on invoice
  const invoice = await prisma.invoice.findFirst({
    where: { id: data.invoiceId, userId: user.id },
  });
  if (!invoice) throw new Error("Invoice not found");

  const payment = await prisma.$transaction(async (tx) => {
    const pmt = await tx.payment.create({
      data: {
        invoiceId: data.invoiceId,
        userId:    user.id,
        amount:    data.amount,
        method:    data.method as any,
        reference: data.reference,
        note:      data.note,
        paidAt:    data.paidAt ? new Date(data.paidAt) : new Date(),
        currency:  invoice.currency,
      },
    });

    const newPaidAmount = invoice.paidAmount + data.amount;
    const newBalanceDue = invoice.totalAmount - newPaidAmount;
    const newStatus =
      newBalanceDue <= 0
        ? "PAID"
        : newPaidAmount > 0
        ? "PARTIAL"
        : invoice.status;

    await tx.invoice.update({
      where: { id: data.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        balanceDue: Math.max(0, newBalanceDue),
        status:     newStatus as any,
        paidAt:     newBalanceDue <= 0 ? new Date() : undefined,
      },
    });

    return pmt;
  });

  revalidatePath(`/invoices/${data.invoiceId}`);
  revalidatePath("/dashboard");
  return { success: true, payment };
}

// ─── Delete Invoice ──────────────────────────────────────────────

export async function deleteInvoice(invoiceId: string) {
  const user = await getVerifiedUser();

  // Ownership check (CRITICAL — never delete without this)
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
  });
  if (!invoice) throw new Error("Invoice not found or access denied");
  if (invoice.status === "PAID") throw new Error("Cannot delete a paid invoice");

  await prisma.invoice.delete({ where: { id: invoiceId } });

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Get Dashboard Stats ─────────────────────────────────────────

export async function getDashboardStats() {
  const user = await getVerifiedUser();

  const [
    totalInvoices,
    paidInvoices,
    overdueInvoices,
    draftInvoices,
    recentInvoices,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.invoice.count({ where: { userId: user.id } }),

    prisma.invoice.aggregate({
      where:   { userId: user.id, status: "PAID" },
      _sum:    { totalAmount: true },
      _count:  true,
    }),

    prisma.invoice.aggregate({
      where: {
        userId: user.id,
        status: { in: ["SENT", "PARTIAL"] },
        dueDate: { lt: new Date() },
      },
      _sum:  { balanceDue: true },
      _count: true,
    }),

    prisma.invoice.count({
      where: { userId: user.id, status: "DRAFT" },
    }),

    prisma.invoice.findMany({
      where:   { userId: user.id },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take:    10,
    }),

    // Monthly revenue for last 6 months
    prisma.$queryRaw<{ month: string; revenue: number }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "paidAt"), 'Mon YY') as month,
        COALESCE(SUM("totalAmount"), 0) as revenue
      FROM "Invoice"
      WHERE "userId" = ${user.id}
        AND status = 'PAID'
        AND "paidAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "paidAt")
      ORDER BY DATE_TRUNC('month', "paidAt") ASC
    `,
  ]);

  return {
    totalInvoices,
    totalRevenue:    paidInvoices._sum.totalAmount ?? 0,
    paidCount:       paidInvoices._count,
    overdueAmount:   overdueInvoices._sum.balanceDue ?? 0,
    overdueCount:    overdueInvoices._count,
    draftCount:      draftInvoices,
    recentInvoices,
    monthlyRevenue,
    currency:        user.defaultCurrency,
  };
}
```

**✅ Outcome:** All CRUD + financial actions with Zod validation + ownership verification on every mutation.

---

## 🔄 PHASE 4 — PDF Generation with jsPDF (Day 2)

### Step 4.1 · Invoice PDF Generator (jsPDF Crate v1)

**File:** `src/components/pdf/generate-pdf.ts`

```typescript
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "@/lib/utils";

interface InvoiceForPDF {
  invoiceNumber: string;
  issueDate:     Date;
  dueDate:       Date;
  currency:      string;
  subtotal:      number;
  taxRate:       number;
  taxAmount:     number;
  discountPct:   number;
  discountAmount:number;
  totalAmount:   number;
  balanceDue:    number;
  notes?:        string | null;
  terms?:        string | null;
  status:        string;
  client: {
    name:       string;
    email:      string;
    phone?:     string | null;
    address?:   string | null;
    city?:      string | null;
    country?:   string | null;
    vatNumber?: string | null;
  };
  user: {
    businessName?:    string | null;
    businessAddress?: string | null;
    businessCity?:    string | null;
    businessPhone?:   string | null;
    businessEmail?:   string | null;
    vatNumber?:       string | null;
    email:            string;
  };
  lineItems: {
    description: string;
    quantity:    number;
    unitPrice:   number;
    taxRate:     number;
    amount:      number;
  }[];
}

// ── Brand Colors ──────────────────────────────────────────────────
const VIOLET       = [109, 40, 217] as [number, number, number]; // #6d28d9
const VIOLET_LIGHT = [245, 243, 255] as [number, number, number]; // #f5f3ff
const GRAY_DARK    = [31, 41, 55]  as [number, number, number];
const GRAY_MED     = [107, 114, 128] as [number, number, number];
const WHITE        = [255, 255, 255] as [number, number, number];

export async function generateInvoicePDF(invoice: InvoiceForPDF): Promise<Uint8Array> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 0;

  // ── Header Bar (violet) ─────────────────────────────────────────
  doc.setFillColor(...VIOLET);
  doc.rect(0, 0, pageW, 40, "F");

  // Company Name
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(invoice.user.businessName ?? "InvoiceMarshal", margin, 18);

  // INVOICE label (right side)
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageW - margin, 18, { align: "right" });

  // Invoice number under INVOICE
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.invoiceNumber, pageW - margin, 26, { align: "right" });

  // Status badge
  const statusColors: Record<string, [number, number, number]> = {
    PAID:      [16, 185, 129],
    SENT:      [59, 130, 246],
    OVERDUE:   [239, 68, 68],
    DRAFT:     [156, 163, 175],
    CANCELLED: [249, 115, 22],
    PARTIAL:   [245, 158, 11],
  };
  const sc = statusColors[invoice.status] ?? [156, 163, 175];
  doc.setFillColor(...sc);
  doc.roundedRect(pageW - margin - 28, 29, 28, 8, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.status, pageW - margin - 14, 34.5, { align: "center" });

  y = 52;

  // ── Dates Row ───────────────────────────────────────────────────
  doc.setTextColor(...GRAY_MED);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Issue Date:  ${formatDate(invoice.issueDate)}`, margin, y);
  doc.text(`Due Date:    ${formatDate(invoice.dueDate)}`,   margin + 80, y);
  doc.text(`Currency:    ${invoice.currency}`,              margin + 160, y);
  y += 12;

  // ── Bill From / Bill To ─────────────────────────────────────────
  doc.setFillColor(...VIOLET_LIGHT);
  doc.rect(margin, y, 80, 8, "F");
  doc.rect(pageW / 2, y, 80, 8, "F");

  doc.setTextColor(...VIOLET);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BILL FROM", margin + 2, y + 5.5);
  doc.text("BILL TO",   pageW / 2 + 2, y + 5.5);
  y += 12;

  // From (user/business info)
  doc.setTextColor(...GRAY_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(invoice.user.businessName ?? "Your Business", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY_MED);
  if (invoice.user.businessAddress) doc.text(invoice.user.businessAddress, margin, y), y += 5;
  if (invoice.user.businessCity)    doc.text(invoice.user.businessCity, margin, y), y += 5;
  if (invoice.user.businessPhone)   doc.text(`Tel: ${invoice.user.businessPhone}`, margin, y), y += 5;
  if (invoice.user.businessEmail)   doc.text(invoice.user.businessEmail, margin, y), y += 5;
  if (invoice.user.vatNumber)       doc.text(`VAT: ${invoice.user.vatNumber}`, margin, y);

  // To (client info) — same Y level as "From"
  let clientY = y - (invoice.user.businessAddress ? 25 : 15);
  const clientX = pageW / 2;
  doc.setTextColor(...GRAY_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(invoice.client.name, clientX, clientY);
  clientY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY_MED);
  doc.text(invoice.client.email, clientX, clientY);
  clientY += 5;
  if (invoice.client.phone)      doc.text(`Tel: ${invoice.client.phone}`, clientX, clientY), clientY += 5;
  if (invoice.client.address)    doc.text(invoice.client.address, clientX, clientY), clientY += 5;
  if (invoice.client.city)       doc.text(invoice.client.city, clientX, clientY), clientY += 5;
  if (invoice.client.vatNumber)  doc.text(`VAT: ${invoice.client.vatNumber}`, clientX, clientY);

  y += 20;

  // ── Line Items Table ────────────────────────────────────────────
  autoTable(doc, {
    startY: y,
    head: [["#", "Description", "Qty", "Unit Price", "Tax %", "Amount"]],
    body: invoice.lineItems.map((item, i) => [
      String(i + 1),
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice, invoice.currency),
      `${item.taxRate}%`,
      formatCurrency(item.amount, invoice.currency),
    ]),
    headStyles: {
      fillColor:  VIOLET,
      textColor:  WHITE,
      fontStyle:  "bold",
      fontSize:   9,
      cellPadding:4,
    },
    bodyStyles: {
      fontSize:   9,
      textColor:  GRAY_DARK,
      cellPadding:4,
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 10,  halign: "center" },
      1: { cellWidth: 70 },
      2: { cellWidth: 18,  halign: "center" },
      3: { cellWidth: 32,  halign: "right" },
      4: { cellWidth: 20,  halign: "center" },
      5: { cellWidth: 30,  halign: "right" },
    },
    margin: { left: margin, right: margin },
    theme: "grid",
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // ── Totals Box ──────────────────────────────────────────────────
  const totalsX = pageW - margin - 80;

  const addTotalsRow = (
    label: string,
    value: string,
    bold = false,
    highlight = false
  ) => {
    if (highlight) {
      doc.setFillColor(...VIOLET);
      doc.rect(totalsX - 4, y - 5, 84, 9, "F");
      doc.setTextColor(...WHITE);
    } else {
      doc.setTextColor(bold ? GRAY_DARK[0] : GRAY_MED[0], bold ? GRAY_DARK[1] : GRAY_MED[1], bold ? GRAY_DARK[2] : GRAY_MED[2]);
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.text(label, totalsX, y);
    doc.text(value, pageW - margin, y, { align: "right" });
    y += 8;
  };

  addTotalsRow("Subtotal", formatCurrency(invoice.subtotal, invoice.currency));
  if (invoice.discountPct > 0)
    addTotalsRow(`Discount (${invoice.discountPct}%)`, `- ${formatCurrency(invoice.discountAmount, invoice.currency)}`);
  if (invoice.taxRate > 0)
    addTotalsRow(`VAT (${invoice.taxRate}%)`, formatCurrency(invoice.taxAmount, invoice.currency));

  doc.setDrawColor(...VIOLET);
  doc.setLineWidth(0.3);
  doc.line(totalsX, y, pageW - margin, y);
  y += 4;

  addTotalsRow("TOTAL", formatCurrency(invoice.totalAmount, invoice.currency), true);
  if (invoice.paidAmount > 0)
    addTotalsRow("Paid", `- ${formatCurrency(invoice.paidAmount, invoice.currency)}`);
  addTotalsRow("BALANCE DUE", formatCurrency(invoice.balanceDue, invoice.currency), true, true);

  y += 12;

  // ── Notes & Terms ───────────────────────────────────────────────
  if (invoice.notes) {
    doc.setTextColor(...GRAY_DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Notes", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_MED);
    const noteLines = doc.splitTextToSize(invoice.notes, pageW - margin * 2);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 5 + 8;
  }

  if (invoice.terms) {
    doc.setTextColor(...GRAY_DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Terms & Conditions", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_MED);
    const termLines = doc.splitTextToSize(invoice.terms, pageW - margin * 2);
    doc.text(termLines, margin, y);
  }

  // ── Footer ──────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...VIOLET_LIGHT);
  doc.rect(0, pageH - 18, pageW, 18, "F");
  doc.setTextColor(...VIOLET);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    `Generated by InvoiceMarshal  ·  ${invoice.invoiceNumber}  ·  Thank you for your business!`,
    pageW / 2,
    pageH - 7,
    { align: "center" }
  );

  return doc.output("arraybuffer") as unknown as Uint8Array;
}
```

**✅ Outcome:** Beautiful branded PDF with violet header, auto-table line items, totals, notes, footer.

---

## 🔄 PHASE 5 — Email Service (Day 2–3)

### Step 5.1 · Mailtrap Integration

**File:** `src/lib/mail.ts`

```typescript
const MAILTRAP_TOKEN  = process.env.MAILTRAP_API_TOKEN!;
const SENDER_EMAIL    = process.env.MAILTRAP_SENDER_EMAIL!;
const SENDER_NAME     = process.env.MAILTRAP_SENDER_NAME ?? "InvoiceMarshal";

interface SendInvoiceEmailParams {
  to: string;
  invoice: {
    invoiceNumber: string;
    totalAmount:   number;
    balanceDue:    number;
    currency:      string;
    dueDate:       Date;
    pdfUrl?:       string | null;
    user: {
      businessName?: string | null;
      businessEmail?: string | null;
    };
    client: { name: string };
  };
}

export async function sendInvoiceEmail({ to, invoice }: SendInvoiceEmailParams) {
  const subject = `Invoice ${invoice.invoiceNumber} from ${invoice.user.businessName ?? "InvoiceMarshal"}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(109,40,217,0.1);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">InvoiceMarshal</h1>
      <p style="color:#ddd6fe;margin:8px 0 0;font-size:14px;">Invoice Management Platform</p>
    </div>
    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Hello ${invoice.client.name},</h2>
      <p style="color:#6b7280;line-height:1.6;margin:0 0 24px;">
        Please find your invoice below. Kindly arrange payment before the due date.
      </p>
      <!-- Invoice Card -->
      <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:24px;margin:0 0 24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#6b7280;font-size:13px;padding:4px 0;">Invoice Number</td>
            <td style="color:#6d28d9;font-size:13px;font-weight:600;text-align:right;">${invoice.invoiceNumber}</td>
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
              ${new Date(invoice.dueDate).toLocaleDateString("en-LK", { year:"numeric", month:"long", day:"numeric" })}
            </td>
          </tr>
        </table>
      </div>
      ${invoice.pdfUrl ? `
      <!-- CTA Button -->
      <div style="text-align:center;margin:0 0 32px;">
        <a href="${invoice.pdfUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;box-shadow:0 4px 14px rgba(109,40,217,0.3);">
          📄 Download Invoice PDF
        </a>
      </div>` : ""}
      <p style="color:#9ca3af;font-size:12px;line-height:1.5;">
        This invoice was sent by ${invoice.user.businessName ?? "InvoiceMarshal"}. 
        If you have questions, please contact ${invoice.user.businessEmail ?? SENDER_EMAIL}.
      </p>
    </div>
    <!-- Footer -->
    <div style="background:#f5f3ff;padding:20px 40px;text-align:center;">
      <p style="color:#8b5cf6;font-size:12px;margin:0;">
        Powered by <strong>InvoiceMarshal</strong> — Smart Invoicing for South Asia
      </p>
    </div>
  </div>
</body>
</html>`;

  const response = await fetch("https://send.api.mailtrap.io/api/send", {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${MAILTRAP_TOKEN}`,
    },
    body: JSON.stringify({
      from:    { email: SENDER_EMAIL, name: SENDER_NAME },
      to:      [{ email: to }],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mailtrap error: ${error}`);
  }
}

export async function sendOverdueReminder({
  to,
  clientName,
  invoiceNumber,
  balanceDue,
  currency,
  daysOverdue,
  pdfUrl,
}: {
  to:            string;
  clientName:    string;
  invoiceNumber: string;
  balanceDue:    number;
  currency:      string;
  daysOverdue:   number;
  pdfUrl?:       string | null;
}) {
  const subject = `[OVERDUE] Invoice ${invoiceNumber} — Payment Required`;

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fff5f5;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border-top:4px solid #ef4444;">
    <div style="background:#fef2f2;padding:24px 40px;border-bottom:1px solid #fecaca;">
      <h2 style="color:#dc2626;margin:0;font-size:18px;">⚠️ Payment Overdue — ${daysOverdue} Days</h2>
    </div>
    <div style="padding:40px;">
      <p style="color:#374151;">Dear ${clientName},</p>
      <p style="color:#6b7280;">Invoice <strong>${invoiceNumber}</strong> is <strong style="color:#dc2626;">${daysOverdue} days overdue</strong>.
        Amount outstanding: <strong>${new Intl.NumberFormat("en-LK", { style:"currency", currency }).format(balanceDue)}</strong>
      </p>
      ${pdfUrl ? `<a href="${pdfUrl}" style="display:inline-block;background:#ef4444;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">View Invoice</a>` : ""}
    </div>
  </div>
</body>
</html>`;

  await fetch("https://send.api.mailtrap.io/api/send", {
    method:  "POST",
    headers: { "Content-Type":"application/json", Authorization:`Bearer ${MAILTRAP_TOKEN}` },
    body: JSON.stringify({
      from:    { email: SENDER_EMAIL, name: SENDER_NAME },
      to:      [{ email: to }],
      subject, html,
    }),
  });
}
```

**✅ Outcome:** Beautiful branded email templates for invoice delivery and overdue reminders.

---

## 🔄 PHASE 6 — UI Pages & Components (Day 3–5)

### Step 6.1 · Root Layout

**File:** `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:       "InvoiceMarshal — Smart Invoicing for South Asia",
  description: "Professional invoice management for Sri Lankan businesses. Create, send, and track invoices with ease.",
  keywords:    "invoice, Sri Lanka, LKR, billing, SaaS, small business",
  openGraph: {
    title:       "InvoiceMarshal",
    description: "Smart Invoicing for South Asia",
    type:        "website",
    locale:      "en_LK",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en-LK">
        <body className={inter.className}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
```

---

### Step 6.2 · Landing Page

**File:** `src/app/page.tsx`

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Shield, Zap, TrendingUp,
  Globe, CheckCircle, ArrowRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navigation ── */}
      <nav className="border-b border-brand-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-brand-700 text-lg">InvoiceMarshal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-brand-600 hover:bg-brand-50">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="gradient-brand text-white hover:opacity-90 shadow-violet-md">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="gradient-brand-soft py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-brand-100 text-brand-700 border-brand-200 mb-6">
            🇱🇰 Built for Sri Lankan Businesses
          </Badge>
          <h1 className="text-5xl font-bold text-brand-700 mb-6 leading-tight">
            Invoice Smarter.<br />
            <span className="text-transparent bg-clip-text gradient-brand">Get Paid Faster.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional invoicing with VAT compliance, multi-currency support, and instant PDF generation.
            Designed for Sri Lankan freelancers, SMEs, and growing businesses.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="gradient-brand text-white shadow-violet-lg hover:opacity-90 h-12 px-8">
                Start Free — No Credit Card <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="border-brand-300 text-brand-700 hover:bg-brand-50 h-12 px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-brand-700 mb-4">
            Everything Your Business Needs
          </h2>
          <p className="text-center text-gray-500 mb-16">
            Built with real Sri Lankan businesses in mind
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Bank-Grade Security", desc: "Clerk OIDC authentication, Row-Level Security, signed URLs. Your data never leaves your account." },
              { icon: Zap, title: "Instant PDF Invoices", desc: "Generate professional branded PDFs in one click. Send directly to clients via email." },
              { icon: TrendingUp, title: "Revenue Analytics", desc: "Real-time charts for revenue trends, overdue tracking, and payment forecasting." },
              { icon: Globe, title: "Multi-Currency", desc: "Full support for LKR, USD, EUR, INR, and more. VAT-compliant for Sri Lanka's 2026 tax changes." },
              { icon: FileText, title: "Client Management", desc: "Centralize all client data, track invoice history, and automate payment reminders." },
              { icon: CheckCircle, title: "Payment Tracking", desc: "Record partial payments, mark invoices paid, and track outstanding balances." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-brand-100 hover:border-brand-300 hover:shadow-violet-md transition-all group">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center mb-4 group-hover:bg-brand-600 transition-colors">
                  <Icon className="w-5 h-5 text-brand-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="gradient-brand-soft border-t border-brand-100 py-12 px-6 text-center">
        <p className="text-brand-700 font-semibold text-lg mb-2">InvoiceMarshal</p>
        <p className="text-gray-500 text-sm">Smart invoicing for South Asian businesses · Made with 💜 for Sri Lanka</p>
      </footer>
    </div>
  );
}
```

---

### Step 6.3 · Auth Pages (Clerk)

**File:** `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen gradient-brand-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-700">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your InvoiceMarshal account</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              card:            "shadow-violet-lg border border-brand-100",
              headerTitle:     "hidden",
              headerSubtitle:  "hidden",
              socialButtonsBlockButton: "border-brand-200 hover:bg-brand-50",
              formButtonPrimary:"gradient-brand hover:opacity-90",
              footerActionLink: "text-brand-600",
            },
          }}
        />
      </div>
    </div>
  );
}
```

**File:** `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen gradient-brand-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-700">Create Account</h1>
          <p className="text-gray-500 mt-1">Start invoicing in minutes — free forever</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              card:            "shadow-violet-lg border border-brand-100",
              headerTitle:     "hidden",
              headerSubtitle:  "hidden",
              formButtonPrimary:"gradient-brand hover:opacity-90",
              footerActionLink: "text-brand-600",
            },
          }}
        />
      </div>
    </div>
  );
}
```

---

### Step 6.4 · Onboarding Page

**File:** `src/app/onboarding/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations";
import { onboardUser } from "@/actions/user.actions";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { defaultCurrency: "LKR" },
  });

  async function onSubmit(data: OnboardingInput) {
    setLoading(true);
    try {
      await onboardUser(data);
      toast.success("Business profile saved! Welcome to InvoiceMarshal 🎉");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen gradient-brand-soft flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-violet-lg border border-brand-100 p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-700">Set Up Your Business</h1>
            <p className="text-gray-500 text-sm">This appears on all your invoices</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} className="mt-1 focus:ring-brand-500" />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} className="mt-1" />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="businessName">Business / Company Name</Label>
            <Input id="businessName" {...register("businessName")} placeholder="Your Business (Pvt) Ltd" className="mt-1" />
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
          </div>

          <div>
            <Label htmlFor="businessAddress">Business Address</Label>
            <Input id="businessAddress" {...register("businessAddress")} placeholder="No. 45, Galle Road" className="mt-1" />
            {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessCity">City</Label>
              <Input id="businessCity" {...register("businessCity")} placeholder="Colombo" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="businessPhone">Phone</Label>
              <Input id="businessPhone" {...register("businessPhone")} placeholder="+94 77 123 4567" className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vatNumber">VAT Registration No. (optional)</Label>
              <Input id="vatNumber" {...register("vatNumber")} placeholder="VAT123456789" className="mt-1" />
            </div>
            <div>
              <Label>Default Currency</Label>
              <Select defaultValue="LKR" onValueChange={(v) => setValue("defaultCurrency", v as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["LKR", "USD", "EUR", "GBP", "INR", "AED"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-brand text-white h-11 text-base font-semibold shadow-violet-md hover:opacity-90 mt-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Setting up your account...</>
            ) : (
              "Complete Setup & Go to Dashboard →"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

---

### Step 6.5 · Dashboard Layout with Sidebar

**File:** `src/app/(dashboard)/layout.tsx`

```tsx
import { redirect }    from "next/navigation";
import { auth }        from "@clerk/nextjs/server";
import { prisma }      from "@/lib/db";
import { Sidebar }     from "@/components/shared/sidebar";
import { Navbar }      from "@/components/shared/navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/sign-in");
  if (!user.isOnboarded) redirect("/onboarding");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

**File:** `src/components/shared/sidebar.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Users,
  Settings, TrendingUp, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard",       label: "Dashboard",  icon: LayoutDashboard },
  { href: "/invoices",        label: "Invoices",   icon: FileText },
  { href: "/clients",         label: "Clients",    icon: Users },
  { href: "/dashboard#analytics", label: "Analytics", icon: TrendingUp },
  { href: "/settings",        label: "Settings",   icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-brand-100 flex flex-col h-full shadow-violet-sm">
      {/* Logo */}
      <div className="p-6 border-b border-brand-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-brand-700 text-lg">InvoiceMarshal</span>
        </div>
      </div>

      {/* Quick Action */}
      <div className="p-4 border-b border-brand-50">
        <Link href="/invoices/new">
          <Button className="w-full gradient-brand text-white hover:opacity-90 shadow-violet-md">
            <Plus className="w-4 h-4 mr-2" /> New Invoice
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-brand-100 text-brand-700 shadow-violet-sm"
                  : "text-gray-600 hover:bg-brand-50 hover:text-brand-600"
              )}>
                <Icon className={cn("w-4 h-4", active ? "text-brand-600" : "text-gray-400")} />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-brand-100">
        <p className="text-xs text-gray-400 text-center">InvoiceMarshal v1.0</p>
      </div>
    </aside>
  );
}
```

---

### Step 6.6 · Dashboard Page with Charts

**File:** `src/app/(dashboard)/dashboard/page.tsx`

```tsx
import { getDashboardStats } from "@/actions/invoice.actions";
import { StatsCards }        from "@/components/dashboard/stats-cards";
import { RevenueChart }      from "@/components/dashboard/revenue-chart";
import { RecentInvoices }    from "@/components/dashboard/recent-invoices";
import { InvoiceAgingChart } from "@/components/dashboard/invoice-aging-chart";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">Dashboard</h1>
        <p className="text-gray-500 mt-1">Your financial overview at a glance</p>
      </div>

      {/* KPI Cards */}
      <StatsCards stats={stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.monthlyRevenue} currency={stats.currency} />
        </div>
        <div>
          <InvoiceAgingChart
            paid={stats.paidCount}
            overdue={stats.overdueCount}
            draft={stats.draftCount}
          />
        </div>
      </div>

      {/* Recent Invoices */}
      <RecentInvoices invoices={stats.recentInvoices} currency={stats.currency} />
    </div>
  );
}
```

**File:** `src/components/dashboard/stats-cards.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, AlertCircle, FileText, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalRevenue: number;
    overdueAmount: number;
    totalInvoices: number;
    paidCount: number;
    currency: string;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label:   "Total Revenue",
      value:   formatCurrency(stats.totalRevenue, stats.currency),
      icon:    TrendingUp,
      color:   "text-emerald-600",
      bg:      "bg-emerald-50",
      border:  "border-emerald-100",
    },
    {
      label:   "Outstanding",
      value:   formatCurrency(stats.overdueAmount, stats.currency),
      icon:    AlertCircle,
      color:   "text-red-600",
      bg:      "bg-red-50",
      border:  "border-red-100",
    },
    {
      label:   "Total Invoices",
      value:   stats.totalInvoices.toString(),
      icon:    FileText,
      color:   "text-brand-600",
      bg:      "bg-brand-50",
      border:  "border-brand-100",
    },
    {
      label:   "Paid",
      value:   stats.paidCount.toString(),
      icon:    CheckCircle,
      color:   "text-violet-600",
      bg:      "bg-violet-50",
      border:  "border-violet-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`bg-white rounded-xl p-5 border ${card.border} shadow-sm hover:shadow-violet-sm transition-shadow`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">{card.label}</span>
            <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${card.color} font-mono`}>{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
```

**File:** `src/components/dashboard/revenue-chart.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

interface RevenueChartProps {
  data:     { month: string; revenue: number }[];
  currency: string;
}

export function RevenueChart({ data, currency }: RevenueChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl p-6 border border-brand-100 shadow-sm"
    >
      <h3 className="font-semibold text-gray-900 mb-1">Revenue Trend</h3>
      <p className="text-xs text-gray-400 mb-5">Last 6 months · {currency}</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ border: "1px solid #ddd6fe", borderRadius: 8, fontSize: 12 }}
            formatter={(v: number) => [
              new Intl.NumberFormat("en-LK", { style: "currency", currency }).format(v),
              "Revenue",
            ]}
          />
          <Area
            type="monotone" dataKey="revenue"
            stroke="#6d28d9" strokeWidth={2}
            fill="url(#violetGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
```

**File:** `src/components/dashboard/invoice-aging-chart.tsx`

```tsx
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

export function InvoiceAgingChart({
  paid, overdue, draft,
}: { paid: number; overdue: number; draft: number }) {
  const data = [
    { name: "Paid",    value: paid,    color: "#10b981" },
    { name: "Overdue", value: overdue, color: "#ef4444" },
    { name: "Draft",   value: draft,   color: "#8b5cf6" },
  ].filter((d) => d.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl p-6 border border-brand-100 shadow-sm h-full"
    >
      <h3 className="font-semibold text-gray-900 mb-1">Invoice Status</h3>
      <p className="text-xs text-gray-400 mb-4">Current breakdown</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => [`${v} invoices`, ""]} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
```

---

## 🔄 PHASE 7 — Final Config & Deployment (Day 5–6)

### Step 7.1 · Next.js Config with Security Headers

**File:** `next.config.ts`

```typescript
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",    value: "on" },
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.accounts.dev",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' blob: data: https://*.clerk.com https://img.clerk.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src https://clerk.com https://*.clerk.accounts.dev",
      "connect-src 'self' https://api.clerk.com https://*.clerk.accounts.dev",
    ].join("; "),
  },
];

const config: NextConfig = {
  headers: async () => [
    { source: "/(.*)", headers: securityHeaders },
  ],
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"],
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
};

export default config;
```

---

### Step 7.2 · Vercel Deployment Config

**File:** `vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL":                        "@database_url",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY":   "@clerk_publishable_key",
    "CLERK_SECRET_KEY":                    "@clerk_secret_key",
    "CLERK_WEBHOOK_SECRET":                "@clerk_webhook_secret",
    "BLOB_READ_WRITE_TOKEN":               "@blob_token",
    "MAILTRAP_API_TOKEN":                  "@mailtrap_token",
    "MAILTRAP_SENDER_EMAIL":               "@mailtrap_sender"
  }
}
```

---

### Step 7.3 · Final Launch Commands

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Push schema to database
npx prisma db push

# 3. Verify database connection
npx prisma studio

# 4. Start local dev server
npm run dev

# 5. Run linter and type-check
npm run lint
npx tsc --noEmit

# 6. Build for production
npm run build

# 7. Deploy to Vercel
npx vercel --prod
```

---

## 🔒 Security Checklist (AI Agent Must Verify)

Before deploying to production, verify every item:

```
AUTH & SESSIONS
  [ ] Clerk middleware protects ALL /dashboard/* and /api/* routes
  [ ] Webhook endpoint verifies svix signature (rejects spoofed calls)
  [ ] Clerk session expires correctly (15min access / 7day refresh)
  [ ] Magic Link + OAuth social login configured in Clerk dashboard

DATA VALIDATION
  [ ] Every Server Action uses Zod .parse() before touching database
  [ ] XSS check regex applied to all free-text fields (description, notes, address)
  [ ] Client email validated with z.string().email()
  [ ] Amount validated as positive number with max cap

DATABASE SECURITY
  [ ] Every Prisma query filters by userId (Row-Level Security)
  [ ] Ownership check before every update/delete operation
  [ ] No raw SQL except the monthly revenue aggregate (parameterized)
  [ ] .env.local never committed (check .gitignore)

PDF & FILE SECURITY
  [ ] PDFs uploaded to Vercel Blob with unique userId/invoiceId path
  [ ] PDF URL returned to frontend only after ownership verification
  [ ] No PDFs accessible without authenticated session

EMAIL SECURITY
  [ ] Mailtrap API token stored in environment variable only
  [ ] Sender email verified in Mailtrap dashboard
  [ ] No user-controlled content injected unsanitized into email HTML

DEPLOYMENT
  [ ] All env vars set in Vercel dashboard (encrypted at rest)
  [ ] CSP headers block unauthorized script sources
  [ ] X-Frame-Options: SAMEORIGIN (prevents clickjacking)
  [ ] HTTPS enforced (Vercel default)
  [ ] Prisma generate runs before build (in vercel.json buildCommand)
  [ ] Database connection string uses SSL (add ?sslmode=require)
```

---

## 📊 Design System Reference

```
BRAND PALETTE
  Primary:       #8b5cf6 (violet-500) — buttons, links
  Dark Primary:  #6d28d9 (violet-700) — headings, sidebar active
  Soft BG:       #f5f3ff (violet-50)  — page backgrounds, cards
  Border:        #ddd6fe (violet-200) — card borders

STATUS COLORS
  Paid/Success:  #10b981 (emerald-500)
  Overdue/Error: #ef4444 (red-500)
  Draft/Neutral: #6b7280 (gray-500)
  Sent/Info:     #3b82f6 (blue-500)
  Partial/Warn:  #f59e0b (amber-500)

TYPOGRAPHY
  Font Family:   Inter (body), JetBrains Mono (numbers/codes)
  Heading 1:     32px bold, brand-700
  Heading 2:     24px semibold, brand-700
  Body:          16px regular, gray-600
  Caption:       12px regular, gray-400
  Invoice No.:   Mono, brand-600

SPACING
  Card padding:    24px
  Section gap:     24px
  Component gap:   16px
  Sidebar width:   256px
  Max content:     1280px
```

---

## 🚀 Production Go-Live Checklist

```
BEFORE LAUNCH
  [ ] Custom domain configured on Vercel
  [ ] SSL certificate active
  [ ] Clerk production instance (not development)
  [ ] Mailtrap production sending domain verified
  [ ] Database backed up
  [ ] Prisma migrations run (not just db push)
  [ ] Rate limiting enabled on invoice creation + email send endpoints
  [ ] Error monitoring set up (Sentry or Vercel analytics)

AFTER LAUNCH
  [ ] Test sign-up → onboarding → create invoice → send email flow end-to-end
  [ ] Test PDF generation and download
  [ ] Test overdue reminder email
  [ ] Test multi-currency formatting (LKR, USD)
  [ ] Check mobile responsiveness on real device
  [ ] Verify Clerk webhooks receiving events in production
```

---

## 📦 Complete Package.json Dependencies

```json
{
  "dependencies": {
    "@clerk/nextjs":         "^6.0.0",
    "@hookform/resolvers":   "^3.9.0",
    "@prisma/client":        "^5.22.0",
    "@radix-ui/react-slot":  "^1.1.0",
    "@vercel/blob":          "^0.24.0",
    "class-variance-authority": "^0.7.0",
    "clsx":                  "^2.1.1",
    "date-fns":              "^4.1.0",
    "framer-motion":         "^11.11.0",
    "jspdf":                 "^2.5.2",
    "jspdf-autotable":       "^3.8.3",
    "lucide-react":          "^0.460.0",
    "next":                  "15.0.0",
    "next-themes":           "^0.4.3",
    "react":                 "^19.0.0",
    "react-dom":             "^19.0.0",
    "react-hook-form":       "^7.53.2",
    "recharts":              "^2.13.3",
    "sonner":                "^1.7.0",
    "svix":                  "^1.30.0",
    "tailwind-merge":        "^2.5.4",
    "tailwindcss-animate":   "^1.0.7",
    "zod":                   "^3.23.8"
  },
  "devDependencies": {
    "@types/node":   "^22.0.0",
    "@types/react":  "^19.0.0",
    "prisma":        "^5.22.0",
    "typescript":    "^5.0.0"
  }
}
```

---

*InvoiceMarshal v1.0 — Built for Sri Lanka, Ready for the World*  
*Security-first · Violet + White · AI Agent Executable from Start to End*
