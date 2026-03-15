import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstituteSession } from "@/lib/instituteAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = await prisma.instituteStudent.findMany({
      where: { instituteId: session.instituteId },
      select: { id: true },
    });
    const studentIds = students.map((s) => s.id);

    const performances = await prisma.studentPerformance.findMany({
      where: { studentId: { in: studentIds } },
      orderBy: { readiness: "desc" },
      include: {
        student: { select: { id: true, name: true } },
        exam: { select: { name: true } },
      },
    });

    const byStudent = new Map<string, { name: string; readiness: number; examName: string }>();
    for (const p of performances) {
      const existing = byStudent.get(p.studentId);
      if (!existing || p.readiness > existing.readiness) {
        byStudent.set(p.studentId, {
          name: p.student.name,
          readiness: p.readiness,
          examName: p.exam.name,
        });
      }
    }

    const leaderboard = [...byStudent.entries()]
      .map(([studentId, data]) => ({ studentId, ...data }))
      .sort((a, b) => b.readiness - a.readiness)
      .slice(0, 50);

    return NextResponse.json(leaderboard);
  } catch (e) {
    console.error("[GET /api/institutes/leaderboard]", e);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
