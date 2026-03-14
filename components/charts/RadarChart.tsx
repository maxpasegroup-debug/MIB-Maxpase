"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TRAITS, TRAIT_LABELS, type TraitKey } from "@/lib/traits";

const RADAR_TRAITS: TraitKey[] = [
  "stress",
  "confidence",
  "emotional_stability",
  "decision_making",
  "social_behaviour",
  "technology_behaviour",
  "motivation",
  "resilience",
  "self_awareness",
  "life_satisfaction",
];

export interface RadarChartProps {
  traitScores: Record<string, number>;
}

function formatLabel(key: string): string {
  return TRAIT_LABELS[key as TraitKey] ?? key;
}

export default function RadarChart({ traitScores }: RadarChartProps) {
  const data = RADAR_TRAITS.map((trait) => ({
    subject: formatLabel(trait),
    value: typeof traitScores[trait] === "number" ? traitScores[trait] : 0,
    fullMark: 100,
  }));

  return (
    <div className="w-full min-h-[320px] sm:min-h-[380px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={320}>
        <RechartsRadarChart data={data} margin={{ top: 24, right: 32, bottom: 24, left: 32 }}>
          <defs>
            <linearGradient id="psychRadarStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="psychRadarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="#e5e7eb" strokeOpacity={0.35} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fill: "#4b5563", fontWeight: 500 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#9ca3af", fontSize: 9 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="url(#psychRadarStroke)"
            fill="url(#psychRadarFill)"
            strokeWidth={2}
            isAnimationActive
            animationDuration={1000}
            animationEasing="ease-out"
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
            }}
            formatter={(value) => [value ?? 0, "Score"]}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
