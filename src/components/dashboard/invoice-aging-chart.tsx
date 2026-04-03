"use client";

import { motion } from "framer-motion";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function InvoiceAgingChart({
  paid,
  overdue,
  draft,
}: {
  paid: number;
  overdue: number;
  draft: number;
}) {
  const data = [
    { name: "Paid", value: paid, color: "#10b981" },
    { name: "Overdue", value: overdue, color: "#ef4444" },
    { name: "Draft", value: draft, color: "#8b5cf6" },
  ].filter((entry) => entry.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="h-full rounded-xl border border-brand-100 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-1 font-semibold text-gray-900">Invoice Status</h3>
      <p className="mb-4 text-xs text-gray-400">Current breakdown</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} invoices`, ""]} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
