import { prisma } from "@/lib/prisma";

const QUESTION_COUNT = {
  rapid: 35,
  deep: 100,
} as const;

const PER_TRAIT = {
  rapid: { min: 2, max: 4 },
  deep: { min: 8, max: 12 },
} as const;

export type AdaptiveQuestionInput = {
  categoryId: string;
  testType: "rapid" | "deep";
  ageGroup: string;
};

export type AdaptiveQuestionItem = {
  id: string;
  question_text: string;
  trait_measured: string;
  reverse_scored: boolean;
  weight: number;
};

export type AdaptiveQuestionResult = {
  questions: AdaptiveQuestionItem[];
};

/** Fisher-Yates shuffle */
function fisherYatesShuffle<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Select questions with trait diversity:
 * - Deep: 8–12 per trait, even distribution.
 * - Rapid: 2–4 per trait.
 * Picks randomly from each trait bucket until required count is reached.
 */
export async function selectAdaptiveQuestions(
  params: AdaptiveQuestionInput
): Promise<AdaptiveQuestionResult> {
  const { categoryId, testType, ageGroup } = params;
  const requiredCount = QUESTION_COUNT[testType];
  const { min: minPerTrait, max: maxPerTrait } = PER_TRAIT[testType];

  const rows = await prisma.question.findMany({
    where: {
      categoryId,
      testType,
      ageGroup,
    },
    select: {
      id: true,
      questionText: true,
      traitMeasured: true,
      reverseScored: true,
      weight: true,
      subArea: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    const traitCounts: Record<string, number> = {};
    for (const r of rows) {
      traitCounts[r.traitMeasured] = (traitCounts[r.traitMeasured] ?? 0) + 1;
    }
    console.debug("[adaptiveQuestionEngine] Total questions fetched:", rows.length);
    console.debug("[adaptiveQuestionEngine] Traits distribution:", traitCounts);
  }

  if (rows.length < requiredCount) {
    return {
      questions: rows.map((q) => ({
        id: q.id,
        question_text: q.questionText,
        trait_measured: q.traitMeasured,
        reverse_scored: q.reverseScored,
        weight: q.weight,
      })),
    };
  }

  const byTrait = new Map<string, typeof rows>();
  for (const q of rows) {
    const list = byTrait.get(q.traitMeasured) ?? [];
    list.push(q);
    byTrait.set(q.traitMeasured, list);
  }

  byTrait.forEach((list, trait) => {
    byTrait.set(trait, fisherYatesShuffle(list));
  });

  const traits = Array.from(byTrait.keys());
  const selected: (typeof rows)[number][] = [];
  const takenPerTrait = new Map<string, number>();
  traits.forEach((t) => takenPerTrait.set(t, 0));

  const takeFromTrait = (trait: string): (typeof rows)[number] | null => {
    const list = byTrait.get(trait)!;
    const taken = takenPerTrait.get(trait)!;
    if (taken >= list.length) return null;
    const q = list[taken];
    takenPerTrait.set(trait, taken + 1);
    return q;
  };

  const canTakeMore = (trait: string) => {
    const list = byTrait.get(trait)!;
    const taken = takenPerTrait.get(trait)!;
    return taken < list.length && taken < maxPerTrait;
  };

  for (const trait of traits) {
    const list = byTrait.get(trait)!;
    const n = Math.min(minPerTrait, list.length);
    for (let i = 0; i < n; i++) {
      const q = takeFromTrait(trait);
      if (q) selected.push(q);
    }
  }

  while (selected.length < requiredCount) {
    const candidates = traits.filter(canTakeMore);
    if (candidates.length === 0) break;
    const trait = candidates[Math.floor(Math.random() * candidates.length)];
    const q = takeFromTrait(trait);
    if (q) selected.push(q);
    else break;
  }

  const final = fisherYatesShuffle(selected).slice(0, requiredCount);

  if (process.env.NODE_ENV === "development") {
    const finalByTrait: Record<string, number> = {};
    for (const q of final) {
      finalByTrait[q.traitMeasured] = (finalByTrait[q.traitMeasured] ?? 0) + 1;
    }
    console.debug("[adaptiveQuestionEngine] Final questions returned:", final.length);
    console.debug("[adaptiveQuestionEngine] Final traits distribution:", finalByTrait);
  }

  return {
    questions: final.map((q) => ({
      id: q.id,
      question_text: q.questionText,
      trait_measured: q.traitMeasured,
      reverse_scored: q.reverseScored,
      weight: q.weight,
    })),
  };
}
