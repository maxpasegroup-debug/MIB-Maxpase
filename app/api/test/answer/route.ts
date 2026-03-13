import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ANSWER_LABELS: Record<number, string> = {
  1: "Never",
  2: "Sometimes",
  3: "Often",
  4: "Always",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sessionId,
      questionId,
      selectedAnswer,
    }: {
      sessionId: string;
      questionId: string;
      selectedAnswer: number;
    } = body;

    if (!sessionId || !questionId || selectedAnswer == null) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, questionId, selectedAnswer" },
        { status: 400 }
      );
    }

    if (
      typeof selectedAnswer !== "number" ||
      selectedAnswer < 1 ||
      selectedAnswer > 4
    ) {
      return NextResponse.json(
        { error: "selectedAnswer must be between 1 and 4" },
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

    const selectedAnswerText =
      ANSWER_LABELS[selectedAnswer] ?? String(selectedAnswer);

    await prisma.response.upsert({
      where: {
        sessionId_questionId: { sessionId, questionId },
      },
      create: {
        sessionId,
        questionId,
        selectedAnswer: selectedAnswerText,
        score: selectedAnswer,
      },
      update: {
        selectedAnswer: selectedAnswerText,
        score: selectedAnswer,
      },
    });

    const totalAnswered = await prisma.response.count({
      where: { sessionId },
    });

    return NextResponse.json({
      success: true,
      answered: totalAnswered,
    });
  } catch (e) {
    console.error("[POST /api/test/answer]", e);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 }
    );
  }
}
