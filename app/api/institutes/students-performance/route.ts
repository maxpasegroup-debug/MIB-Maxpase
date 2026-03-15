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
      include: {
        performance: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { exam: { select: { name: true } } },
        },
      },
      orderBy: { name: "asc" },
    });

    const allTopicIds = new Set<string>();
    const list = students.map((s) => {
      const latest = s.performance[0];
      let weakTopics: string[] = [];
      if (latest?.weakTopics) {
        try {
          weakTopics = JSON.parse(latest.weakTopics) as string[];
          weakTopics.forEach((id) => allTopicIds.add(id));
        } catch {}
      }
      return {
        studentId: s.id,
        name: s.name,
        email: s.email,
        readinessScore: latest?.readiness ?? null,
        accuracy: latest?.accuracy ?? null,
        speed: latest?.speed ?? null,
        weakTopics,
        examName: latest?.exam?.name ?? null,
      };
    });

    let topicNames: Map<string, string> = new Map();
    if (allTopicIds.size > 0) {
      const topics = await prisma.examTopic.findMany({
        where: { id: { in: Array.from(allTopicIds) } },
        select: { id: true, name: true },
      });
      topicNames = new Map(topics.map((t) => [t.id, t.name]));
    }

    const listWithNames = list.map((item) => ({
      ...item,
      weakTopics: item.weakTopics.map((id) => topicNames.get(id) ?? id),
    }));

    return NextResponse.json(listWithNames);
  } catch (e) {
    console.error("[GET /api/institutes/students-performance]", e);
    return NextResponse.json(
      { error: "Failed to load students performance" },
      { status: 500 }
    );
  }
}
