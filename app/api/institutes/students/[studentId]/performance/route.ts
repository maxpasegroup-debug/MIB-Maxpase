import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstituteSession } from "@/lib/instituteAuth";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = params.studentId;
    const student = await prisma.instituteStudent.findFirst({
      where: { id: studentId, instituteId: session.instituteId },
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { examId, readiness, accuracy, speed, weakTopics } = body as {
      examId?: string;
      readiness?: number;
      accuracy?: number;
      speed?: number;
      weakTopics?: string[];
    };

    if (!examId || typeof readiness !== "number" || typeof accuracy !== "number" || typeof speed !== "number") {
      return NextResponse.json(
        { error: "examId, readiness, accuracy, speed are required" },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const performance = await prisma.studentPerformance.create({
      data: {
        studentId,
        examId,
        readiness,
        accuracy,
        speed,
        weakTopics: JSON.stringify(Array.isArray(weakTopics) ? weakTopics : []),
      },
    });

    return NextResponse.json(performance);
  } catch (e) {
    console.error("[POST /api/institutes/students/[studentId]/performance]", e);
    return NextResponse.json(
      { error: "Failed to record performance" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = params.studentId;
    const student = await prisma.instituteStudent.findFirst({
      where: { id: studentId, instituteId: session.instituteId },
      include: {
        performance: {
          orderBy: { createdAt: "desc" },
          include: { exam: { select: { name: true } } },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const latest = student.performance[0];
    let weakTopics: string[] = [];
    if (latest?.weakTopics) {
      try {
        weakTopics = JSON.parse(latest.weakTopics) as string[];
      } catch {}
    }

    return NextResponse.json({
      studentId: student.id,
      name: student.name,
      email: student.email,
      readinessScore: latest?.readiness ?? null,
      accuracy: latest?.accuracy ?? null,
      speed: latest?.speed ?? null,
      weakTopics,
      examName: latest?.exam?.name ?? null,
      allPerformances: student.performance.map((p) => ({
        readiness: p.readiness,
        accuracy: p.accuracy,
        speed: p.speed,
        examName: p.exam?.name,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("[GET /api/institutes/students/[studentId]/performance]", e);
    return NextResponse.json(
      { error: "Failed to load performance" },
      { status: 500 }
    );
  }
}
