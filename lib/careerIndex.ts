/**
 * Career Intelligence Index — single composite score from 10D dimensions.
 * Weighted formula, normalized to 0–100.
 */

import type { Career10DScores } from "./careerDimensions";

const WEIGHTS: Record<keyof Career10DScores, number> = {
  learning: 0.2,
  creativity: 0.15,
  analytical: 0.15,
  technology: 0.15,
  leadership: 0.1,
  social: 0.1,
  entrepreneurial: 0.1,
  practical: 0.05,
  risk: 0,
  purpose: 0,
};

const SUM_WEIGHTS = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

/**
 * CI = weighted sum of dimensions, then normalized to 0–100.
 */
export function calculateCareerIndex(scores: Career10DScores): number {
  let weighted = 0;
  for (const [dim, w] of Object.entries(WEIGHTS)) {
    const v = typeof scores[dim as keyof Career10DScores] === "number"
      ? scores[dim as keyof Career10DScores]
      : 0;
    weighted += v * w;
  }
  const normalized = SUM_WEIGHTS > 0 ? weighted / SUM_WEIGHTS : 0;
  return Math.min(100, Math.max(0, Math.round(normalized * 10) / 10));
}
