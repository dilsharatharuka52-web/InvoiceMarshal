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
  X,
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

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  pathname,
  onNavigate,
  showClose,
  onClose,
}: {
  pathname: string;
  onNavigate: () => void;
  showClose: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="border-b border-brand-100 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-brand">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="block text-lg font-bold text-brand-700">InvoiceMarshal</span>
              <span className="text-xs text-gray-400">Business dashboard</span>
            </div>
          </div>
          {showClose && onClose && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="border-b border-brand-50 p-4">
        <Link href="/invoices/new" onClick={onNavigate}>
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
            <Link key={href} href={href} onClick={onNavigate}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
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
    </>
  );
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden h-screen w-64 flex-col border-r border-brand-100 bg-white shadow-violet-sm md:flex">
        <SidebarContent
          pathname={pathname}
          onNavigate={() => {}}
          showClose={false}
        />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px] transition-opacity md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm flex-col border-r border-brand-100 bg-white shadow-2xl transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!mobileOpen}
      >
        <SidebarContent
          pathname={pathname}
          onNavigate={() => onClose?.()}
          showClose
          onClose={onClose}
        />
      </aside>
    </>
  );
}
