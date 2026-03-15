import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { generateCareerRoadmap } from "@/lib/careerRoadmap";
import type { CareerClusterName } from "@/lib/careerClusterMapping";
import Career10DResultClient from "./Career10DResultClient";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function CareerResultPage({ params }: PageProps) {
  const { sessionId } = await params;

  const session = await prisma.career10DSession.findUnique({
    where: { id: sessionId },
    include: {
      scores: true,
      report: true,
    },
  });

  if (!session || !session.scores || !session.report) {
    notFound();
  }

  const s = session.scores;
  const traitScores: Record<string, number> = {
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

  const roadmap = generateCareerRoadmap(session.report.cluster as CareerClusterName);

  return (
    <main className="min-h-screen bg-transparent">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <Link
          href="/career-intelligence"
          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 mb-8"
        >
          ← Back to Career Intelligence
        </Link>

        <Career10DResultClient
          traitScores={traitScores}
          cluster={session.report.cluster}
          aiReport={session.report.aiReport}
          roadmap={roadmap}
        />
      </div>
    </main>
  );
}
