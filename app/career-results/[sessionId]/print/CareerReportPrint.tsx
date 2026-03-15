"use client";

import { useEffect } from "react";
import type { PotentialProfile } from "@/lib/careerPotential";
import type { GapItem } from "@/lib/careerGapAnalysis";
import type { CareerProbabilityItem } from "@/lib/careerProbability";
import type { RoadmapStep } from "@/lib/careerRoadmap";
import { CAREER_10D_LABELS } from "@/lib/careerDimensions";

interface CareerReportPrintProps {
  traitScores: Record<string, number>;
  cluster: string;
  aiReport: string;
  roadmap: RoadmapStep[];
  potentialProfile: PotentialProfile | null;
  gapAnalysis: GapItem[];
  careerIndex: number | null;
  probabilities: CareerProbabilityItem[];
}

const POTENTIAL_KEYS = [
  "potentialCreativity",
  "potentialAnalytical",
  "potentialLeadership",
  "potentialSocial",
  "potentialTechnology",
  "potentialEntrepreneurial",
  "potentialPractical",
  "potentialLearning",
  "potentialRisk",
  "potentialPurpose",
] as const;

export default function CareerReportPrint({
  traitScores,
  cluster,
  aiReport,
  roadmap,
  potentialProfile,
  gapAnalysis,
  careerIndex,
  probabilities,
}: CareerReportPrintProps) {
  useEffect(() => {
    const t = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-white p-8 print:p-4 relative" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none print:block"
        style={{ opacity: 0.05, zIndex: 0 }}
        aria-hidden
      >
        <span
          className="text-gray-900 font-bold whitespace-nowrap"
          style={{ fontSize: 160, transform: "rotate(-30deg)" }}
        >
          MIB
        </span>
      </div>
      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        <header className="text-center border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Career Intelligence Report</h1>
          <p className="text-gray-600 text-sm mt-1">10D career profile – confidential</p>
        </header>

        {careerIndex != null && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Career Intelligence Index</h2>
            <p className="text-2xl font-semibold text-purple-600">{Math.round(careerIndex)} / 100</p>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Primary Career Cluster</h2>
          <p className="text-xl text-purple-600">{cluster}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">10D Scores</h2>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(traitScores).map(([dim, val]) => (
              <li key={dim} className="flex justify-between border-b border-gray-100 py-1">
                <span>{CAREER_10D_LABELS[dim as keyof typeof CAREER_10D_LABELS] ?? dim}</span>
                <span className="font-medium">{val}</span>
              </li>
            ))}
          </ul>
        </section>

        {potentialProfile && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Potential Profile</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {POTENTIAL_KEYS.map((key) => {
                const dim = key.replace("potential", "").toLowerCase();
                const label = dim.charAt(0).toUpperCase() + dim.slice(1);
                const val = (potentialProfile as Record<string, number>)[key];
                return (
                  <li key={key} className="flex justify-between border-b border-gray-100 py-1">
                    <span>{label}</span>
                    <span className="font-medium">{typeof val === "number" ? Math.round(val) : "-"}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {gapAnalysis.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Behavioral Gap (Top 5)</h2>
            <ul className="text-sm">
              {gapAnalysis.slice(0, 5).map(({ dimension, gap }) => (
                <li key={dimension} className="flex justify-between py-1 border-b border-gray-100">
                  <span>{CAREER_10D_LABELS[dimension as keyof typeof CAREER_10D_LABELS] ?? dimension}</span>
                  <span>+{gap}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {probabilities.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Career Fit (Top 5)</h2>
            <ul className="text-sm">
              {probabilities.slice(0, 5).map(({ career, probability }) => (
                <li key={career} className="flex justify-between py-1 border-b border-gray-100">
                  <span>{career}</span>
                  <span>{probability}%</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Strategic AI Interpretation</h2>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {aiReport}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Career Roadmap</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            {roadmap.map((step) => (
              <li key={step.step}>
                <span className="font-medium">{step.title}</span>
                {step.description && (
                  <span className="text-gray-600"> — {step.description}</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        <footer className="pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          Generated from MIB Career Intelligence. Save as PDF via your browser’s Print dialog.
        </footer>
      </div>
    </main>
  );
}
