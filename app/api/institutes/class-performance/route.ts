import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstituteSession } from "@/lib/instituteAuth";
import { analyzeClassPerformance } from "@/lib/classPerformance";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await analyzeClassPerformance(session.instituteId);
    const weakTopicIds = [...new Set(result.weakSubjects)];
    let weakSubjectNames = result.weakSubjects;
    if (weakTopicIds.length > 0) {
      const topics = await prisma.examTopic.findMany({
        where: { id: { in: weakTopicIds } },
        select: { id: true, name: true },
      });
      const idToName = new Map(topics.map((t) => [t.id, t.name]));
      weakSubjectNames = result.weakSubjects.map((id) => idToName.get(id) ?? id);
    }
    return NextResponse.json({
      ...result,
      weakSubjects: weakSubjectNames,
    });
  } catch (e) {
    console.error("[GET /api/institutes/class-performance]", e);
    return NextResponse.json(
      { error: "Failed to load class performance" },
      { status: 500 }
    );
  }
}
