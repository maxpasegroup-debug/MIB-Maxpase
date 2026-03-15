"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer as BarResponsiveContainer } from "recharts";
import { CAREER_10D_DIMENSIONS, CAREER_10D_LABELS } from "@/lib/careerDimensions";
import type { PotentialProfile } from "@/lib/careerPotential";
import type { CareerProbabilityItem } from "@/lib/careerProbability";
import type { RoadmapStep } from "@/lib/careerRoadmap";
import CareerDualRadar from "@/components/charts/CareerDualRadar";

const PREVIEW_STYLE = "blur-sm opacity-70 select-none pointer-events-none";

interface ReportPreviewProps {
  traitScores: Record<string, number>;
  potentialProfile: PotentialProfile | null;
  probabilities: CareerProbabilityItem[];
  roadmap: RoadmapStep[];
}

export default function ReportPreview({
  traitScores,
  potentialProfile,
  probabilities,
  roadmap,
}: ReportPreviewProps) {
  const radarData = CAREER_10D_DIMENSIONS.map((d) => ({
    subject: CAREER_10D_LABELS[d],
    value: typeof traitScores[d] === "number" ? traitScores[d] : 0,
    fullMark: 100,
  }));

  const top3Probabilities = probabilities.slice(0, 3).map(({ career, probability }) => ({
    career,
    probability: Math.round(probability),
  }));

  const pathCards = roadmap.slice(0, 3);

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-purple-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Inside Your Career Intelligence Report
      </h2>

      {/* SECTION 2 — Preview radar chart */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-600 mb-3">10D Career Profile</p>
        <div className={`relative rounded-lg overflow-hidden ${PREVIEW_STYLE}`}>
          <div className="w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <RechartsRadarChart data={radarData} margin={{ top: 24, right: 32, bottom: 24, left: 32 }}>
                <PolarGrid stroke="#e5e7eb" strokeOpacity={0.8} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: "#4b5563" }}
                  tickLine={false}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 9 }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#7c3aed"
                  fill="#7c3aed"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3 — Preview potential profile (dual radar) */}
      {potentialProfile && (
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-600 mb-3">Current vs Potential Profile</p>
          <div className={`relative rounded-lg overflow-hidden ${PREVIEW_STYLE}`}>
            <div className="w-full min-h-[280px]">
              <CareerDualRadar currentScores={traitScores} potentialProfile={potentialProfile} />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4 — Preview career probabilities (3 horizontal bars) */}
      {top3Probabilities.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-600 mb-3">Career Fit Probability</p>
          <div className={`relative rounded-lg overflow-hidden ${PREVIEW_STYLE}`}>
            <div className="w-full min-h-[140px]">
              <BarResponsiveContainer width="100%" height="100%" minHeight={140}>
                <BarChart
                  data={top3Probabilities}
                  layout="vertical"
                  margin={{ top: 8, right: 24, bottom: 8, left: 100 }}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    type="category"
                    dataKey="career"
                    width={96}
                    tick={{ fontSize: 10, fill: "#374151" }}
                    tickLine={false}
                  />
                  <Bar dataKey="probability" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </BarResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5 — Preview life path simulation (3 career path cards) */}
      {pathCards.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-600 mb-3">Life Path Simulation</p>
          <div className={`relative rounded-lg overflow-hidden ${PREVIEW_STYLE}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pathCards.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50/80"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm mb-2">
                    {step.step}
                  </span>
                  <p className="font-medium text-gray-900 text-sm">{step.title}</p>
                  {step.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{step.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
