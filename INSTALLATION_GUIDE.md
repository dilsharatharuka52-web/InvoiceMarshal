# InvoiceMarshal Installation Guide

This guide is based on [INVOICEMARSHAL.md](/Users/tharukadilshara/PROJECT/Invoice_v1/InvoiceMarshal_v1_o/INVOICEMARSHAL.md) and rewrites the setup flow into a practical, step-by-step installation checklist.

Use this guide if you want to bootstrap the InvoiceMarshal project from an empty machine and get the local app running before continuing with the full implementation plan.

## 1. Prepare Your Machine

Install the following before you start:

1. Node.js and npm.
2. PostgreSQL.
3. Git.
4. A code editor such as VS Code.
5. A terminal shell.

Verify the tools are available:

```bash
node -v
npm -v
git --version
psql --version
```

If any command fails, install that tool first and rerun the check.

## 2. Create the Required External Accounts

You need these services because the build plan depends on them:

1. Clerk for authentication.
2. Mailtrap for transactional email delivery.
3. Vercel Blob for PDF storage.
4. Vercel for deployment.

Create each account before continuing. Keep each dashboard open because you will copy credentials into `.env.local` later.

## 3. Create the Next.js Project

Run the project bootstrap command exactly as shown:

```bash
npx create-next-app@latest invoicemarshal \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Move into the new project folder:

```bash
cd invoicemarshal
```

Verify the project was created:

```bash
ls
```

You should see `package.json`, `src/`, `public/`, and the default Next.js starter files.

## 4. Remove Unused Legacy Packages

The build plan replaces Auth.js with Clerk. Remove the unused packages if they exist:

```bash
npm uninstall next-auth @auth/prisma-adapter nodemailer
```

If npm reports that one or more packages are not installed, that is fine.

## 5. Install All Runtime Dependencies

Install the application dependencies:

```bash
npm install \
  @clerk/nextjs \
  @hookform/resolvers \
  @prisma/client \
  @radix-ui/react-slot \
  @vercel/blob \
  class-variance-authority \
  clsx \
  date-fns \
  framer-motion \
  jspdf \
  jspdf-autotable \
  lucide-react \
  next-themes \
  react-hook-form \
  recharts \
  sonner \
  tailwind-merge \
  tailwindcss-animate \
  zod
```

Important note:

- `tailwindcss-animate` is required later by `tailwind.config.ts`.

## 6. Install Development Dependencies

Install the development packages:

```bash
npm install -D prisma @types/node @types/react typescript
```

## 7. Initialize Prisma

Create the Prisma starter files:

```bash
npx prisma init
```

Verify the result:

```bash
ls prisma
```

You should see `schema.prisma`. Prisma may also create an environment file depending on your local setup.

## 8. Initialize shadcn/ui

Set up shadcn/ui with the default configuration:

```bash
npx shadcn@latest init --defaults
```

Add the components required by the source plan:

```bash
npx shadcn@latest add button input label card badge select textarea \
  table dropdown-menu dialog sheet skeleton toast separator avatar \
  progress tabs popover calendar form
```

Let the installer finish all prompts before moving on.

## 9. Create the Database

Create a PostgreSQL database named `invoicemarshal`.

If you have local PostgreSQL tools installed, you can use:

```bash
createdb invoicemarshal
```

If `createdb` is not available, open PostgreSQL another way and create a database manually with this exact name:

```text
invoicemarshal
```

Verify the database exists:

```bash
psql -l
```

## 10. Configure Environment Variables

Create a local environment file:

```bash
touch .env.local
```

Open `.env.local` and paste the following template:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_REPLACE_ME
CLERK_SECRET_KEY=sk_live_REPLACE_ME

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/invoicemarshal"

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_REPLACE_ME

# Mailtrap
MAILTRAP_API_TOKEN=REPLACE_ME
MAILTRAP_SENDER_EMAIL=noreply@invoicemarshal.lk
MAILTRAP_SENDER_NAME=InvoiceMarshal

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=InvoiceMarshal
```

Replace every `REPLACE_ME` value with a real credential.

## 11. Create a Safe Example Environment File

Create `.env.example` and add the non-secret template:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
MAILTRAP_API_TOKEN=
MAILTRAP_SENDER_EMAIL=
MAILTRAP_SENDER_NAME=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=InvoiceMarshal
```

Do not put real secrets into `.env.example`.

## 12. Protect Local Secrets in Git Ignore

Open `.gitignore` and make sure these lines exist:

```gitignore
.env.local
.env.production
.env*.local
```

This prevents accidental commits of secret files.

## 13. Replace `tsconfig.json` with the Strict Configuration

Update `tsconfig.json` to match the build plan:

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

Save the file before moving on.

## 14. Replace `tailwind.config.ts`

Update `tailwind.config.ts` with the brand-aware Tailwind configuration from the source plan:

```ts
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
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        success: { DEFAULT: "#10b981", foreground: "#ffffff" },
        warning: { DEFAULT: "#f59e0b", foreground: "#ffffff" },
        danger: { DEFAULT: "#ef4444", foreground: "#ffffff" }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" }
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite"
      },
      boxShadow: {
        "violet-sm": "0 1px 3px 0 rgba(139, 92, 246, 0.1)",
        "violet-md": "0 4px 6px -1px rgba(139, 92, 246, 0.15)",
        "violet-lg": "0 10px 25px -5px rgba(139, 92, 246, 0.2)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
```

## 15. Replace `src/app/globals.css`

Update `src/app/globals.css` with the styles from the source plan:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 263.4 70% 50.4%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 263.4 70% 50.4%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --primary: 263.4 70% 50.4%;
    --primary-foreground: 210 20% 98%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 263.4 70% 50.4%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  h1 {
    @apply text-3xl font-bold tracking-tight text-brand-700;
  }

  h2 {
    @apply text-2xl font-semibold tracking-tight text-brand-700;
  }

  h3 {
    @apply text-xl font-semibold text-gray-900;
  }
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

## 16. Replace `prisma/schema.prisma`

Open `prisma/schema.prisma` and replace it with the full schema from Step 1.5 in [INVOICEMARSHAL.md](/Users/tharukadilshara/PROJECT/Invoice_v1/InvoiceMarshal_v1_o/INVOICEMARSHAL.md).

Do not partially copy the schema. You need all of these model groups:

1. `InvoiceStatus`, `Currency`, and `PaymentMethod` enums.
2. `User`.
3. `Client`.
4. `Invoice`.
5. `LineItem`.
6. `Payment`.
7. `EmailLog`.

After saving the schema, generate the client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

If the command fails, recheck `DATABASE_URL` and make sure PostgreSQL is running.

## 17. Create the Prisma Client Singleton

Create `src/lib/db.ts` with the Prisma singleton from Step 1.6 in [INVOICEMARSHAL.md](/Users/tharukadilshara/PROJECT/Invoice_v1/InvoiceMarshal_v1_o/INVOICEMARSHAL.md).

That file should:

1. Import `PrismaClient`.
2. Reuse a single Prisma instance in development.
3. Export `prisma`.

## 18. Create Shared Utilities

Create `src/lib/utils.ts` using the utility functions from Step 1.6 in [INVOICEMARSHAL.md](/Users/tharukadilshara/PROJECT/Invoice_v1/InvoiceMarshal_v1_o/INVOICEMARSHAL.md).

Make sure it includes:

1. `cn`.
2. `formatCurrency`.
3. `formatDate`.
4. `generateInvoiceNumber`.
5. `calculateInvoiceTotals`.
6. `getStatusColor`.
7. `getDaysOverdue`.

## 19. Set Up Clerk

In the Clerk dashboard:

1. Create a new application.
2. Enable the sign-in methods you want.
3. Copy the publishable key.
4. Copy the secret key.
5. Add your local development URL.

Paste the keys into `.env.local`.

Set these URLs exactly as shown unless you intentionally change the route structure:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## 20. Set Up Mailtrap

In Mailtrap:

1. Create or open a sending domain or transactional email setup.
2. Generate an API token.
3. Confirm the sender email you want to use.

Copy these values into `.env.local`:

```env
MAILTRAP_API_TOKEN=REPLACE_ME
MAILTRAP_SENDER_EMAIL=noreply@invoicemarshal.lk
MAILTRAP_SENDER_NAME=InvoiceMarshal
```

## 21. Set Up Vercel Blob

In Vercel:

1. Create a project or open the storage section.
2. Create a Blob store if you do not already have one.
3. Generate a read/write token.
4. Save the token into `.env.local` as `BLOB_READ_WRITE_TOKEN`.

This token is required because invoice PDFs are uploaded to Blob storage in the source plan.

## 22. Start the Local Development App

Run the local server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If the server starts successfully, your installation is working.

## 23. Run Verification Commands

Run the validation commands from the build plan:

```bash
npm run lint
npx tsc --noEmit
```

Optional Prisma check:

```bash
npx prisma studio
```

## 24. Prepare for Production Deployment

Create `vercel.json` with the deployment configuration from Step 7.2 in [INVOICEMARSHAL.md](/Users/tharukadilshara/PROJECT/Invoice_v1/InvoiceMarshal_v1_o/INVOICEMARSHAL.md).

Before deploying, make sure the same environment variables from `.env.local` are also configured in Vercel.

Then deploy:

```bash
npx vercel --prod
```

## 25. Final Installation Checklist

Before you continue with the rest of the implementation, verify all of the following:

1. `node -v`, `npm -v`, `git --version`, and `psql --version` work.
2. The `invoicemarshal` PostgreSQL database exists.
3. `.env.local` contains real Clerk, PostgreSQL, Mailtrap, and Blob values.
4. `.env.example` contains placeholders only.
5. `npx prisma generate` succeeds.
6. `npx prisma db push` succeeds.
7. `npm run dev` starts the app.
8. `npm run lint` succeeds.
9. `npx tsc --noEmit` succeeds.

## 26. What To Do Next

After installation is complete, continue implementing the remaining phases from [INVOICEMARSHAL.md](/Users/tharukadilshara/PROJECT/Invoice_v1/InvoiceMarshal_v1_o/INVOICEMARSHAL.md):

1. Validation and security layer.
2. Clerk webhook sync.
3. Server actions.
4. PDF generation.
5. Mail service.
6. UI pages and dashboard components.
7. Next.js production hardening and deployment.
