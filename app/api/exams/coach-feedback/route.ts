import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCoachFeedback } from "@/lib/examAICoach";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("examId");
    const userId = "guest";

    if (!examId) {
      return NextResponse.json(
        { error: "Missing examId" },
        { status: 400 }
      );
    }

    const [diagnostic, sessions, log] = await Promise.all([
      prisma.diagnosticTest.findMany({
        where: { userId, examId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.trainingSession.findMany({
        where: { userId, examId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.performanceLog.findFirst({
        where: { userId, examId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const accuracy = diagnostic.length
      ? diagnostic.reduce((a, t) => a + (t.accuracy ?? 0), 0) / diagnostic.length
      : sessions.length
        ? sessions.reduce((a, t) => a + (t.accuracy ?? 0), 0) / sessions.length
        : 50;
    const speed = log?.speed ?? 50;
    let weakTopics: string[] = [];
    try {
      if (log?.weakTopics) weakTopics = JSON.parse(log.weakTopics) as string[];
    } catch {}
    const readinessScore = log
      ? Math.round(accuracy * 0.4 + speed * 0.2 + log.consistency * 0.2 + (100 - weakTopics.length * 5) * 0.2)
      : 50;

    let weakTopicNames: string[] = [];
    if (weakTopics.length > 0) {
      const topics = await prisma.examTopic.findMany({
        where: { id: { in: weakTopics } },
        select: { name: true },
      });
      weakTopicNames = topics.map((t) => t.name);
    }

    const feedback = await generateCoachFeedback(
      { accuracy, speed, weakTopics, readinessScore, weakTopicNames },
      "strict"
    );

    return NextResponse.json({ feedback });
  } catch (e) {
    console.error("[GET /api/exams/coach-feedback]", e);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
