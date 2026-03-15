"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CAREER_10D_DIMENSIONS, CAREER_10D_LABELS } from "@/lib/careerDimensions";
import type { Career10DScores } from "@/lib/careerDimensions";
import type { PotentialProfile } from "@/lib/careerPotential";

const POTENTIAL_KEYS: Record<(typeof CAREER_10D_DIMENSIONS)[number], keyof PotentialProfile> = {
  creativity: "potentialCreativity",
  analytical: "potentialAnalytical",
  leadership: "potentialLeadership",
  social: "potentialSocial",
  technology: "potentialTechnology",
  entrepreneurial: "potentialEntrepreneurial",
  practical: "potentialPractical",
  learning: "potentialLearning",
  risk: "potentialRisk",
  purpose: "potentialPurpose",
};

interface CareerDualRadarProps {
  currentScores: Career10DScores | Record<string, number>;
  potentialProfile: PotentialProfile;
}

export default function CareerDualRadar({ currentScores, potentialProfile }: CareerDualRadarProps) {
  const data = CAREER_10D_DIMENSIONS.map((d) => ({
    subject: CAREER_10D_LABELS[d],
    current: typeof currentScores[d] === "number" ? currentScores[d] : 0,
    potential: potentialProfile[POTENTIAL_KEYS[d]] ?? 0,
    fullMark: 100,
  }));

  return (
    <div className="w-full min-h-[360px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={360}>
        <RechartsRadarChart data={data} margin={{ top: 24, right: 32, bottom: 24, left: 32 }}>
          <defs>
            <linearGradient id="dualRadarCurrentStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="dualRadarCurrentFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.15} />
            </linearGradient>
            <linearGradient id="dualRadarPotentialStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="dualRadarPotentialFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#0d9488" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="#e5e7eb" strokeOpacity={0.8} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fill: "#4b5563", fontWeight: 500 }}
            tickLine={false}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 9 }} />
          <Radar
            name="Current"
            dataKey="current"
            stroke="url(#dualRadarCurrentStroke)"
            fill="url(#dualRadarCurrentFill)"
            strokeWidth={2}
            isAnimationActive
            animationDuration={1000}
          />
          <Radar
            name="Potential"
            dataKey="potential"
            stroke="url(#dualRadarPotentialStroke)"
            fill="url(#dualRadarPotentialFill)"
            strokeWidth={2}
            strokeDasharray="4 2"
            isAnimationActive
            animationDuration={1000}
          />
          <Legend />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
