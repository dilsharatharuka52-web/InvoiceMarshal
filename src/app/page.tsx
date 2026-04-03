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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-brand-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-brand-700">InvoiceMarshal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" prefetch={false}>
              <Button variant="ghost" className="text-brand-600 hover:bg-brand-50">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" prefetch={false}>
              <Button className="gradient-brand text-white hover:opacity-90 shadow-violet-md">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="gradient-brand-soft px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 border-brand-200 bg-brand-100 text-brand-700">
            Built for Sri Lankan businesses
          </Badge>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-brand-700">
            Invoice smarter.
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              Get paid faster.
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-600">
            Professional invoicing with VAT-friendly workflows, multi-currency support,
            and instant PDF generation for freelancers, SMEs, and growing teams.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-up" prefetch={false}>
              <Button
                size="lg"
                className="h-12 px-8 text-white shadow-violet-lg hover:opacity-90 gradient-brand"
              >
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in" prefetch={false}>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-brand-300 px-8 text-brand-700 hover:bg-brand-50"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-brand-700">
            Everything your business needs
          </h2>
          <p className="mb-16 text-center text-gray-500">
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

      <footer className="gradient-brand-soft border-t border-brand-100 px-6 py-12 text-center">
        <p className="mb-2 text-lg font-semibold text-brand-700">InvoiceMarshal</p>
        <p className="text-sm text-gray-500">
          Smart invoicing for South Asian businesses.
        </p>
      </footer>
    </div>
  );
}
