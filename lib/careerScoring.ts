/**
 * MIB Career Intelligence 10D — scoring engine.
 * Aggregates responses by trait_measured, normalizes to 0–100, maps to 10 dimensions.
 */

import type { Career10DScores, Career10DDimensionKey } from "./careerDimensions";
import { CAREER_10D_DIMENSIONS } from "./careerDimensions";

export interface CareerResponse {
  questionId: string;
  trait_measured: string;
  score: number; // 1–4 (Never/Sometimes/Often/Always) or 1–5 for Likert
}

/** Map question trait_measured to 10D dimension. */
const TRAIT_TO_DIMENSION: Record<string, Career10DDimensionKey> = {
  motivation: "purpose",
  career_values: "purpose",
  career_direction: "purpose",
  career_identity: "learning",
  career_curiosity: "learning",
  career_planning: "practical",
  career_awareness: "analytical",
  career_growth: "learning",
  career_strategy: "analytical",
  career_vision: "creativity",
  career_fit: "practical",
  career_exploration: "learning",
  future_planning: "practical",
  professional_direction: "leadership",
  skills_alignment: "practical",
  professional_development: "learning",
  career_decision: "risk",
  future_orientation: "purpose",
  work_meaning: "purpose",
  logical_thinking: "analytical",
  pattern_understanding: "analytical",
  creativity: "creativity",
  leadership: "leadership",
  social: "social",
  technology: "technology",
  entrepreneurial: "entrepreneurial",
  practical: "practical",
  learning: "learning",
  risk: "risk",
  purpose: "purpose",
  analytical: "analytical",
};

function getDimensionForTrait(trait: string): Career10DDimensionKey {
  const key = trait.toLowerCase().replace(/\s+/g, "_");
  return TRAIT_TO_DIMENSION[key] ?? "purpose";
}

/**
 * Calculate 10D career scores from responses.
 * 1. Aggregate by trait_measured (sum per dimension).
 * 2. Normalize to 0–100 per dimension (scale 1–4 or 1–5 → 0–100).
 * 3. Return object with all 10 dimensions.
 */
export function calculateCareerScores(responses: CareerResponse[]): Career10DScores {
  const dimensionSums: Record<Career10DDimensionKey, { sum: number; count: number }> = {} as Record<
    Career10DDimensionKey,
    { sum: number; count: number }
  >;
  for (const d of CAREER_10D_DIMENSIONS) {
    dimensionSums[d] = { sum: 0, count: 0 };
  }

  for (const r of responses) {
    const dim = getDimensionForTrait(r.trait_measured);
    dimensionSums[dim].sum += r.score;
    dimensionSums[dim].count += 1;
  }

  const result: Career10DScores = {} as Career10DScores;
  for (const d of CAREER_10D_DIMENSIONS) {
    const { sum, count } = dimensionSums[d];
    // Assume 4-point scale (1–4); max per response = 4. Normalize to 0–100.
    const maxPossible = count * 4;
    result[d] =
      maxPossible > 0 ? Math.round(Math.min(100, (sum / maxPossible) * 100)) : 50;
  }

  return result;
}
