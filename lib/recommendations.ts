import type { PrismaClient } from "@prisma/client";
import { TRAIT_LABELS, type TraitKey } from "./traits";

export const MAX_RECOMMENDATIONS = 3;

export interface RecommendedTest {
  title: string;
  categoryId: string;
  reason: string;
}

/**
 * Parse trigger_condition (e.g. ">65", "<40") and check if score matches.
 */
function matchesCondition(score: number, condition: string): boolean {
  const trimmed = condition.trim();
  const match = trimmed.match(/^(>=?|<=?)(\d+)$/);
  if (!match) return false;
  const op = match[1];
  const value = parseInt(match[2], 10);
  if (op === ">") return score > value;
  if (op === ">=") return score >= value;
  if (op === "<") return score < value;
  if (op === "<=") return score <= value;
  return false;
}

function reasonText(trait: string, condition: string, score: number): string {
  const label = trait in TRAIT_LABELS ? TRAIT_LABELS[trait as TraitKey] : trait;
  if (condition.startsWith(">")) return `High ${label.toLowerCase()} detected`;
  if (condition.startsWith("<")) return `Low ${label.toLowerCase()} score`;
  return `Based on your ${label.toLowerCase()} score`;
}

/**
 * Get recommended follow-up tests based on trait scores.
 * Uses test_recommendations table; returns up to MAX_RECOMMENDATIONS (3).
 */
export async function getRecommendedTests(
  prisma: PrismaClient,
  traitScores: Record<string, number> | null
): Promise<RecommendedTest[]> {
  if (!traitScores || typeof traitScores !== "object") return [];

  const rules = await prisma.testRecommendation.findMany({
    orderBy: { priority: "asc" },
    include: { recommendedCategory: true },
  });

  const out: RecommendedTest[] = [];
  for (const rule of rules) {
    if (out.length >= MAX_RECOMMENDATIONS) break;
    const score = traitScores[rule.triggerTrait];
    if (typeof score !== "number") continue;
    if (!matchesCondition(score, rule.triggerCondition)) continue;
    out.push({
      title: rule.recommendedCategory.name,
      categoryId: rule.recommendedCategoryId,
      reason: reasonText(rule.triggerTrait, rule.triggerCondition, score),
    });
  }
  return out;
}

/**
 * Built-in rules (used when DB has no rows or for fallback).
 * Same logic as DB: stress > 65, confidence < 40, etc.
 */
const BUILTIN_RULES: Array<{
  triggerTrait: TraitKey;
  condition: string;
  title: string;
  categoryId: string;
}> = [
  { triggerTrait: "stress", condition: ">65", title: "Stress & Anxiety Test", categoryId: "cat-stress" },
  { triggerTrait: "confidence", condition: "<40", title: "Self Confidence Test", categoryId: "cat-confidence" },
  { triggerTrait: "technology_behaviour", condition: ">70", title: "Digital Wellbeing Check", categoryId: "cat-stress" },
  { triggerTrait: "motivation", condition: "<45", title: "Motivation Assessment", categoryId: "cat-career" },
  { triggerTrait: "resilience", condition: "<45", title: "Resilience & Coping Test", categoryId: "cat-confidence" },
];

/**
 * Synchronous version using built-in rules only (no DB).
 * Use when Prisma is not available (e.g. edge) or as fallback.
 */
export function getRecommendedTestsFromRules(
  traitScores: Record<string, number> | null
): RecommendedTest[] {
  if (!traitScores || typeof traitScores !== "object") return [];

  const out: RecommendedTest[] = [];
  for (const rule of BUILTIN_RULES) {
    if (out.length >= MAX_RECOMMENDATIONS) break;
    const score = traitScores[rule.triggerTrait];
    if (typeof score !== "number") continue;
    if (!matchesCondition(score, rule.condition)) continue;
    out.push({
      title: rule.title,
      categoryId: rule.categoryId,
      reason: reasonText(rule.triggerTrait, rule.condition, score),
    });
  }
  return out;
}
