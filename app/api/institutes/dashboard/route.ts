import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstituteSession } from "@/lib/instituteAuth";

export async function GET(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const institute = await prisma.institute.findUnique({
      where: { id: session.instituteId },
      include: {
        _count: {
          select: { students: true, tests: true },
        },
      },
    });
    if (!institute) {
      return NextResponse.json({ error: "Institute not found" }, { status: 404 });
    }

    const careerTestsCompleted = await prisma.instituteTest.count({
      where: { instituteId: institute.id, sessionId: { not: null } },
    });

    return NextResponse.json({
      instituteId: institute.id,
      name: institute.name,
      email: institute.email,
      totalStudents: institute._count.students,
      testsConducted: institute._count.tests,
      careerTests: careerTestsCompleted,
      psychometricTests: 0,
    });
  } catch (e) {
    console.error("[GET /api/institutes/dashboard]", e);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
