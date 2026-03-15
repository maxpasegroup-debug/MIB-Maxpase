import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { predictRank } from "@/lib/examRankPrediction";

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

    const [logs, readinessRecord] = await Promise.all([
      prisma.performanceLog.findMany({
        where: { userId, examId },
        orderBy: { createdAt: "asc" },
        select: {
          accuracy: true,
          speed: true,
          consistency: true,
          weakTopics: true,
          createdAt: true,
        },
      }),
      prisma.examReadiness.findFirst({
        where: { userId, examId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const logsFormatted = logs.map((l) => ({
      accuracy: l.accuracy,
      speed: l.speed,
      consistency: l.consistency,
      createdAt: l.createdAt.toISOString(),
    }));

    let weakTopicNames: string[] = [];
    const latestLog = logs[logs.length - 1];
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
      } catch {}
    }

    const readiness = readinessRecord
      ? {
          readinessScore: readinessRecord.readinessScore,
          predictedRank: readinessRecord.predictedRank,
        }
      : null;

    const latest = logs[logs.length - 1];
    const rankPrediction = readiness
      ? predictRank({
          accuracy: latest?.accuracy ?? 50,
          speed: latest?.speed ?? 50,
          consistency: latest?.consistency ?? 50,
          readinessScore: readiness.readinessScore,
        })
      : null;

    return NextResponse.json({
      logs: logsFormatted,
      readiness,
      weakTopicNames,
      rankPrediction: rankPrediction
        ? {
            rankRange: rankPrediction.rankRange,
            examClearProbability: rankPrediction.examClearProbability,
          }
        : null,
    });
  } catch (e) {
    console.error("[GET /api/exams/performance]", e);
    return NextResponse.json(
      { error: "Failed to load performance" },
      { status: 500 }
    );
  }
}
