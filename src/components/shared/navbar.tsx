import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user: {
    firstName?: string | null;
    businessName?: string | null;
  };
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="border-b border-brand-100 bg-white/90 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <p className="text-sm text-gray-500">Welcome back</p>
          <h2 className="text-lg font-semibold text-gray-900">
            {user.businessName ?? user.firstName ?? "InvoiceMarshal"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/invoices">
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Browse Invoices
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
