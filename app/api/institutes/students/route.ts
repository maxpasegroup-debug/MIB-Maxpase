import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstituteSession } from "@/lib/instituteAuth";

export async function GET(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = await prisma.instituteStudent.findMany({
      where: { instituteId: session.instituteId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (e) {
    console.error("[GET /api/institutes/students]", e);
    return NextResponse.json(
      { error: "Failed to load students" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { name, email, age }: { name?: string; email?: string; age?: number } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Student name is required" },
        { status: 400 }
      );
    }

    const student = await prisma.instituteStudent.create({
      data: {
        instituteId: session.instituteId,
        name: name.trim(),
        email: email?.trim() ?? null,
        age: age != null ? Number(age) : null,
      },
    });

    return NextResponse.json(student);
  } catch (e) {
    console.error("[POST /api/institutes/students]", e);
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}
