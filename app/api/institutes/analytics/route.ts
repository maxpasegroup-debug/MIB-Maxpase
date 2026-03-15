import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstituteSession } from "@/lib/instituteAuth";
import { calculateInstituteStats } from "@/lib/instituteAnalytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const instituteId = session.instituteId;
    const stats = await calculateInstituteStats(instituteId);

    const students = await prisma.instituteStudent.findMany({
      where: { instituteId },
      select: { id: true },
    });
    const studentIds = students.map((s) => s.id);

    const performances = await prisma.studentPerformance.findMany({
      where: { studentId: { in: studentIds } },
      orderBy: { readiness: "desc" },
      take: 10,
      include: { student: { select: { id: true, name: true } } },
    });

    const topPerformers = performances.map((p) => ({
      studentId: p.studentId,
      studentName: p.student.name,
      readiness: p.readiness,
      accuracy: p.accuracy,
      examId: p.examId,
    }));

    return NextResponse.json({
      totalStudents: stats.totalStudents,
      activeTrainees: stats.activeTrainees,
      avgReadiness: stats.avgReadiness,
      topPerformers,
    });
  } catch (e) {
    console.error("[GET /api/institutes/analytics]", e);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
