import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let categoryCount = await prisma.examCategory.count();
    if (categoryCount === 0) {
      const { seedExamCoaching } = await import("../../../../prisma/seed-exam");
      await seedExamCoaching();
      categoryCount = await prisma.examCategory.count();
    }
    const categories = await prisma.examCategory.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        _count: { select: { exams: true } },
      },
    });
    return NextResponse.json(categories);
  } catch (e) {
    console.error("[GET /api/exams/categories]", e);
    return NextResponse.json(
      { error: "Failed to load exam categories" },
      { status: 500 }
    );
  }
}
