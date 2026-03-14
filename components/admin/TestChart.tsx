"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  date: string;
  psychometric: number;
  career: number;
}

interface TestChartProps {
  data: DataPoint[];
}

export default function TestChart({ data }: TestChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={(v) => (v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "")}
          />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
          <Tooltip
            labelFormatter={(v) => (v ? new Date(v).toLocaleDateString("en-IN") : "")}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
          />
          <Legend />
          <Bar dataKey="psychometric" name="Psychometric" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          <Bar dataKey="career" name="Career" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
