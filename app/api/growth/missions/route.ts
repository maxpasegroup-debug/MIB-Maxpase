import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";

export async function GET(request: Request) {
  try {
    const session = getUserSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const missions = await prisma.growthMission.findMany({
      orderBy: { category: "asc", points: "asc" },
    });

    const completedIds = await prisma.userMission
      .findMany({
        where: { userId: session.userId, completed: true },
        select: { missionId: true },
      })
      .then((rows) => new Set(rows.map((r) => r.missionId)));

    const list = missions.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      category: m.category,
      points: m.points,
      completed: completedIds.has(m.id),
    }));

    return NextResponse.json(list);
  } catch (e) {
    console.error("[GET /api/growth/missions]", e);
    return NextResponse.json(
      { error: "Failed to load missions" },
      { status: 500 }
    );
  }
}
