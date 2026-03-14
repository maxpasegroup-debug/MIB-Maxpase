import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";
import { generateCareerRoadmap } from "@/lib/careerRoadmap";
import type { CareerClusterName } from "@/lib/careerClusterMapping";

export async function GET(request: Request) {
  const session = getUserSession(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const latest = await prisma.career10DSession.findFirst({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: {
      scores: true,
      report: true,
    },
  });

  if (!latest?.scores || !latest?.report) {
    return NextResponse.json({
      user: { name: session.name, email: session.email, role: session.role },
      latestSession: null,
    });
  }

  const s = latest.scores;
  const traitScores = {
    creativity: s.creativity,
    analytical: s.analytical,
    leadership: s.leadership,
    social: s.social,
    technology: s.technology,
    entrepreneurial: s.entrepreneurial,
    practical: s.practical,
    learning: s.learning,
    risk: s.risk,
    purpose: s.purpose,
  };
  const roadmap = generateCareerRoadmap(latest.report.cluster as CareerClusterName);

  return NextResponse.json({
    user: { name: session.name, email: session.email, role: session.role },
    latestSession: {
      sessionId: latest.id,
      cluster: latest.report.cluster,
      traitScores,
      roadmap,
    },
  });
}
