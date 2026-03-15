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

const LIFE_PATH_LABELS = ["Technology Path", "Creative Path", "Entrepreneur Path"];

interface ReportDepthPreviewProps {
  traitScores: Record<string, number>;
  potentialProfile: PotentialProfile | null;
  probabilities: CareerProbabilityItem[];
  roadmap: RoadmapStep[];
}

export default function ReportDepthPreview({
  traitScores,
  potentialProfile,
  probabilities,
  roadmap,
}: ReportDepthPreviewProps) {
  const radarData = CAREER_10D_DIMENSIONS.map((d) => ({
    subject: CAREER_10D_LABELS[d],
    value: typeof traitScores[d] === "number" ? traitScores[d] : 0,
    fullMark: 100,
  }));

  const top3Probabilities = probabilities.slice(0, 3).map(({ career, probability }) => ({
    career: career || "Career",
    probability: Math.round(probability),
  }));

  const probabilityData =
    top3Probabilities.length >= 3
      ? top3Probabilities
      : [
          { career: "AI Engineer", probability: 0 },
          { career: "Product Designer", probability: 0 },
          { career: "Entrepreneur", probability: 0 },
        ].map((d, i) => top3Probabilities[i] || d);

  return (
    <section className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Inside Your Career Intelligence Report
      </h2>

      {/* Preview 1: 10D Intelligence Radar */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-600 mb-3">10D Intelligence Radar</p>
        <div className={`relative rounded-lg overflow-hidden ${PREVIEW_STYLE}`}>
          <div className="w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <RechartsRadarChart data={radarData} margin={{ top: 24, right: 32, bottom: 24, left: 32 }}>
                <PolarGrid stroke="#e5e7eb" strokeOpacity={0.8} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#4b5563" }} tickLine={false} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 9 }} />
                <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} strokeWidth={2} />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Preview 2: Potential Profile Radar */}
      {potentialProfile && (
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-600 mb-3">Potential Profile Radar</p>
          <div className={`relative rounded-lg overflow-hidden ${PREVIEW_STYLE}`}>
            <div className="w-full min-h-[280px]">
              <CareerDualRadar currentScores={traitScores} potentialProfile={potentialProfile} />
            </div>
          </div>
        </div>
      )}

      {/* Preview 3: Career Probability Model */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-600 mb-3">Career Probability Model</p>
        <div className={`relative rounded-lg overflow-hidden ${PREVIEW_STYLE}`}>
          <div className="w-full min-h-[140px]">
            <BarResponsiveContainer width="100%" height="100%" minHeight={140}>
              <BarChart data={probabilityData} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 110 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="career" width={106} tick={{ fontSize: 10, fill: "#374151" }} tickLine={false} />
                <Bar dataKey="probability" fill="#7c3aed" radius={[0, 4, 4, 0]} />
              </BarChart>
            </BarResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Preview 4: Life Path Simulation */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-3">Life Path Simulation</p>
        <div className={`relative rounded-lg overflow-hidden ${PREVIEW_STYLE}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LIFE_PATH_LABELS.map((label, i) => (
              <div key={label} className="p-4 rounded-lg border border-gray-200 bg-gray-50/80">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm mb-2">
                  {i + 1}
                </span>
                <p className="font-medium text-gray-900 text-sm">{label}</p>
                {roadmap[i]?.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{roadmap[i].description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
