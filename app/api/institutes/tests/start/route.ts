import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstituteSession } from "@/lib/instituteAuth";

export async function POST(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { studentId }: { studentId?: string } = body;
    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    const student = await prisma.instituteStudent.findFirst({
      where: { id: studentId, instituteId: session.instituteId },
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const test = await prisma.instituteTest.create({
      data: {
        instituteId: session.instituteId,
        studentId: student.id,
      },
    });

    const path = `/career-intelligence/start?instituteTestId=${test.id}`;

    return NextResponse.json({
      instituteTestId: test.id,
      path,
    });
  } catch (e) {
    console.error("[POST /api/institutes/tests/start]", e);
    return NextResponse.json(
      { error: "Failed to start test" },
      { status: 500 }
    );
  }
}
