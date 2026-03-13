/**
 * Result engine: compute trait scores from session responses and persist to results table.
 * Uses question bank: trait_measured, weight. 4-scale answers 1–4 → trait score 0–100.
 */
import { prisma } from "./prisma";
import { TRAITS, type TraitKey } from "./traits";

const STANDARD_TRAITS: TraitKey[] = [...TRAITS];

/**
 * Normalize raw average (1–4) to 0–100: (avg - 1) / 3 * 100
 */
function toHundred(avg: number): number {
  return Math.min(100, Math.max(0, Math.round(((avg - 1) / 3) * 100)));
}

/**
 * For reverse-scored questions (e.g. "I often doubt my abilities" → Always = low confidence).
 * Scale 1–4 becomes 4–1: effectiveScore = 5 - rawScore.
 */
function effectiveScore(rawScore: number, reverseScored: boolean): number {
  if (reverseScored) return 5 - rawScore;
  return rawScore;
}

/**
 * Compute weighted average per trait from responses.
 * Uses trait_measured, weight, and reverse_scored (psychometric reversal when needed).
 */
function scoresFromResponses(
  responses: {
    score: number;
    question: { traitMeasured: string; weight: number; reverseScored: boolean };
  }[]
): Record<TraitKey, number> {
  const byTrait: Record<string, { sum: number; weightSum: number }> = {};

  for (const r of responses) {
    const score = effectiveScore(r.score, r.question.reverseScored);
    const trait = r.question.traitMeasured.toLowerCase().replace(/\s+/g, "_") as TraitKey;
    const w = Math.max(1, r.question.weight);
    if (!byTrait[trait]) byTrait[trait] = { sum: 0, weightSum: 0 };
    byTrait[trait].sum += score * w;
    byTrait[trait].weightSum += w;
  }

  const out = {} as Record<TraitKey, number>;
  for (const t of STANDARD_TRAITS) {
    const data = byTrait[t];
    if (data && data.weightSum > 0) {
      const avg = data.sum / data.weightSum;
      out[t] = toHundred(avg);
    } else {
      out[t] = 50; // no data → neutral
    }
  }
  return out;
}

/**
 * Complete a session: set completed_at, compute all trait scores, create Result.
 * Returns the created Result (or existing one if already completed).
 */
export async function completeSessionAndCreateResult(sessionId: string, aiAnalysis?: string) {
  const session = await prisma.testSession.findUnique({
    where: { id: sessionId },
    include: {
      responses: { include: { question: true } },
      result: true,
    },
  });

  if (!session) throw new Error("Session not found");
  if (session.result) return session.result;

  const traitScores = scoresFromResponses(
    session.responses.map((r) => ({
      score: r.score,
      question: {
        traitMeasured: r.question.traitMeasured,
        weight: r.question.weight,
        reverseScored: r.question.reverseScored,
      },
    }))
  );

  // Backward compatibility: stress, confidence, emotional
  const stressScore = traitScores.stress ?? 50;
  const confidenceScore = traitScores.confidence ?? 50;
  const emotionalScore = traitScores.emotional_stability ?? 50;

  await prisma.testSession.update({
    where: { id: sessionId },
    data: {
      completedAt: new Date(),
      scoreSummary: JSON.stringify(traitScores),
    },
  });

  const result = await prisma.result.create({
    data: {
      sessionId,
      stressScore,
      confidenceScore,
      emotionalScore,
      traitScores: JSON.stringify(traitScores),
      aiAnalysis: aiAnalysis ?? null,
    },
  });

  return result;
}
