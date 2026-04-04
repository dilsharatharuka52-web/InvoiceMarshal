import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  Globe,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    desc: "Clerk authentication, row-level access checks, and secure storage patterns keep every account isolated.",
  },
  {
    icon: Zap,
    title: "Instant PDF Invoices",
    desc: "Generate polished invoice PDFs and share them directly with clients through built-in workflows.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Analytics",
    desc: "Track overdue balances, paid totals, and monthly trends from one clean dashboard.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    desc: "Support LKR, USD, EUR, GBP, INR, and AED for regional and international billing.",
  },
  {
    icon: FileText,
    title: "Client Management",
    desc: "Keep client details, invoice history, and payment status organized in one place.",
  },
  {
    icon: CheckCircle,
    title: "Payment Tracking",
    desc: "Record partial payments, close invoices accurately, and follow balance due in real time.",
  },
];

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    cadence: "for 30 days",
    description: "Start with the full invoicing workflow before you commit.",
    cta: "Start Free Trial",
    featured: false,
    items: [
      "30-day free trial",
      "Unlimited invoices during trial",
      "PDF invoice generation",
      "Client and payment tracking",
    ],
  },
  {
    name: "Standard",
    price: "Coming Soon",
    cadence: "",
    description: "For solo founders and small teams that need a reliable billing flow.",
    cta: "Coming Soon",
    featured: true,
    items: [
      "Everything in Free Trial",
      "Recurring invoices and reminders",
      "Email and share tools",
      "Dashboard analytics",
    ],
  },
  {
    name: "Pro",
    price: "Coming Soon",
    cadence: "",
    description: "For growing businesses that want stronger automation and brand control.",
    cta: "Coming Soon",
    featured: false,
    items: [
      "Everything in Standard",
      "Advanced branding controls",
      "Priority support",
      "Faster workflow for high-volume billing",
    ],
  },
];

const starterPlan = plans[0]!;
const paidPlans = plans.slice(1);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-brand-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex items-center gap-2">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg gradient-brand">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="truncate text-base font-bold text-brand-700 sm:text-lg">
              InvoiceMarshal
            </span>
          </div>
          <div className="flex flex-none items-center gap-2 sm:gap-3">
            <Link href="#pricing" prefetch={false}>
              <Button
                variant="ghost"
                className="hidden text-brand-600 hover:bg-brand-50 sm:inline-flex"
              >
                Pricing
              </Button>
            </Link>
            <Link href="/sign-in" prefetch={false}>
              <Button
                variant="ghost"
                size="sm"
                className="px-3 text-brand-600 hover:bg-brand-50 sm:px-4"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" prefetch={false}>
              <Button
                size="sm"
                className="gradient-brand px-3 text-white hover:opacity-90 shadow-violet-md sm:px-4"
              >
                <span className="hidden sm:inline">Get Started Free</span>
                <span className="sm:hidden">Start Free</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="gradient-brand-soft px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 border-brand-200 bg-brand-100 text-brand-700">
            Built for Sri Lankan businesses
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-brand-700 sm:text-5xl">
            Invoice smarter.
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              Get paid faster.
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-xl">
            Professional invoicing with VAT-friendly workflows, multi-currency support,
            and instant PDF generation for freelancers, SMEs, and growing teams.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href="/sign-up" prefetch={false}>
              <Button
                size="lg"
                className="h-12 w-full px-8 text-white shadow-violet-lg hover:opacity-90 gradient-brand sm:w-auto"
              >
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in" prefetch={false}>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full border-brand-300 px-8 text-brand-700 hover:bg-brand-50 sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-brand-700 sm:text-3xl">
            Everything your business needs
          </h2>
          <p className="mb-12 text-center text-gray-500 sm:mb-16">
            A focused invoicing workflow with the essentials already wired together.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border border-brand-100 p-6 transition-all hover:border-brand-300 hover:shadow-violet-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 transition-colors group-hover:bg-brand-600">
                  <Icon className="h-5 w-5 text-brand-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="gradient-brand-soft px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge className="mb-4 border-brand-200 bg-white text-brand-700">
              Simple Pricing
            </Badge>
            <h2 className="mb-4 text-center text-2xl font-bold text-brand-700 sm:text-3xl">
              Start free, then scale when you are ready
            </h2>
            <p className="text-gray-600">
              Start with the free 30-day trial today. Standard and Pro plans are marked as coming soon.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div
              className={`relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-sm transition-transform hover:-translate-y-1 ${
                starterPlan.featured
                  ? "border-brand-300 shadow-violet-lg"
                  : "border-brand-100"
              }`}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{starterPlan.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {starterPlan.description}
                  </p>
                </div>
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Start Here
                </Badge>
              </div>

              <div className="mb-6">
                <div className="flex flex-wrap items-end gap-2">
                  <span className="text-4xl font-bold text-brand-700">{starterPlan.price}</span>
                  <span className="pb-1 text-sm text-gray-500">{starterPlan.cadence}</span>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {starterPlan.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="relative z-10 w-full gradient-brand text-white hover:opacity-90"
              >
                <Link href="/sign-up" prefetch={false}>
                  {starterPlan.cta}
                </Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-5xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
                Coming Soon
              </p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
                Standard and Pro plans are on the way
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {paidPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-sm transition-transform hover:-translate-y-1 ${
                  plan.featured
                    ? "border-brand-300 shadow-violet-lg"
                    : "border-brand-100"
                }`}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {plan.description}
                    </p>
                  </div>
                  {plan.featured && (
                    <Badge className="border-brand-200 bg-brand-100 text-brand-700">
                      Coming Soon
                    </Badge>
                  )}
                </div>

                <div className="mb-6">
                  <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                    {plan.price}
                  </span>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  disabled
                  className="relative z-10 w-full cursor-not-allowed opacity-70"
                  variant="outline"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <footer className="gradient-brand-soft border-t border-brand-100 px-4 py-10 text-center sm:px-6 sm:py-12">
        <p className="mb-2 text-lg font-semibold text-brand-700">InvoiceMarshal</p>
        <p className="text-sm text-gray-500">
          Smart invoicing for South Asian businesses.
        </p>
      </footer>
    </div>
  );
}
