import { getDashboardStats } from "@/actions/invoice.actions";
import { InvoiceAgingChart } from "@/components/dashboard/invoice-aging-chart";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">Dashboard</h1>
        <p className="mt-1 text-gray-500">Your financial overview at a glance.</p>
      </div>

      <StatsCards stats={stats} />

      <div id="analytics" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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

      <RecentInvoices invoices={stats.recentInvoices} currency={stats.currency} />
    </div>
  );
}
