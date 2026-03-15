import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";
import { calculateCareerScores, type CareerResponse } from "@/lib/careerScoring";
import { getCareerCluster } from "@/lib/careerClusterMapping";
import { generateCareerRoadmap } from "@/lib/careerRoadmap";
import { generateCareerAIReport } from "@/lib/careerAIReport";
import { generatePotentialProfile } from "@/lib/careerPotential";
import { calculateCareerGaps } from "@/lib/careerGapAnalysis";
import { calculateCareerIndex } from "@/lib/careerIndex";
import { generateCareerProbabilities } from "@/lib/careerProbability";
import { generateCareerIdentity } from "@/lib/careerIdentity";
import { CAREER_10D_DIMENSIONS, CAREER_10D_LABELS, type Career10DDimensionKey } from "@/lib/careerDimensions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userName,
      userEmail,
      responses,
    }: {
      sessionId?: string;
      userName?: string;
      userEmail?: string;
      responses?: Array<{ questionId: string; trait_measured: string; score: number }>;
    } = body;

    if (!sessionId || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: "Missing sessionId or responses" },
        { status: 400 }
      );
    }

    const session = await prisma.career10DSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const userSession = getUserSession(request);
    await prisma.career10DSession.update({
      where: { id: sessionId },
      data: {
        userId: userSession?.userId ?? null,
        userName: userName?.trim() || null,
        userEmail: userEmail?.trim() || null,
      },
    });

    const careerResponses: CareerResponse[] = responses.map((r) => ({
      questionId: r.questionId,
      trait_measured: r.trait_measured,
      score: Math.min(5, Math.max(1, Number(r.score) || 1)),
    }));

    const scores = calculateCareerScores(careerResponses);
    const cluster = getCareerCluster(scores);

    let aiReport = "";
    try {
      aiReport = await generateCareerAIReport(scores, cluster);
    } catch (e) {
      console.error("[career-10d/complete] AI report failed", e);
      aiReport = `Your primary career cluster is **${cluster}**. Strengths and suggested paths can be explored with a counsellor.`;
    }

    const potentialProfile = generatePotentialProfile(scores);
    const gapAnalysis = calculateCareerGaps(scores, potentialProfile);
    const careerIndex = calculateCareerIndex(scores);
    const probabilities = generateCareerProbabilities(scores);

    const topDimension = (CAREER_10D_DIMENSIONS as readonly Career10DDimensionKey[]).reduce(
      (a, b) => (scores[a] >= scores[b] ? a : b)
    );
    const topStrength = CAREER_10D_LABELS[topDimension];
    const identity = generateCareerIdentity(scores);

    await prisma.career10DScore.create({
      data: {
        sessionId,
        creativity: scores.creativity,
        analytical: scores.analytical,
        leadership: scores.leadership,
        social: scores.social,
        technology: scores.technology,
        entrepreneurial: scores.entrepreneurial,
        practical: scores.practical,
        learning: scores.learning,
        risk: scores.risk,
        purpose: scores.purpose,
      },
    });

    await prisma.career10DReport.create({
      data: {
        sessionId,
        cluster,
        aiReport,
        potentialProfile: JSON.stringify(potentialProfile),
        gapAnalysis: JSON.stringify(gapAnalysis),
        careerIndex,
        probabilities: JSON.stringify(probabilities),
        reportLocked: true,
        identityName: identity.archetype,
        identityDescription: identity.description,
      },
    });

    return NextResponse.json({
      success: true,
      reportUrl: `/whats-next/career-results/${sessionId}`,
      reportLocked: true,
      preview: {
        identityName: identity.archetype,
        identityDescription: identity.description,
        careerIndex: careerIndex ?? 0,
        primaryCluster: cluster,
        topStrength,
      },
    });
  } catch (e) {
    console.error("[POST /api/career-10d/complete]", e);
    return NextResponse.json(
      { error: "Failed to complete career assessment" },
      { status: 500 }
    );
  }
}
