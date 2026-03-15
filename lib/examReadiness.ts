import { prisma } from "@/lib/prisma";
import type { PerformanceMetrics } from "./examPerformance";

export interface ReadinessResult {
  readinessScore: number;
  predictedRank: string;
}

/**
 * Calculate readiness score and predicted rank; save to ExamReadiness.
 */
export function calculateReadiness(performance: PerformanceMetrics): ReadinessResult {
  const { accuracy, speed, consistency, weakTopics } = performance;
  const weakPenalty = Math.min(30, weakTopics.length * 5);
  const readinessScore = Math.round(
    accuracy * 0.35 + speed * 0.25 + consistency * 0.2 + (100 - weakPenalty) * 0.2
  );
  const clamped = Math.min(100, Math.max(0, readinessScore));

  let predictedRank: string;
  if (clamped >= 85) predictedRank = "Top 5%";
  else if (clamped >= 75) predictedRank = "Top 15%";
  else if (clamped >= 60) predictedRank = "Top 30%";
  else if (clamped >= 45) predictedRank = "Middle tier";
  else predictedRank = "Needs more practice";

  return {
    readinessScore: clamped,
    predictedRank,
  };
}

export async function saveExamReadiness(
  userId: string,
  examId: string,
  result: ReadinessResult
): Promise<void> {
  await prisma.examReadiness.create({
    data: {
      userId,
      examId,
      readinessScore: result.readinessScore,
      predictedRank: result.predictedRank,
    },
  });
}
