import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const DEFAULT_DIAGNOSTIC_QUESTION_COUNT = 20;

export interface DiagnosticQuestion {
  id: string;
  questionText: string;
  difficulty: string | null;
  questionType: string;
  subjectId: string;
  topicId: string;
}

export interface StartDiagnosticResult {
  sessionId: string;
  questions: DiagnosticQuestion[];
}

/**
 * Start a diagnostic test for an exam: load random questions and return session id + questions.
 */
export async function startDiagnosticTest(examId: string): Promise<StartDiagnosticResult> {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: true },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  const pool = exam.questions;
  const count = Math.min(DEFAULT_DIAGNOSTIC_QUESTION_COUNT, pool.length);

  if (count === 0) {
    return {
      sessionId: crypto.randomUUID(),
      questions: [],
    };
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  const questions: DiagnosticQuestion[] = selected.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    difficulty: q.difficulty,
    questionType: q.questionType,
    subjectId: q.subjectId,
    topicId: q.topicId,
  }));

  const sessionId = crypto.randomUUID();

  return {
    sessionId,
    questions,
  };
}
