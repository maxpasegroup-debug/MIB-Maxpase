"use client";

import Link from "next/link";
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
import { CAREER_10D_DIMENSIONS, CAREER_10D_LABELS } from "@/lib/careerDimensions";
import type { RoadmapStep } from "@/lib/careerRoadmap";
import type { PotentialProfile } from "@/lib/careerPotential";
import type { GapItem } from "@/lib/careerGapAnalysis";
import type { CareerProbabilityItem } from "@/lib/careerProbability";
import type { CareerIdentity } from "@/lib/careerIdentity";
import type { ExpertSummary } from "@/components/career/ExpertInterpretationFunnel";
import CareerIndexGauge from "@/components/charts/CareerIndexGauge";
import CareerDualRadar from "@/components/charts/CareerDualRadar";
import GapAnalysisChart from "@/components/charts/GapAnalysisChart";
import CareerProbabilityChart from "@/components/charts/CareerProbabilityChart";
import ExpertInterpretationFunnel from "@/components/career/ExpertInterpretationFunnel";

const stagger = (i: number) => ({ duration: 0.5, delay: 0.1 + i * 0.1 });

interface FullCareerReportProps {
  sessionId: string;
  traitScores: Record<string, number>;
  cluster: string;
  aiReport: string;
  roadmap: RoadmapStep[];
  potentialProfile: PotentialProfile | null;
  gapAnalysis: GapItem[];
  careerIndex: number | null;
  probabilities: CareerProbabilityItem[];
  identity: CareerIdentity | null;
  experts: ExpertSummary[];
}

export default function FullCareerReport({
  sessionId,
  traitScores,
  cluster,
  aiReport,
  roadmap,
  potentialProfile,
  gapAnalysis,
  careerIndex,
  probabilities,
  identity,
  experts,
}: FullCareerReportProps) {
  const radarData = CAREER_10D_DIMENSIONS.map((d) => ({
    subject: CAREER_10D_LABELS[d],
    value: typeof traitScores[d] === "number" ? traitScores[d] : 0,
    fullMark: 100,
  }));

  const pathCards = roadmap.slice(0, 3);
  const pathLabels = ["Technology Path", "Creative Path", "Entrepreneur Path"];

  return (
    <div className="space-y-8">
      {/* 1 Executive Summary */}
      <motion.section
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(0)}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-5">Executive Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {identity && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Identity</p>
              <p className="font-semibold text-gray-900">{identity.archetype}</p>
            </div>
          )}
          {careerIndex != null && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Career Intelligence Index</p>
              <p className="font-semibold text-purple-600">{Math.round(careerIndex)} / 100</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 mb-1">Primary Career Cluster</p>
            <p className="font-semibold text-gray-900">{cluster}</p>
          </div>
        </div>
      </motion.section>

      {/* 2 Intelligence Radar */}
      <motion.section
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(1)}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-5">Intelligence Radar</h2>
        <div className="w-full min-h-[320px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={320}>
            <RechartsRadarChart data={radarData} margin={{ top: 24, right: 32, bottom: 24, left: 32 }}>
              <defs>
                <linearGradient id="fullRadarStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="fullRadarFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <PolarGrid stroke="#e5e7eb" strokeOpacity={0.8} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#4b5563", fontWeight: 500 }} tickLine={false} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 9 }} />
              <Radar name="Score" dataKey="value" stroke="url(#fullRadarStroke)" fill="url(#fullRadarFill)" strokeWidth={2} isAnimationActive animationDuration={1000} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)" }} formatter={(value) => [value ?? 0, "Score"]} />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* 3 Potential Profile */}
      {potentialProfile && (
        <motion.section
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(2)}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-5">Potential Profile</h2>
          <p className="text-sm text-gray-600 mb-4">Current vs Potential</p>
          <CareerDualRadar currentScores={traitScores} potentialProfile={potentialProfile} />
        </motion.section>
      )}

      {/* 4 Behavioral Gap Analysis */}
      {gapAnalysis.length > 0 && (
        <motion.section
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(3)}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-5">Behavioral Gap Analysis</h2>
          <GapAnalysisChart gaps={gapAnalysis} />
        </motion.section>
      )}

      {/* 5 Career Probability Model */}
      {probabilities.length > 0 && (
        <motion.section
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(4)}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-5">Career Probability Model</h2>
          <CareerProbabilityChart items={probabilities} topN={8} />
        </motion.section>
      )}

      {/* 6 Life Path Simulation */}
      <motion.section
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(5)}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-5">Life Path Simulation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pathLabels.map((label, i) => (
            <div key={label} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <span className="inline-flex w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm items-center justify-center mb-2">
                {i + 1}
              </span>
              <p className="font-medium text-gray-900">{label}</p>
              {pathCards[i]?.title && <p className="text-sm text-gray-600 mt-1">{pathCards[i].title}</p>}
            </div>
          ))}
        </div>
      </motion.section>

      {/* 7 Strategic AI Insight */}
      <motion.section
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(6)}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-5">Strategic AI Insight</h2>
        <div className="text-gray-700 leading-relaxed space-y-4 prose prose-sm max-w-none">
          {aiReport.split(/\n\n+/).map((paragraph, i) => (
            <p key={i} className="text-base leading-7">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </motion.section>

      {/* 8 Career Roadmap */}
      <motion.section
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(7)}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-2">Career Roadmap</h2>
        <p className="text-sm text-gray-500 mb-4">Discovery · Direction · Specialization · Leadership</p>
        <ol className="space-y-3">
          {roadmap.map((step) => (
            <li key={step.step} className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold flex items-center justify-center text-sm">
                {step.step}
              </span>
              <div>
                <span className="font-medium text-gray-900">{step.title}</span>
                {step.description && <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* 9 Expert Interpretation */}
      {experts.length > 0 && (
        <ExpertInterpretationFunnel sessionId={sessionId} experts={experts} />
      )}

      {/* Actions */}
      <div className="pt-4 flex flex-wrap gap-3">
        <a
          href={`/api/career-report/download?sessionId=${encodeURIComponent(sessionId)}`}
          download="MIB_Career_Intelligence_Report.pdf"
          className="inline-flex items-center justify-center rounded-xl bg-purple-600 text-white px-6 py-3 shadow-lg font-medium hover:bg-purple-700"
        >
          Download Intelligence Report
        </a>
        <Link
          href="/career-intelligence"
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50"
        >
          Back to Career Intelligence
        </Link>
      </div>
    </div>
  );
}
