/**
 * Career Fit Probability Engine — probability scores for career clusters.
 * Combines 10D dimensions into cluster scores, then normalizes to 0–100.
 */

import type { Career10DScores } from "./careerDimensions";

export type CareerProbabilityItem = {
  career: string;
  probability: number;
};

const CLUSTER_DEFINITIONS: { career: string; dimensions: (keyof Career10DScores)[] }[] = [
  { career: "Technology Engineer", dimensions: ["technology", "analytical", "learning"] },
  { career: "Data Scientist", dimensions: ["analytical", "technology", "learning"] },
  { career: "Entrepreneur", dimensions: ["leadership", "entrepreneurial", "risk"] },
  { career: "Creative Director", dimensions: ["creativity", "social", "leadership"] },
  { career: "Research Scientist", dimensions: ["analytical", "learning", "purpose"] },
  { career: "Social Impact Lead", dimensions: ["social", "purpose", "leadership"] },
  { career: "Business Strategist", dimensions: ["leadership", "entrepreneurial", "analytical"] },
  { career: "Product Manager", dimensions: ["technology", "leadership", "practical"] },
  { career: "Consultant", dimensions: ["analytical", "social", "leadership"] },
];

/** Normalize so max raw score maps to 100; others scale proportionally. */
function normalizeToPercentages(rawScores: { career: string; raw: number }[]): CareerProbabilityItem[] {
  const max = Math.max(...rawScores.map((r) => r.raw), 1);
  return rawScores.map(({ career, raw }) => ({
    career,
    probability: Math.round((raw / max) * 100),
  }));
}

export function generateCareerProbabilities(scores: Career10DScores): CareerProbabilityItem[] {
  const rawScores = CLUSTER_DEFINITIONS.map(({ career, dimensions }) => {
    let raw = 0;
    for (const d of dimensions) {
      if (d in scores && typeof scores[d as keyof Career10DScores] === "number") {
        raw += scores[d as keyof Career10DScores];
      }
    }
    return { career, raw };
  });

  const withProbability = normalizeToPercentages(rawScores);
  withProbability.sort((a, b) => b.probability - a.probability);
  return withProbability;
}
