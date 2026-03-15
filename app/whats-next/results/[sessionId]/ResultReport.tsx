"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import {
  TRAITS,
  TRAIT_LABELS,
  getTraitInterpretation,
  type TraitKey,
} from "@/lib/traits";
import type { RecommendedTest } from "@/lib/recommendations";
import { MOCK_PSYCHOLOGISTS } from "@/lib/mock-psychologists";

// Score color bands: 0–30 green, 31–60 yellow, 61–80 orange, 81–100 red (visually intuitive)
function getScoreBarColor(score: number, higherIsBetter: boolean): string {
  const s = higherIsBetter ? 100 - score : score;
  if (s <= 30) return "bg-emerald-500";
  if (s <= 60) return "bg-yellow-500";
  if (s <= 80) return "bg-orange-500";
  return "bg-red-500";
}

const MAIN_SCORES = [
  {
    key: "stress" as const,
    label: "Stress",
    scoreKey: "stressScore" as const,
    higherIsBetter: false,
  },
  {
    key: "confidence" as const,
    label: "Confidence",
    scoreKey: "confidenceScore" as const,
    higherIsBetter: true,
  },
  {
    key: "emotional" as const,
    label: "Emotional Balance",
    scoreKey: "emotionalScore" as const,
    higherIsBetter: true,
  },
];

function radarPoint(angleDeg: number, radius: number, center = 50) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(rad),
    y: center - radius * Math.sin(rad),
  };
}

function radarPolygonPoints(scores: number[], maxRadius = 38, center = 50) {
  const n = scores.length;
  if (n === 0) return "";
  return scores
    .map((score, i) => {
      const angle = (360 / n) * i;
      const r = (score / 100) * maxRadius;
      const p = radarPoint(angle, r, center);
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

const RECOMMENDATION_ICONS: Record<string, string> = {
  "Stress & Anxiety": "🧠",
  "Self Confidence Test": "💪",
  "Confidence Issues": "💪",
  "Digital Wellbeing Check": "📱",
  "Motivation Assessment": "🎯",
  "Resilience & Coping Test": "🌱",
  "Career Confusion": "🎯",
};

interface ResultReportProps {
  sessionId: string;
  stressScore: number;
  confidenceScore: number;
  emotionalScore: number;
  traitScores: Record<string, number> | null;
  aiAnalysis: string | null;
  recommendations: RecommendedTest[];
}

export default function ResultReport({
  sessionId,
  stressScore,
  confidenceScore,
  emotionalScore,
  traitScores,
  aiAnalysis: initialAiAnalysis,
  recommendations = [],
}: ResultReportProps) {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(initialAiAnalysis);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateAnalysis = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/test/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setAiAnalysis(data.aiAnalysis);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setAiLoading(false);
    }
  };
  const scores = {
    stress: stressScore,
    confidence: confidenceScore,
    emotional_stability: emotionalScore,
  };

  const radarScores =
    traitScores && Object.keys(traitScores).length >= 3
      ? TRAITS.map((t) => traitScores[t] ?? 50)
      : [stressScore, confidenceScore, emotionalScore];
  const radarPoints = radarPolygonPoints(radarScores);
  const numAxes = radarScores.length;

  return (
    <div className="space-y-10">
      {/* Main scores: Stress, Confidence, Emotional Balance */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-2">Core scores</h2>
        <p className="text-xs text-gray-500 mb-6">
          Green = low concern · Yellow = moderate · Orange = high · Red = very high
        </p>
        <div className="space-y-6">
          {MAIN_SCORES.map((item, i) => {
            const value =
              item.scoreKey === "stressScore"
                ? stressScore
                : item.scoreKey === "confidenceScore"
                  ? confidenceScore
                  : emotionalScore;
            const interpretation = getTraitInterpretation(
              item.key === "emotional" ? "emotional_stability" : item.key,
              value
            );
            const barColor = getScoreBarColor(value, item.higherIsBetter);
            return (
              <div key={item.key}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {value}/100 · {interpretation.label}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Radar chart */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Trait profile</h2>
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 sm:w-80 sm:h-80">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{ transform: "rotate(0deg)" }}
            >
              {/* Grid: concentric circles */}
              {[20, 40, 60, 80].map((r) => (
                <circle
                  key={r}
                  cx="50"
                  cy="50"
                  r={r * 0.38}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
              ))}
              {/* Axes */}
              {radarScores.map((_, i) => {
                const angle = (360 / numAxes) * i - 90;
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 38 * Math.cos(rad);
                const y = 50 - 38 * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={x}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />
                );
              })}
              {/* Data polygon */}
              <motion.polygon
                points={radarPoints}
                fill="rgba(168, 85, 247, 0.25)"
                stroke="rgb(168, 85, 247)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </svg>
          </div>
          {/* Trait labels under radar — helps non-technical users */}
          <div className="mt-6 w-full max-w-xl">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Traits measured
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              {(numAxes === 10 ? TRAITS : (["stress", "confidence", "emotional_stability"] as const)).map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                    {TRAIT_LABELS[t]}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* AI interpretation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          AI interpretation
        </h2>
        {aiAnalysis ? (
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {aiAnalysis}
          </p>
        ) : (
          <>
            <p className="text-gray-500 mb-4">
              Get a personalized psychological interpretation based on your
              scores.
            </p>
            {aiError && (
              <p className="text-red-600 text-sm mb-3">{aiError}</p>
            )}
            <button
              type="button"
              onClick={handleGenerateAnalysis}
              disabled={aiLoading}
              className="rounded-full bg-purple-600 px-5 py-2.5 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiLoading ? "Generating…" : "Generate interpretation"}
            </button>
          </>
        )}
      </motion.section>

      {/* Recommended For You */}
      {recommendations.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recommended for you
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Based on your results, these tests may help you next.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((rec, i) => (
              <motion.div
                key={`${rec.categoryId}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-xl border border-gray-200 p-4 hover:border-purple-200 hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-2">
                  {RECOMMENDATION_ICONS[rec.title] ?? "📋"}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{rec.reason}</p>
                <Link
                  href={`/?category=${encodeURIComponent(rec.categoryId)}`}
                  className="inline-block rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Start test
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Recommended Guidance — when stress is high */}
      {stressScore > 70 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Recommended guidance
          </h2>
          <p className="text-gray-600 mb-6">
            Your stress level appears high. Talking with a professional
            psychologist may help.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_PSYCHOLOGISTS.slice(0, 3).map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08 }}
                className="rounded-xl border border-gray-200 p-4 hover:border-purple-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    {doc.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-gray-500">{doc.specialization}</p>
                  </div>
                </div>
                <p className="text-xs text-amber-600">⭐ {doc.rating}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  ₹{doc.consultationFee}
                </p>
                <Link
                  href={`/mobile/psychologist/${doc.id}`}
                  className="inline-block mt-3 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
                >
                  Book session
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Unlock full report + Retake Test */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-white font-semibold shadow-lg"
        >
          Unlock full report
        </motion.div>
        <Link href={WHATS_NEXT_BASE}>
          <motion.span
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block rounded-full border-2 border-gray-300 px-6 py-3 text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50"
          >
            Retake test
          </motion.span>
        </Link>
      </motion.section>
    </div>
  );
}
