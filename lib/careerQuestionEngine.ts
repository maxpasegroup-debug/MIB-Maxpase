/**
 * MIB Career Intelligence 10D — question selection from DB.
 * Queries questions where category = "career_intelligence", shuffles, returns 80.
 */

import { prisma } from "@/lib/prisma";

const CAREER_QUESTION_COUNT = 80;

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

  const shuffled = shuffle(questions);
  const selected = shuffled.slice(0, CAREER_QUESTION_COUNT);

  return selected.map((q) => ({
    id: q.id,
    question_text: q.questionText,
    trait_measured: q.traitMeasured,
  }));
}
