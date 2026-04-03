"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
  currency: string;
}

export function RevenueChart({ data, currency }: RevenueChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-1 font-semibold text-gray-900">Revenue Trend</h3>
      <p className="mb-5 text-xs text-gray-400">Last 6 months · {currency}</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ border: "1px solid #ddd6fe", borderRadius: 8, fontSize: 12 }}
            formatter={(value: number) => [
              new Intl.NumberFormat("en-LK", { style: "currency", currency }).format(value),
              "Revenue",
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6d28d9"
            strokeWidth={2}
            fill="url(#violetGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
