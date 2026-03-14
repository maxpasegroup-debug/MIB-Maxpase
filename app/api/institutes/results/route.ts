import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstituteSession } from "@/lib/instituteAuth";

export async function GET(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tests = await prisma.instituteTest.findMany({
      where: {
        instituteId: session.instituteId,
        sessionId: { not: null },
      },
      include: {
        student: true,
        session: { include: { report: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const results = tests.map((t) => ({
      id: t.id,
      studentName: t.student.name,
      studentEmail: t.student.email,
      cluster: t.session?.report?.cluster ?? "—",
      testDate: t.createdAt,
      sessionId: t.sessionId,
    }));

    return NextResponse.json(results);
  } catch (e) {
    console.error("[GET /api/institutes/results]", e);
    return NextResponse.json(
      { error: "Failed to load results" },
      { status: 500 }
    );
  }
}
