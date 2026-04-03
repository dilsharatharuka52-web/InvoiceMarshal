"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/dashboard#analytics", label: "Analytics", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-64 flex-col border-r border-brand-100 bg-white shadow-violet-sm md:flex">
      <div className="border-b border-brand-100 p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-brand-700">InvoiceMarshal</span>
        </div>
      </div>

      <div className="border-b border-brand-50 p-4">
        <Link href="/invoices/new">
          <Button className="w-full gradient-brand text-white hover:opacity-90 shadow-violet-md">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-brand-100 text-brand-700 shadow-violet-sm"
                    : "text-gray-600 hover:bg-brand-50 hover:text-brand-600",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-brand-600" : "text-gray-400",
                  )}
                />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-100 p-4">
        <p className="text-center text-xs text-gray-400">InvoiceMarshal v1.0</p>
      </div>
    </aside>
  );
}
