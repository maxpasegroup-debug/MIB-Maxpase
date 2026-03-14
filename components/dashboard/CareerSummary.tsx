"use client";

import Link from "next/link";
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CAREER_10D_DIMENSIONS, CAREER_10D_LABELS } from "@/lib/careerDimensions";

interface CareerSummaryProps {
  cluster: string;
  traitScores: Record<string, number>;
  sessionId: string;
}

export default function CareerSummary({ cluster, traitScores, sessionId }: CareerSummaryProps) {
  const data = CAREER_10D_DIMENSIONS.map((d) => ({
    subject: CAREER_10D_LABELS[d],
    value: typeof traitScores[d] === "number" ? traitScores[d] : 0,
    fullMark: 100,
  }));

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Profile Summary</h3>
      <p className="text-sm text-purple-600 font-medium mb-4">Primary cluster: {cluster}</p>
      <div className="h-64 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#6b7280" }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#7c3aed"
              fill="#7c3aed"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip formatter={(value) => [value ?? 0, "Score"]} />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
      <Link
        href={`/career-results/${sessionId}`}
        className="inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
      >
        View Full Report
      </Link>
    </div>
  );
}
