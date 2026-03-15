/**
 * Behavioral Gap Analysis — compare current vs potential scores per dimension.
 * Returns dimensions sorted by gap descending (biggest growth opportunity first).
 */

import type { Career10DScores } from "./careerDimensions";
import type { PotentialProfile } from "./careerPotential";
import { CAREER_10D_DIMENSIONS } from "./careerDimensions";

export type GapItem = {
  dimension: string;
  gap: number;
};

const POTENTIAL_KEYS: Record<(typeof CAREER_10D_DIMENSIONS)[number], keyof PotentialProfile> = {
  creativity: "potentialCreativity",
  analytical: "potentialAnalytical",
  leadership: "potentialLeadership",
  social: "potentialSocial",
  technology: "potentialTechnology",
  entrepreneurial: "potentialEntrepreneurial",
  practical: "potentialPractical",
  learning: "potentialLearning",
  risk: "potentialRisk",
  purpose: "potentialPurpose",
};

export function calculateCareerGaps(
  currentScores: Career10DScores,
  potentialScores: PotentialProfile
): GapItem[] {
  const items: GapItem[] = CAREER_10D_DIMENSIONS.map((dim) => {
    const current = typeof currentScores[dim] === "number" ? currentScores[dim] : 0;
    const potential = potentialScores[POTENTIAL_KEYS[dim]] ?? current;
    const gap = Math.round((potential - current) * 10) / 10;
    return { dimension: dim, gap };
  });

  items.sort((a, b) => b.gap - a.gap);
  return items;
}
