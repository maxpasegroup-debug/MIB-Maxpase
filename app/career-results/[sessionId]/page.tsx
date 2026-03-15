import { notFound } from "next/navigation";
import Link from "next/link";
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
import { CAREER_10D_DIMENSIONS, CAREER_10D_LABELS, type Career10DDimensionKey } from "@/lib/careerDimensions";
import { generateCareerIdentity } from "@/lib/careerIdentity";
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

  const reportLocked = session.report.reportLocked;
  const identity =
    session.report.identityName && session.report.identityDescription
      ? { archetype: session.report.identityName, description: session.report.identityDescription }
      : generateCareerIdentity(traitScores as import("@/lib/careerDimensions").Career10DScores);
  const topDimension = (CAREER_10D_DIMENSIONS as unknown as Career10DDimensionKey[]).reduce(
    (a, b) => ((traitScores[a] ?? 0) >= (traitScores[b] ?? 0) ? a : b)
  );
  const topStrengthLabel =
    topDimension === "learning" ? "Learning Agility" : CAREER_10D_LABELS[topDimension];
  const topStrengthScore = traitScores[topDimension] ?? 0;

  const psychologists = await prisma.psychologist.findMany({
    orderBy: { rating: "desc" },
    take: 3,
    select: {
      id: true,
      name: true,
      specialization: true,
      experienceYears: true,
    },
  });
  const experts = psychologists.map((p) => ({
    id: p.id,
    name: p.name,
    specialization: p.specialization,
    experience: p.experienceYears,
  }));

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
          sessionId={sessionId}
          traitScores={traitScores}
          cluster={session.report.cluster}
          aiReport={session.report.aiReport}
          roadmap={roadmap}
          potentialProfile={potentialProfile}
          gapAnalysis={gapAnalysis}
          careerIndex={careerIndex}
          probabilities={probabilities}
          reportLocked={reportLocked}
          identity={identity}
          preview={
            reportLocked
              ? {
                  careerIndex: careerIndex ?? 0,
                  primaryCluster: session.report.cluster,
                  topStrength: topStrengthLabel,
                  topStrengthScore,
                }
              : null
          }
          experts={experts}
        />
      </div>
    </main>
  );
}
