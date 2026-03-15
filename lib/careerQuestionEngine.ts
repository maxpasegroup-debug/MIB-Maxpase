/**
 * MIB Career Intelligence 10D — question selection from DB.
 * Loads questions where category = "career_intelligence", shuffles, returns exactly 80.
 * Balances by 10D dimension (8 per dimension when possible) using same trait→dimension mapping as scoring.
 */

import { prisma } from "@/lib/prisma";
import type { Career10DDimensionKey } from "@/lib/careerDimensions";
import { CAREER_10D_DIMENSIONS } from "@/lib/careerDimensions";

const CAREER_QUESTION_COUNT = 80;
const MIN_PER_DIMENSION = 8;

/** Map question trait_measured to 10D dimension (must match careerScoring). */
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
  const key = (trait || "").toLowerCase().replace(/\s+/g, "_");
  return TRAIT_TO_DIMENSION[key] ?? "purpose";
}

function shuffle<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface CareerQuestionItem {
  id: string;
  question_text: string;
  trait_measured: string;
}

/**
 * Select exactly 80 questions: 8 per dimension when possible, then fill from shuffled pool.
 */
export async function selectCareerQuestions(): Promise<CareerQuestionItem[]> {
  const category = await prisma.category.findFirst({
    where: { name: "career_intelligence" },
  });

  if (!category) {
    return [];
  }

  const questions = await prisma.question.findMany({
    where: { categoryId: category.id },
    select: {
      id: true,
      questionText: true,
      traitMeasured: true,
    },
  });

  const byDimension = new Map<Career10DDimensionKey, typeof questions>();
  for (const d of CAREER_10D_DIMENSIONS) {
    byDimension.set(d, []);
  }
  for (const q of questions) {
    const dim = getDimensionForTrait(q.traitMeasured);
    byDimension.get(dim)!.push(q);
  }

  const selected: typeof questions = [];
  const usedIds = new Set<string>();

  for (const dim of CAREER_10D_DIMENSIONS) {
    const pool = byDimension.get(dim) ?? [];
    const shuffled = shuffle([...pool]);
    let taken = 0;
    for (const q of shuffled) {
      if (taken >= MIN_PER_DIMENSION) break;
      if (usedIds.has(q.id)) continue;
      usedIds.add(q.id);
      selected.push(q);
      taken++;
    }
  }

  const remaining = questions.filter((q) => !usedIds.has(q.id));
  const shuffledRemaining = shuffle(remaining);
  for (const q of shuffledRemaining) {
    if (selected.length >= CAREER_QUESTION_COUNT) break;
    selected.push(q);
  }

  const final = shuffle(selected).slice(0, CAREER_QUESTION_COUNT);

  return final.map((q) => ({
    id: q.id,
    question_text: q.questionText,
    trait_measured: q.traitMeasured,
  }));
}
