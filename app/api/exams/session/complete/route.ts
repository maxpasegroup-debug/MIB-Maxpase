import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePerformance } from "@/lib/examPerformance";
import { calculateReadiness, saveExamReadiness } from "@/lib/examReadiness";

export const dynamic = "force-dynamic";

const VALID_TRAINING_TYPES = ["practice", "mock_test", "mock_exam", "speed_drill", "memory_training", "logic_training"];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sessionId, examId, type, score, total, durationSec, userId = "guest" } = body as {
      sessionId?: string;
      examId?: string;
      type?: string;
      score?: number;
      total?: number;
      durationSec?: number;
      userId?: string;
    };

    if (!examId || !sessionId || typeof sessionId !== "string" || typeof examId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid sessionId or examId" },
        { status: 400 }
      );
    }

    const isDiagnostic = type === "diagnostic";
    const isTraining = VALID_TRAINING_TYPES.includes(type as string);

    if (!isDiagnostic && !isTraining) {
      return NextResponse.json(
        { error: "Invalid type: must be 'diagnostic' or a valid training session type" },
        { status: 400 }
      );
    }

    const totalQuestions = typeof total === "number" && total > 0 ? total : 0;
    const correctCount = typeof score === "number" && score >= 0 ? score : 0;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const durationStored = typeof durationSec === "number" && durationSec >= 0 ? durationSec : null;
    const speed = durationStored != null
      ? Math.min(100, Math.max(0, 100 - (durationStored / 120) * 20))
      : 50;

    if (isDiagnostic) {
      await prisma.diagnosticTest.create({
        data: {
          id: sessionId,
          userId,
          examId,
          score: totalQuestions > 0 ? correctCount : null,
          accuracy,
          speed,
        },
      });
    } else {
      const updated = await prisma.trainingSession.updateMany({
        where: { id: sessionId, examId, userId },
        data: {
          score: totalQuestions > 0 ? correctCount : null,
          accuracy,
          duration: durationStored,
        },
      });
      if (updated.count === 0) {
        return NextResponse.json(
          { error: "Training session not found or already completed" },
          { status: 404 }
        );
      }
    }

    const [diagnosticTests, trainingSessions] = await Promise.all([
      prisma.diagnosticTest.findMany({
        where: { userId, examId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.trainingSession.findMany({
        where: { userId, examId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const performance = await calculatePerformance({
      userId,
      examId,
      diagnosticTests: diagnosticTests.map((t) => ({ score: t.score, accuracy: t.accuracy })),
      trainingSessions: trainingSessions.map((t) => ({
        score: t.score,
        accuracy: t.accuracy,
        duration: t.duration,
      })),
      topicScores: {},
    });

    const readiness = calculateReadiness(performance);
    await saveExamReadiness(userId, examId, readiness);

    return NextResponse.json({
      success: true,
      accuracy: performance.accuracy,
      readinessScore: readiness.readinessScore,
      predictedRank: readiness.predictedRank,
    });
  } catch (e) {
    console.error("[POST /api/exams/session/complete]", e);
    return NextResponse.json(
      { error: "Failed to complete session" },
      { status: 500 }
    );
  }
}
