import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { completeSessionAndCreateResult } from "@/lib/results";

const REQUIRED_COUNT = {
  rapid: 35,
  deep: 100,
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId }: { sessionId?: string } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid sessionId" },
        { status: 400 }
      );
    }

    const session = await prisma.testSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.completedAt) {
      return NextResponse.json(
        { error: "Session already completed" },
        { status: 400 }
      );
    }

    const answerCount = await prisma.response.count({
      where: { sessionId },
    });

    const requiredCount =
      session.testType === "rapid"
        ? REQUIRED_COUNT.rapid
        : REQUIRED_COUNT.deep;

    if (answerCount < requiredCount) {
      return NextResponse.json(
        {
          error: `Not enough answers. Required ${requiredCount}, got ${answerCount}.`,
        },
        { status: 400 }
      );
    }

    const result = await completeSessionAndCreateResult(sessionId);

    return NextResponse.json({
      success: true,
      result: {
        id: result.id,
        sessionId: result.sessionId,
        stressScore: result.stressScore,
        confidenceScore: result.confidenceScore,
        emotionalScore: result.emotionalScore,
        traitScores: result.traitScores
          ? (JSON.parse(result.traitScores) as Record<string, number>)
          : null,
        aiAnalysis: result.aiAnalysis,
        psychologistNotes: result.psychologistNotes,
        reviewedByPsychologist: result.reviewedByPsychologist,
      },
    });
  } catch (e) {
    console.error("[POST /api/test/complete]", e);
    return NextResponse.json(
      { error: "Failed to complete test session" },
      { status: 500 }
    );
  }
}
