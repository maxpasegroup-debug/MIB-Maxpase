/**
 * MIB Career Intelligence 10D — dimension keys and labels.
 * Used by scoring, cluster mapping, and radar chart.
 */

export const CAREER_10D_DIMENSIONS = [
  "creativity",
  "analytical",
  "leadership",
  "social",
  "technology",
  "entrepreneurial",
  "practical",
  "learning",
  "risk",
  "purpose",
] as const;

export type Career10DDimensionKey = (typeof CAREER_10D_DIMENSIONS)[number];

export const CAREER_10D_LABELS: Record<Career10DDimensionKey, string> = {
  creativity: "Creativity",
  analytical: "Analytical",
  leadership: "Leadership",
  social: "Social",
  technology: "Technology",
  entrepreneurial: "Entrepreneurial",
  practical: "Practical",
  learning: "Learning",
  risk: "Risk Taking",
  purpose: "Purpose",
};

export type Career10DScores = Record<Career10DDimensionKey, number>;
