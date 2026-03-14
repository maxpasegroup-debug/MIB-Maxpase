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
import type { RoadmapStep } from "@/lib/careerRoadmap";

interface Career10DResultClientProps {
  traitScores: Record<string, number>;
  cluster: string;
  aiReport: string;
  roadmap: RoadmapStep[];
}

export default function Career10DResultClient({
  traitScores,
  cluster,
  aiReport,
  roadmap,
}: Career10DResultClientProps) {
  const radarData = CAREER_10D_DIMENSIONS.map((d) => ({
    subject: CAREER_10D_LABELS[d],
    value: typeof traitScores[d] === "number" ? traitScores[d] : 0,
    fullMark: 100,
  }));

  return (
    <div className="space-y-10">
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Your Career Intelligence Report
        </h1>
        <p className="mt-2 text-gray-600">
          AI-powered 10D career profile
        </p>
      </header>

      {/* 10D Radar */}
      <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5">10D Career Profile</h2>
        <div className="w-full min-h-[360px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={360}>
            <RechartsRadarChart data={radarData} margin={{ top: 24, right: 32, bottom: 24, left: 32 }}>
              <defs>
                <linearGradient id="career10dStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="career10dFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.15} />
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
                name="Score"
                dataKey="value"
                stroke="url(#career10dStroke)"
                fill="url(#career10dFill)"
                strokeWidth={2}
                isAnimationActive
                animationDuration={1000}
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
      </section>

      {/* Career cluster */}
      <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Primary Career Cluster</h2>
        <p className="text-xl font-semibold text-purple-600">{cluster}</p>
      </section>

      {/* AI report */}
      <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5">AI Career Report</h2>
        <div className="text-gray-700 leading-relaxed space-y-4 prose prose-sm max-w-none">
          {aiReport.split(/\n\n+/).map((paragraph, i) => (
            <p key={i} className="text-base leading-7">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Career Roadmap</h2>
        <ol className="space-y-3">
          {roadmap.map((step) => (
            <li key={step.step} className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold flex items-center justify-center text-sm">
                {step.step}
              </span>
              <div>
                <span className="font-medium text-gray-900">{step.title}</span>
                {step.description && (
                  <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="pt-4">
        <Link
          href="/career-intelligence"
          className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700"
        >
          Back to Career Intelligence
        </Link>
      </div>
    </div>
  );
}
