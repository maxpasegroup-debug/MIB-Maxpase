import { prisma } from "@/lib/prisma";

export interface TopicMasteryItem {
  topicName: string;
  avgScore: number;
  studentCount: number;
}

export interface ClassPerformanceResult {
  topicMastery: TopicMasteryItem[];
  weakSubjects: string[];
  averageAccuracy: number;
  averageSpeed: number;
  accuracyDistribution: { range: string; count: number }[];
}

/**
 * Analyze class performance: topic mastery, weak subjects, average accuracy/speed,
 * and accuracy distribution.
 */
export async function analyzeClassPerformance(
  instituteId: string
): Promise<ClassPerformanceResult> {
  const students = await prisma.instituteStudent.findMany({
    where: { instituteId },
    select: { id: true },
  });
  const studentIds = students.map((s) => s.id);

  if (studentIds.length === 0) {
    return {
      topicMastery: [],
      weakSubjects: [],
      averageAccuracy: 0,
      averageSpeed: 0,
      accuracyDistribution: [
        { range: "0-40", count: 0 },
        { range: "41-60", count: 0 },
        { range: "61-80", count: 0 },
        { range: "81-100", count: 0 },
      ],
    };
  }

  const performances = await prisma.studentPerformance.findMany({
    where: { studentId: { in: studentIds } },
  });

  let accSum = 0;
  let speedSum = 0;
  const weakTopicCount: Record<string, number> = {};
  const accuracyBuckets = [0, 0, 0, 0]; // 0-40, 41-60, 61-80, 81-100

  for (const p of performances) {
    accSum += p.accuracy;
    speedSum += p.speed;
    if (p.accuracy < 41) accuracyBuckets[0]++;
    else if (p.accuracy < 61) accuracyBuckets[1]++;
    else if (p.accuracy < 81) accuracyBuckets[2]++;
    else accuracyBuckets[3]++;
    try {
      const topics = JSON.parse(p.weakTopics) as string[];
      for (const t of topics) {
        weakTopicCount[t] = (weakTopicCount[t] ?? 0) + 1;
      }
    } catch {
      // ignore
    }
  }

  const n = performances.length;
  const averageAccuracy = n > 0 ? Math.round((accSum / n) * 10) / 10 : 0;
  const averageSpeed = n > 0 ? Math.round((speedSum / n) * 10) / 10 : 0;

  const weakSubjects = Object.entries(weakTopicCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);

  const topicIds = new Set<string>();
  for (const p of performances) {
    try {
      const topics = JSON.parse(p.weakTopics) as string[];
      topics.forEach((id) => topicIds.add(id));
    } catch {}
  }
  const topicMastery: TopicMasteryItem[] = [];
  if (topicIds.size > 0) {
    const topics = await prisma.examTopic.findMany({
      where: { id: { in: Array.from(topicIds) as string[] } },
      select: { id: true, name: true },
    });
    for (const t of topics) {
      const withTopic = performances.filter((p) => {
        try {
          const arr = JSON.parse(p.weakTopics) as string[];
          return arr.includes(t.id);
        } catch {
          return false;
        }
      });
      topicMastery.push({
        topicName: t.name,
        avgScore: 0,
        studentCount: withTopic.length,
      });
    }
  }

  return {
    topicMastery,
    weakSubjects,
    averageAccuracy,
    averageSpeed,
    accuracyDistribution: [
      { range: "0-40", count: accuracyBuckets[0] },
      { range: "41-60", count: accuracyBuckets[1] },
      { range: "61-80", count: accuracyBuckets[2] },
      { range: "81-100", count: accuracyBuckets[3] },
    ],
  };
}
