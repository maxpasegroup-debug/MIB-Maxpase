/**
 * Potential Profile Engine — projects 10D scores to potential using growth factor.
 * growthFactor depends on learning score: high learning → higher potential ceiling.
 */

import type { Career10DScores } from "./careerDimensions";
import { CAREER_10D_DIMENSIONS } from "./careerDimensions";

export type PotentialProfile = {
  potentialCreativity: number;
  potentialAnalytical: number;
  potentialLeadership: number;
  potentialSocial: number;
  potentialTechnology: number;
  potentialEntrepreneurial: number;
  potentialPractical: number;
  potentialLearning: number;
  potentialRisk: number;
  potentialPurpose: number;
};

function getGrowthFactor(learning: number): number {
  if (learning > 80) return 0.6;
  if (learning >= 60) return 0.45;
  return 0.3;
}

/**
 * potential = current + (100 - current) * growthFactor
 * Clamped to max 100.
 */
export function generatePotentialProfile(scores: Career10DScores): PotentialProfile {
  const learning = typeof scores.learning === "number" ? scores.learning : 0;
  const growthFactor = getGrowthFactor(learning);

  const out: PotentialProfile = {} as PotentialProfile;

  for (const dim of CAREER_10D_DIMENSIONS) {
    const current = typeof scores[dim] === "number" ? scores[dim] : 0;
    const potential = Math.min(100, current + (100 - current) * growthFactor);
    const key = `potential${dim.charAt(0).toUpperCase()}${dim.slice(1)}` as keyof PotentialProfile;
    out[key] = Math.round(potential * 10) / 10;
  }

  return out;
}
