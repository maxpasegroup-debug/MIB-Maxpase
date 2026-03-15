import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";
import { generateCoachFeedback } from "@/lib/examAICoach";

export const dynamic = "force-dynamic";

const EXAM_MISSION_POINTS = 50;

function levelFromPoints(points: number): number {
  return Math.floor(points / 100) + 1;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { missionId } = body as { missionId?: string };
    if (!missionId || typeof missionId !== "string") {
      return NextResponse.json(
        { error: "missionId is required" },
        { status: 400 }
      );
    }

    const mission = await prisma.dailyTrainingMission.findUnique({
      where: { id: missionId },
    });
    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }
    if (mission.completed) {
      const session = getUserSession(request);
      let pointsEarned = 0;
      let totalPoints = 0;
      let streak = 0;
      if (session) {
        const g = await prisma.userGrowth.findUnique({
          where: { userId: session.userId },
        });
        if (g) {
          totalPoints = g.points;
          streak = g.streak;
        }
      }
      const feedback = await getCoachFeedbackForMission(mission.userId, mission.examId);
      return NextResponse.json({
        success: true,
        message: "Already completed",
        pointsEarned,
        totalPoints,
        streak,
        coachMessage: feedback,
      });
    }

    await prisma.dailyTrainingMission.update({
      where: { id: missionId },
      data: { completed: true },
    });

    const session = getUserSession(request);
    let pointsEarned = 0;
    let totalPoints = 0;
    let newStreak = 0;

    if (session) {
      let growth = await prisma.userGrowth.findUnique({
        where: { userId: session.userId },
      });
      if (!growth) {
        growth = await prisma.userGrowth.create({
          data: {
            userId: session.userId,
            points: 0,
            level: 1,
            streak: 0,
          },
        });
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastActive = growth.lastActive
        ? new Date(
            growth.lastActive.getFullYear(),
            growth.lastActive.getMonth(),
            growth.lastActive.getDate()
          )
        : null;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (!lastActive) {
        newStreak = 1;
      } else if (lastActive.getTime() === yesterday.getTime()) {
        newStreak = growth.streak + 1;
      } else if (lastActive.getTime() < yesterday.getTime()) {
        newStreak = 1;
      } else {
        newStreak = growth.streak;
      }

      pointsEarned = EXAM_MISSION_POINTS;
      totalPoints = growth.points + pointsEarned;
      const newLevel = levelFromPoints(totalPoints);

      await prisma.userGrowth.update({
        where: { userId: session.userId },
        data: {
          points: totalPoints,
          level: newLevel,
          streak: newStreak,
          lastActive: now,
        },
      });
    }

    const coachMessage = await getCoachFeedbackForMission(mission.userId, mission.examId);

    return NextResponse.json({
      success: true,
      pointsEarned,
      totalPoints,
      streak: newStreak,
      coachMessage,
    });
  } catch (e) {
    console.error("[POST /api/exams/missions/complete]", e);
    return NextResponse.json(
      { error: "Failed to complete mission" },
      { status: 500 }
    );
  }
}

async function getCoachFeedbackForMission(
  userId: string,
  examId: string
): Promise<string> {
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

  const accuracy =
    diagnostic.length > 0
      ? diagnostic.reduce((a, t) => a + (t.accuracy ?? 0), 0) / diagnostic.length
      : sessions.length > 0
        ? sessions.reduce((a, t) => a + (t.accuracy ?? 0), 0) / sessions.length
        : 70;
  const speed = log?.speed ?? 60;
  let weakTopics: string[] = [];
  try {
    if (log?.weakTopics) weakTopics = JSON.parse(log.weakTopics) as string[];
  } catch {}
  let weakTopicNames: string[] = [];
  if (weakTopics.length > 0) {
    const topics = await prisma.examTopic.findMany({
      where: { id: { in: weakTopics } },
      select: { name: true },
    });
    weakTopicNames = topics.map((t) => t.name);
  }
  const readinessScore = log
    ? Math.round(
        accuracy * 0.4 + speed * 0.2 + log.consistency * 0.2 + (100 - weakTopics.length * 5) * 0.2
      )
    : 72;

  return generateCoachFeedback(
    {
      accuracy,
      speed,
      weakTopics,
      readinessScore,
      weakTopicNames,
    },
    "motivational"
  ).then(
    (msg) =>
      `Excellent work today. Your reasoning accuracy improved.\n\n${msg}`
  );
}
