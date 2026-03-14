"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: DataPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={(v) => (v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "")}
          />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(v) => `₹${v}`} />
          <Tooltip
            labelFormatter={(v) => (v ? new Date(v).toLocaleDateString("en-IN") : "")}
            formatter={(value) => [`₹${value ?? 0}`, "Revenue"]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
