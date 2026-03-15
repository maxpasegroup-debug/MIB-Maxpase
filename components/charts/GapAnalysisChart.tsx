"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CAREER_10D_LABELS } from "@/lib/careerDimensions";
import type { Career10DDimensionKey } from "@/lib/careerDimensions";

export type GapItem = { dimension: string; gap: number };

interface GapAnalysisChartProps {
  gaps: GapItem[];
}

const BAR_COLORS = ["#7c3aed", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b", "#1e3a5f", "#0f172a", "#64748b"];

export default function GapAnalysisChart({ gaps }: GapAnalysisChartProps) {
  const data = gaps.map(({ dimension, gap }) => ({
    dimension: CAREER_10D_LABELS[dimension as Career10DDimensionKey] ?? dimension,
    gap: Math.round(gap * 10) / 10,
  }));

  return (
    <div className="w-full min-h-[320px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" domain={[0, "auto"]} tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis
            type="category"
            dataKey="dimension"
            width={76}
            tick={{ fontSize: 11, fill: "#374151" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
            }}
            formatter={(value) => [value ?? 0, "Gap"]}
            labelFormatter={(label) => `Dimension: ${label}`}
          />
          <Bar dataKey="gap" name="Gap" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={600}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
