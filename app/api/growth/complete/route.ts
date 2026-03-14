import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";

function levelFromPoints(points: number): number {
  return Math.floor(points / 100) + 1;
}

export async function POST(request: Request) {
  try {
    const session = getUserSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { missionId }: { missionId?: string } = body;
    if (!missionId) {
      return NextResponse.json(
        { error: "missionId is required" },
        { status: 400 }
      );
    }

    const mission = await prisma.growthMission.findUnique({
      where: { id: missionId },
    });
    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    const existing = await prisma.userMission.findFirst({
      where: { userId: session.userId, missionId },
    });
    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Already completed",
        points: existing.completed ? mission.points : 0,
      });
    }

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

    let newStreak = growth.streak;
    if (!lastActive) {
      newStreak = 1;
    } else if (lastActive.getTime() === yesterday.getTime()) {
      newStreak = growth.streak + 1;
    } else if (lastActive.getTime() < yesterday.getTime()) {
      newStreak = 1;
    }
    // if lastActive is today, streak unchanged

    const newPoints = growth.points + mission.points;
    const newLevel = levelFromPoints(newPoints);

    await prisma.userMission.create({
      data: {
        userId: session.userId,
        missionId: mission.id,
        completed: true,
        completedAt: now,
      },
    });

    await prisma.userGrowth.update({
      where: { userId: session.userId },
      data: {
        points: newPoints,
        level: newLevel,
        streak: newStreak,
        lastActive: now,
      },
    });

    return NextResponse.json({
      success: true,
      pointsEarned: mission.points,
      totalPoints: newPoints,
      level: newLevel,
      streak: newStreak,
    });
  } catch (e) {
    console.error("[POST /api/growth/complete]", e);
    return NextResponse.json(
      { error: "Failed to complete mission" },
      { status: 500 }
    );
  }
}
