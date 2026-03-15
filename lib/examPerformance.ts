import { prisma } from "@/lib/prisma";

export interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  topicMastery: Record<string, number>;
  weakTopics: string[];
  readinessScore: number;
}

export interface CalculatePerformanceInput {
  userId: string;
  examId: string;
  diagnosticTests?: { score: number | null; accuracy: number | null }[];
  trainingSessions?: { score: number | null; accuracy: number | null; duration: number | null }[];
  topicScores?: Record<string, { correct: number; total: number }>;
}

/**
 * Calculate performance metrics and store in PerformanceLog.
 */
export async function calculatePerformance(
  input: CalculatePerformanceInput
): Promise<PerformanceMetrics> {
  const { userId, examId, diagnosticTests = [], trainingSessions = [], topicScores = {} } = input;

  const allScores = [
    ...diagnosticTests.map((t) => t.accuracy ?? (t.score != null ? (t.score / 100) * 100 : 0)),
    ...trainingSessions.map((t) => t.accuracy ?? (t.score != null ? (t.score / 100) * 100 : 0)),
  ];
  const accuracy = allScores.length ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

  const durations = trainingSessions
    .map((t) => t.duration ?? 0)
    .filter((d) => d > 0);
  const avgDuration = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 60;
  const speed = Math.min(100, Math.max(0, 100 - (avgDuration / 120) * 20));
  // Speed: proxy for average response speed (higher = faster completion; 0–100 scale).

  const topicMastery: Record<string, number> = {};
  const weakTopics: string[] = [];
  for (const [topicId, data] of Object.entries(topicScores)) {
    const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    topicMastery[topicId] = pct;
    if (pct < 50) weakTopics.push(topicId);
  }

  const consistency =
    allScores.length > 1
      ? Math.max(0, 100 - Math.min(100, Math.abs((allScores[allScores.length - 1] ?? 0) - (allScores[0] ?? 0))))
      : 100;

  const readinessScore = Math.round(
    (accuracy * 0.4 + speed * 0.2 + consistency * 0.2 + (100 - weakTopics.length * 5) * 0.2)
  );

  await prisma.performanceLog.create({
    data: {
      userId,
      examId,
      accuracy,
      speed,
      consistency,
      weakTopics: JSON.stringify(weakTopics),
    },
  });

  return {
    accuracy,
    speed,
    consistency,
    topicMastery,
    weakTopics,
    readinessScore: Math.min(100, Math.max(0, readinessScore)),
  };
}
