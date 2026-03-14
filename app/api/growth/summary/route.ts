import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";

function levelFromPoints(points: number): number {
  return Math.floor(points / 100) + 1;
}

export async function GET(request: Request) {
  try {
    const session = getUserSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const level = levelFromPoints(growth.points);
    const pointsInCurrentLevel = growth.points % 100;
    const progressToNextLevel = pointsInCurrentLevel / 100;

    return NextResponse.json({
      points: growth.points,
      level,
      streak: growth.streak,
      lastActive: growth.lastActive,
      progressToNextLevel,
      pointsInCurrentLevel,
      pointsToNextLevel: 100 - pointsInCurrentLevel,
    });
  } catch (e) {
    console.error("[GET /api/growth/summary]", e);
    return NextResponse.json(
      { error: "Failed to load growth summary" },
      { status: 500 }
    );
  }
}
