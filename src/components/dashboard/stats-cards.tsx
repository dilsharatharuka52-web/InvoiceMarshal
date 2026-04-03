"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, FileText, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue, stats.currency),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Outstanding",
      value: formatCurrency(stats.overdueAmount, stats.currency),
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
    },
    {
      label: "Total Invoices",
      value: stats.totalInvoices.toString(),
      icon: FileText,
      color: "text-brand-600",
      bg: "bg-brand-50",
      border: "border-brand-100",
    },
    {
      label: "Paid",
      value: stats.paidCount.toString(),
      icon: CheckCircle,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className={`rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-violet-sm ${card.border}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">{card.label}</span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </div>
          <p className={`font-mono text-2xl font-bold ${card.color}`}>{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
