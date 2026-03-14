/**
 * MIB Career Intelligence 10D — map dimension scores to career cluster.
 */

import type { Career10DScores } from "./careerDimensions";

export const CAREER_CLUSTERS = [
  "Technology & Engineering",
  "Creative & Communication",
  "Business & Entrepreneurship",
  "Research & Academia",
  "Social Impact Careers",
  "General Career Profile",
] as const;

export type CareerClusterName = (typeof CAREER_CLUSTERS)[number];

interface ClusterRule {
  name: CareerClusterName;
  condition: (s: Career10DScores) => boolean;
  scoreValue: (s: Career10DScores) => number;
}

const RULES: ClusterRule[] = [
  {
    name: "Technology & Engineering",
    condition: (s) => s.technology + s.analytical > 140,
    scoreValue: (s) => s.technology + s.analytical,
  },
  {
    name: "Creative & Communication",
    condition: (s) => s.creativity + s.social > 140,
    scoreValue: (s) => s.creativity + s.social,
  },
  {
    name: "Business & Entrepreneurship",
    condition: (s) => s.leadership + s.entrepreneurial > 140,
    scoreValue: (s) => s.leadership + s.entrepreneurial,
  },
  {
    name: "Research & Academia",
    condition: (s) => s.learning + s.analytical > 140,
    scoreValue: (s) => s.learning + s.analytical,
  },
  {
    name: "Social Impact Careers",
    condition: (s) => s.social + s.purpose > 140,
    scoreValue: (s) => s.social + s.purpose,
  },
];

/** Return best matching cluster for given 10D scores. */
export function getCareerCluster(scores: Career10DScores): CareerClusterName {
  let best: CareerClusterName = "General Career Profile";
  let bestScore = 0;

  for (const rule of RULES) {
    if (rule.condition(scores)) {
      const s = rule.scoreValue(scores);
      if (s > bestScore) {
        bestScore = s;
        best = rule.name;
      }
    }
  }

  return best;
}
