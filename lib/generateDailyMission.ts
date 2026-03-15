import { prisma } from "@/lib/prisma";

export interface DailyMissionTask {
  type: "practice" | "reasoning" | "vocabulary";
  title: string;
  target: number;
  unit: string;
  focus?: string;
}

export interface DailyMissionData {
  tasks: DailyMissionTask[];
  weakTopicNames: string[];
  generatedAt: string; // ISO date
}

/**
 * Generate today's daily training mission from weak topics in PerformanceLog.
 * Returns: 20 practice questions, 10 reasoning puzzles, 10 vocabulary tasks.
 */
export async function generateDailyMission(
  userId: string,
  examId: string
): Promise<DailyMissionData> {
  const latestLog = await prisma.performanceLog.findFirst({
    where: { userId, examId },
    orderBy: { createdAt: "desc" },
  });

  let weakTopicNames: string[] = [];
  if (latestLog?.weakTopics) {
    try {
      const ids = JSON.parse(latestLog.weakTopics) as string[];
      if (ids.length > 0) {
        const topics = await prisma.examTopic.findMany({
          where: { id: { in: ids } },
          select: { name: true },
        });
        weakTopicNames = topics.map((t) => t.name);
      }
    } catch {
      // ignore
    }
  }

  const focusHint =
    weakTopicNames.length > 0
      ? ` Focus: ${weakTopicNames.slice(0, 3).join(", ")}.`
      : "";

  const tasks: DailyMissionTask[] = [
    {
      type: "practice",
      title: "Practice questions",
      target: 20,
      unit: "questions",
      focus: weakTopicNames.length > 0 ? weakTopicNames.join(", ") : undefined,
    },
    {
      type: "reasoning",
      title: "Reasoning puzzles",
      target: 10,
      unit: "puzzles",
    },
    {
      type: "vocabulary",
      title: "Vocabulary tasks",
      target: 10,
      unit: "tasks",
    },
  ];

  return {
    tasks,
    weakTopicNames,
    generatedAt: new Date().toISOString(),
  };
}
