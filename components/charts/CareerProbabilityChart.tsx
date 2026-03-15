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

export type CareerProbabilityItem = { career: string; probability: number };

interface CareerProbabilityChartProps {
  items: CareerProbabilityItem[];
  topN?: number;
}

const FILL = "#7c3aed";

export default function CareerProbabilityChart({ items, topN = 8 }: CareerProbabilityChartProps) {
  const data = items.slice(0, topN).map(({ career, probability }) => ({
    career,
    probability: Math.round(probability),
  }));

  return (
    <div className="w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis
            type="category"
            dataKey="career"
            width={116}
            tick={{ fontSize: 11, fill: "#374151" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
            }}
            formatter={(value) => [`${value ?? 0}%`, "Fit"]}
            labelFormatter={(label) => label}
          />
          <Bar
            dataKey="probability"
            name="Fit %"
            fill={FILL}
            radius={[0, 4, 4, 0]}
            isAnimationActive
            animationDuration={600}
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.career}
                fill={FILL}
                fillOpacity={0.6 + (0.4 * (data.length - i)) / data.length}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
