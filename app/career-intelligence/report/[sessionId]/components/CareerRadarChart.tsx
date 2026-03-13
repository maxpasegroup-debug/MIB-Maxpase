"use client";

import { motion } from "framer-motion";
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

interface CareerRadarChartProps {
  data: RadarDataPoint[];
}

export function CareerRadarChart({ data }: CareerRadarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-6 sm:p-8"
    >
      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart
            data={data}
            margin={{ top: 24, right: 32, bottom: 24, left: 32 }}
          >
            <PolarGrid
              stroke="#e5e7eb"
              strokeOpacity={0.8}
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: "#4b5563", fontWeight: 500 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="url(#radarStroke)"
              fill="url(#radarFill)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <defs>
              <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9333ea" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
              }}
              formatter={(value: number) => [value, "Score"]}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-sm text-gray-500 mt-4">
        0–30 Low · 31–50 Emerging · 51–70 Moderate · 71–85 Strong · 86–100 Exceptional
      </p>
    </motion.div>
  );
}
