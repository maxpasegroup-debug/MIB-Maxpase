/**
 * Result engine: trait score → interpretation for reports.
 * Re-exports and helpers for UI/API.
 */

import {
  TRAITS,
  TRAIT_LABELS,
  getTraitInterpretation,
  interpretAllScores,
  type TraitKey,
  type InterpretationBand,
} from "./traits";

export { TRAITS, TRAIT_LABELS, getTraitInterpretation, interpretAllScores };
export type { TraitKey, InterpretationBand };

/**
 * Human-readable summary for a single trait (for "Stress: Moderate (28)").
 */
export function formatTraitResult(trait: TraitKey, score: number): string {
  const band = getTraitInterpretation(trait, score);
  return `${TRAIT_LABELS[trait]}: ${band.label} (${score})`;
}
