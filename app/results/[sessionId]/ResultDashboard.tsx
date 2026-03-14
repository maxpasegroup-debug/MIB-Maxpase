"use client";

import Link from "next/link";
import ScoreBar from "@/components/charts/ScoreBar";
import RadarChart from "@/components/charts/RadarChart";

const CORE_INDICATORS = [
  { label: "Stress", scoreKey: "stressScore" as const },
  { label: "Confidence", scoreKey: "confidenceScore" as const },
  { label: "Emotional Balance", scoreKey: "emotionalScore" as const },
] as const;

export interface ResultDashboardProps {
  stressScore: number;
  confidenceScore: number;
  emotionalScore: number;
  traitScores: Record<string, number> | null;
  aiAnalysis: string | null;
  sessionId?: string;
}

export default function ResultDashboard({
  stressScore,
  confidenceScore,
  emotionalScore,
  traitScores,
  aiAnalysis,
  sessionId,
}: ResultDashboardProps) {
  if (process.env.NODE_ENV === "development" && traitScores) {
    console.debug("[ResultDashboard] traitScores", traitScores);
  }

  const scores = {
    stressScore,
    confidenceScore,
    emotionalScore,
  };

  const defaultTraitScores: Record<string, number> = {
    stress: stressScore,
    confidence: confidenceScore,
    emotional_stability: emotionalScore,
    decision_making: 50,
    social_behaviour: 50,
    technology_behaviour: 50,
    motivation: 50,
    resilience: 50,
    self_awareness: 50,
    life_satisfaction: 50,
  };
  const radarData = traitScores && Object.keys(traitScores).length > 0
    ? { ...defaultTraitScores, ...traitScores }
    : defaultTraitScores;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <header className="text-center pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Your Psychological Profile
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          A personalized insight report based on your assessment.
        </p>
      </header>

      {/* Section 1 — Core Mental Health Indicators */}
      <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5">
          Core Mental Health Indicators
        </h2>
        <div className="space-y-6">
          {CORE_INDICATORS.map((item) => (
            <ScoreBar
              key={item.scoreKey}
              label={item.label}
              score={scores[item.scoreKey]}
            />
          ))}
        </div>
      </section>

      {/* Section 2 — Trait Radar Profile */}
      <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5">
          Trait Radar Profile
        </h2>
        <RadarChart traitScores={radarData} />
      </section>

      {/* Section 3 — AI Psychological Interpretation */}
      <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5">
          AI Psychological Interpretation
        </h2>
        {aiAnalysis ? (
          <div className="text-gray-700 leading-relaxed space-y-4">
            {aiAnalysis.split(/\n\n+/).map((paragraph, i) => (
              <p key={i} className="text-base sm:text-[15px] leading-7">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No AI interpretation available for this result yet.
          </p>
        )}
      </section>

      {/* Section 4 — Suggested Guidance */}
      <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Suggested Guidance
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
          Based on your profile, personalized guidance and counselling may help
          you improve emotional balance, career direction, and personal growth.
        </p>
        <Link
          href={sessionId ? `/guidance?sessionId=${encodeURIComponent(sessionId)}` : "/guidance"}
          className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-white font-medium shadow-md hover:bg-purple-700 transition-colors"
        >
          Get Professional Guidance
        </Link>
      </section>
    </div>
  );
}
