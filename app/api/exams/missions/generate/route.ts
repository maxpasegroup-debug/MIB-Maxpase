import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDailyMission } from "@/lib/generateDailyMission";

export const dynamic = "force-dynamic";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { examId, userId: bodyUserId } = body as { examId?: string; userId?: string };
    const userId = typeof bodyUserId === "string" && bodyUserId ? bodyUserId : "guest";

    if (!examId || typeof examId !== "string") {
      return NextResponse.json(
        { error: "Missing examId" },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const today = startOfToday();
    const existing = await prisma.dailyTrainingMission.findFirst({
      where: {
        userId,
        examId,
        createdAt: { gte: today },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      let missionData: { tasks: unknown[]; weakTopicNames: string[]; generatedAt: string };
      try {
        missionData = JSON.parse(existing.missionData) as typeof missionData;
      } catch {
        missionData = { tasks: [], weakTopicNames: [], generatedAt: existing.createdAt.toISOString() };
      }
      return NextResponse.json({
        missionId: existing.id,
        completed: existing.completed,
        missionData,
      });
    }

    const missionData = await generateDailyMission(userId, examId);
    const mission = await prisma.dailyTrainingMission.create({
      data: {
        userId,
        examId,
        missionData: JSON.stringify(missionData),
      },
    });

    return NextResponse.json({
      missionId: mission.id,
      completed: false,
      missionData,
    });
  } catch (e) {
    console.error("[POST /api/exams/missions/generate]", e);
    return NextResponse.json(
      { error: "Failed to generate mission" },
      { status: 500 }
    );
  }
}
