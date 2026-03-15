import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateCareerRoadmap } from "@/lib/careerRoadmap";
import type { CareerClusterName } from "@/lib/careerClusterMapping";
import { generatePotentialProfile } from "@/lib/careerPotential";
import { calculateCareerGaps } from "@/lib/careerGapAnalysis";
import { calculateCareerIndex } from "@/lib/careerIndex";
import { generateCareerProbabilities } from "@/lib/careerProbability";
import type { PotentialProfile } from "@/lib/careerPotential";
import type { GapItem } from "@/lib/careerGapAnalysis";
import type { CareerProbabilityItem } from "@/lib/careerProbability";
import { CAREER_10D_LABELS } from "@/lib/careerDimensions";
import CareerReportPrint from "./CareerReportPrint";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function CareerReportPrintPage({ params }: PageProps) {
  const { sessionId } = await params;

  const session = await prisma.career10DSession.findUnique({
    where: { id: sessionId },
    include: { scores: true, report: true },
  });

  if (!session || !session.scores || !session.report) {
    notFound();
  }

  if (session.report.reportLocked) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Report locked</h1>
          <p className="text-gray-600">
            Unlock your full report to download the PDF.
          </p>
          <a
            href={`/career-results/${sessionId}`}
            className="mt-6 inline-block text-purple-600 font-medium hover:underline"
          >
            Back to report
          </a>
        </div>
      </main>
    );
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

  const potentialProfile: PotentialProfile | null = session.report.potentialProfile
    ? (JSON.parse(session.report.potentialProfile) as PotentialProfile)
    : generatePotentialProfile(traitScores as import("@/lib/careerDimensions").Career10DScores);
  const gapAnalysis: GapItem[] = session.report.gapAnalysis
    ? (JSON.parse(session.report.gapAnalysis) as GapItem[])
    : potentialProfile
      ? calculateCareerGaps(traitScores as import("@/lib/careerDimensions").Career10DScores, potentialProfile)
      : [];
  const careerIndex: number | null =
    session.report.careerIndex ?? calculateCareerIndex(traitScores as import("@/lib/careerDimensions").Career10DScores);
  const probabilities: CareerProbabilityItem[] = session.report.probabilities
    ? (JSON.parse(session.report.probabilities) as CareerProbabilityItem[])
    : generateCareerProbabilities(traitScores as import("@/lib/careerDimensions").Career10DScores);
  const roadmap = generateCareerRoadmap(session.report.cluster as CareerClusterName);

  return (
    <CareerReportPrint
      traitScores={traitScores}
      cluster={session.report.cluster}
      aiReport={session.report.aiReport}
      roadmap={roadmap}
      potentialProfile={potentialProfile}
      gapAnalysis={gapAnalysis}
      careerIndex={careerIndex}
      probabilities={probabilities}
    />
  );
}
