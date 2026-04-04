"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user: {
    firstName?: string | null;
    businessName?: string | null;
  };
  onMenuClick?: () => void;
}

export function Navbar({ user, onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/95 backdrop-blur-sm">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 sm:text-sm sm:normal-case sm:tracking-normal">
              Welcome back
            </p>
            <h2 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
              {user.businessName ?? user.firstName ?? "InvoiceMarshal"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/invoices" className="hidden sm:block">
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Browse Invoices
            </Button>
          </Link>
          <Link href="/invoices" className="sm:hidden">
            <Button variant="outline" size="icon" aria-label="Browse invoices">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
