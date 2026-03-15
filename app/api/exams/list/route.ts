import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.examCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        exams: {
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            description: true,
            difficulty: true,
            duration: true,
            totalQuestions: true,
          },
        },
      },
    });
    return NextResponse.json(
      categories.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        exams: c.exams,
      }))
    );
  } catch (e) {
    console.error("[GET /api/exams/list]", e);
    return NextResponse.json(
      { error: "Failed to load exams" },
      { status: 500 }
    );
  }
}
