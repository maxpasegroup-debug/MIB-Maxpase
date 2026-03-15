import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export type SessionType =
  | "practice"
  | "mock_test"
  | "mock_exam"
  | "speed_drill"
  | "memory_training"
  | "logic_training";

const SESSION_QUESTION_COUNT: Record<SessionType, number> = {
  practice: 15,
  mock_test: 30,
  mock_exam: 100,
  speed_drill: 20,
  memory_training: 15,
  logic_training: 15,
};

export interface TrainingQuestion {
  id: string;
  questionText: string;
  difficulty: string | null;
  questionType: string;
  subjectId: string;
  topicId: string;
}

export interface GenerateTrainingSessionResult {
  sessionId: string;
  sessionType: SessionType;
  questions: TrainingQuestion[];
}

function weightedRandomIndex<T>(items: T[], weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return Math.floor(Math.random() * items.length);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i] ?? 0;
    if (r <= 0) return i;
  }
  return items.length - 1;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Generate a training session. Uses weighted random selection by topic, difficulty, and weak-topics priority.
 * mock_exam: 100 questions, mixed topics, timed session.
 */
export async function generateTrainingSession(
  userId: string,
  examId: string,
  sessionType: SessionType = "practice"
): Promise<GenerateTrainingSessionResult> {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: true },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  let weakTopicIds: string[] = [];
  const latestLog = await prisma.performanceLog.findFirst({
    where: { userId, examId },
    orderBy: { createdAt: "desc" },
  });
  if (latestLog?.weakTopics) {
    try {
      const parsed = JSON.parse(latestLog.weakTopics) as string[];
      if (Array.isArray(parsed)) weakTopicIds = parsed;
    } catch {
      // ignore
    }
  }

  const pool = exam.questions;
  const requestedCount = SESSION_QUESTION_COUNT[sessionType];
  const count = Math.min(requestedCount, pool.length);

  if (count === 0) {
    const sessionId = crypto.randomUUID();
    await prisma.trainingSession.create({
      data: { id: sessionId, userId, examId, sessionType },
    });
    return { sessionId, sessionType, questions: [] };
  }

  if (sessionType === "mock_exam") {
    const mixed = shuffle(pool).slice(0, count);
    const questions: TrainingQuestion[] = mixed.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      difficulty: q.difficulty,
      questionType: q.questionType,
      subjectId: q.subjectId,
      topicId: q.topicId,
    }));
    const sessionId = crypto.randomUUID();
    await prisma.trainingSession.create({
      data: { id: sessionId, userId, examId, sessionType },
    });
    return { sessionId, sessionType, questions };
  }

  const fromWeak = weakTopicIds.length
    ? pool.filter((q) => weakTopicIds.includes(q.topicId))
    : [];
  const rest = weakTopicIds.length
    ? pool.filter((q) => !weakTopicIds.includes(q.topicId))
    : pool;

  const weakWeight = 2.0;
  const weakCount = Math.min(Math.ceil(count * 0.6), fromWeak.length);
  const restCount = count - weakCount;

  const selectWeighted = (arr: typeof pool, n: number, preferWeak: boolean): typeof pool => {
    if (arr.length === 0) return [];
    if (n >= arr.length) return shuffle(arr);
    const weights = arr.map((q) => {
      const weakBoost = preferWeak && weakTopicIds.includes(q.topicId) ? weakWeight : 1;
      const diffWeight = q.difficulty === "hard" ? 1.2 : q.difficulty === "medium" ? 1.1 : 1;
      return weakBoost * diffWeight;
    });
    const selected: typeof pool = [];
    const remaining = [...arr];
    const remainingWeights = [...weights];
    for (let i = 0; i < n && remaining.length > 0; i++) {
      const idx = weightedRandomIndex(remaining, remainingWeights);
      selected.push(remaining[idx]!);
      remaining.splice(idx, 1);
      remainingWeights.splice(idx, 1);
    }
    return shuffle(selected);
  };

  const weakSelected = selectWeighted(fromWeak, weakCount, true);
  const restSelected = selectWeighted(rest, restCount, false);
  const selected = shuffle([...weakSelected, ...restSelected]);

  const questions: TrainingQuestion[] = selected.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    difficulty: q.difficulty,
    questionType: q.questionType,
    subjectId: q.subjectId,
    topicId: q.topicId,
  }));

  const sessionId = crypto.randomUUID();
  await prisma.trainingSession.create({
    data: { id: sessionId, userId, examId, sessionType },
  });

  return {
    sessionId,
    sessionType,
    questions,
  };
}
