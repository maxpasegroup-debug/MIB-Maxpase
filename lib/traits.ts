/**
 * Question bank: trait tagging and result engine interpretation.
 * Every question tagged with: category, trait, age_group, test_type.
 */

// ---------------------------------------------------------------------------
// 1. Trait constants (Deep: 10 per trait = 100; Rapid: 3–4 per trait = 30–40)
// ---------------------------------------------------------------------------

export const TRAITS = [
  "stress",
  "confidence",
  "emotional_stability",
  "decision_making",
  "social_behaviour",
  "technology_behaviour",
  "motivation",
  "resilience",
  "self_awareness",
  "life_satisfaction",
] as const;

export type TraitKey = (typeof TRAITS)[number];

export const TRAIT_LABELS: Record<TraitKey, string> = {
  stress: "Stress",
  confidence: "Confidence",
  emotional_stability: "Emotional Stability",
  decision_making: "Decision Making",
  social_behaviour: "Social Behaviour",
  technology_behaviour: "Technology Behaviour",
  motivation: "Motivation",
  resilience: "Resilience",
  self_awareness: "Self Awareness",
  life_satisfaction: "Life Satisfaction",
};

// ---------------------------------------------------------------------------
// 2. Answer scale (4-point; stored in answers table)
// ---------------------------------------------------------------------------

export const ANSWER_SCALE = [
  { text: "Never", value: 1 },
  { text: "Sometimes", value: 2 },
  { text: "Often", value: 3 },
  { text: "Always", value: 4 },
] as const;

// ---------------------------------------------------------------------------
// 3. Result engine: trait score → interpretation bands
// ---------------------------------------------------------------------------
// Score 0–100 (from 1–4 scale: (avg - 1) / 3 * 100)
// Example: Stress 0–20 Low, 21–35 Moderate, 36–50 High, 51+ Very High

export type InterpretationLevel = "low" | "moderate" | "high" | "very_high";

export interface InterpretationBand {
  min: number;
  max: number;
  level: InterpretationLevel;
  label: string;
}

// Default bands (can be overridden per trait)
const DEFAULT_BANDS: InterpretationBand[] = [
  { min: 0, max: 20, level: "low", label: "Low" },
  { min: 21, max: 35, level: "moderate", label: "Moderate" },
  { min: 36, max: 50, level: "high", label: "High" },
  { min: 51, max: 100, level: "very_high", label: "Very High" },
];

// Stress: higher score = worse. Others: higher = better. Interpretation labels can be inverted per trait.
export const TRAIT_INTERPRETATION: Record<TraitKey, { bands: InterpretationBand[]; higherIsWorse?: boolean }> = {
  stress: {
    higherIsWorse: true,
    bands: [
      { min: 0, max: 20, level: "low", label: "Low" },
      { min: 21, max: 35, level: "moderate", label: "Moderate" },
      { min: 36, max: 50, level: "high", label: "High" },
      { min: 51, max: 100, level: "very_high", label: "Very High" },
    ],
  },
  confidence: { bands: DEFAULT_BANDS },
  emotional_stability: { bands: DEFAULT_BANDS },
  decision_making: { bands: DEFAULT_BANDS },
  social_behaviour: { bands: DEFAULT_BANDS },
  technology_behaviour: { higherIsWorse: true, bands: DEFAULT_BANDS },
  motivation: { bands: DEFAULT_BANDS },
  resilience: { bands: DEFAULT_BANDS },
  self_awareness: { bands: DEFAULT_BANDS },
  life_satisfaction: { bands: DEFAULT_BANDS },
};

/**
 * Get interpretation for a trait score (0–100).
 */
export function getTraitInterpretation(
  trait: TraitKey,
  score: number
): InterpretationBand & { higherIsWorse?: boolean } {
  const config = TRAIT_INTERPRETATION[trait];
  const band = config.bands.find((b) => score >= b.min && score <= b.max) ?? config.bands[config.bands.length - 1];
  return { ...band, higherIsWorse: config.higherIsWorse };
}

/**
 * Interpret all trait scores (e.g. for result report).
 */
export function interpretAllScores(scores: Partial<Record<TraitKey, number>>): Record<string, InterpretationBand & { higherIsWorse?: boolean }> {
  const out: Record<string, InterpretationBand & { higherIsWorse?: boolean }> = {};
  for (const trait of TRAITS) {
    const s = scores[trait];
    if (typeof s === "number") out[trait] = getTraitInterpretation(trait, s);
  }
  return out;
}
