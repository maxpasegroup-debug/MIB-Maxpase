/**
 * MIB Career Intelligence™ — Prisma integration
 * Creates career sessions, scores, recommendations, and reports.
 * Loads report data for the report page and APIs.
 */

import { prisma } from "@/lib/prisma";
import { getCareerClusters } from "@/lib/careerClusters";
import type { CareerIntelligenceScores } from "@/lib/career-intelligence";
import { DIMENSION_KEYS } from "@/lib/career-intelligence";

export interface CreateCareerSessionInput {
  userId?: string | null;
  name: string;
  age: number;
  education?: string | null;
  scores: CareerIntelligenceScores;
  aiSummary?: string | null;
}

export interface CareerReportData {
  session: {
    id: string;
    name: string;
    age: number;
    education: string | null;
    createdAt: Date;
  };
  scores: CareerIntelligenceScores;
  clusters: Array<{
    id: string;
    name: string;
    description: string;
    exampleRoles: string[];
    growthOutlook: string;
    rank: number;
  }>;
  report: {
    aiSummary: string | null;
    primaryCluster: string | null;
    createdAt: Date;
  } | null;
  roadmaps: Array<{
    clusterId: string;
    clusterName: string;
    steps: Array<{ step: number; title: string; description: string; skills: string[] }>;
  }>;
}

/** Create a career session with 10D scores, run cluster engine, save recommendations and report. */
export async function createCareerSessionWithResult(
  input: CreateCareerSessionInput
): Promise<{ sessionId: string; reportId: string }> {
  const { userId, name, age, education, scores, aiSummary } = input;

  const session = await prisma.careerSession.create({
    data: {
      userId: userId ?? undefined,
      name,
      age,
      education: education ?? undefined,
    },
  });

  for (const dim of DIMENSION_KEYS) {
    const value = scores[dim] ?? 0;
    await prisma.careerScore.create({
      data: { sessionId: session.id, dimension: dim, score: Math.round(Math.min(100, Math.max(0, value))) },
    });
  }

  const clusterMatches = getCareerClusters(scores);
  const primaryName = clusterMatches[0]?.name ?? null;

  for (let rank = 1; rank <= Math.min(3, clusterMatches.length); rank++) {
    const match = clusterMatches[rank - 1];
    if (!match) break;
    const dbCluster = await prisma.careerCluster.findFirst({
      where: { name: match.name },
    });
    if (dbCluster) {
      await prisma.careerRecommendation.create({
        data: { sessionId: session.id, clusterId: dbCluster.id, rank },
      });
    }
  }

  const report = await prisma.careerReport.create({
    data: {
      sessionId: session.id,
      aiSummary: aiSummary ?? undefined,
      primaryCluster: primaryName,
    },
  });

  return { sessionId: session.id, reportId: report.id };
}

/** Load full report data for a career session (scores, clusters, report, roadmaps for recommended clusters). */
export async function getCareerReportBySessionId(
  sessionId: string
): Promise<CareerReportData | null> {
  const session = await prisma.careerSession.findUnique({
    where: { id: sessionId },
    include: {
      scores: true,
      recommendations: { include: { cluster: true }, orderBy: { rank: "asc" } },
      report: true,
    },
  });

  if (!session) return null;

  const scores = DIMENSION_KEYS.reduce((acc, dim) => {
    const row = session.scores.find((s) => s.dimension === dim);
    acc[dim] = row?.score ?? 0;
    return acc;
  }, {} as CareerIntelligenceScores);

  const clusters = session.recommendations.map((r) => ({
    id: r.cluster.id,
    name: r.cluster.name,
    description: r.cluster.description,
    exampleRoles: (() => {
      try {
        return JSON.parse(r.cluster.exampleRoles) as string[];
      } catch {
        return [];
      }
    })(),
    growthOutlook: r.cluster.growthOutlook,
    rank: r.rank,
  }));

  const roadmaps: CareerReportData["roadmaps"] = [];
  for (const rec of session.recommendations) {
    const steps = await prisma.careerRoadmap.findMany({
      where: { clusterId: rec.clusterId },
      orderBy: { step: "asc" },
    });
    roadmaps.push({
      clusterId: rec.cluster.id,
      clusterName: rec.cluster.name,
      steps: steps.map((s) => ({
        step: s.step,
        title: s.title,
        description: s.description,
        skills: (() => {
          try {
            return JSON.parse(s.skills) as string[];
          } catch {
            return [];
          }
        })(),
      })),
    });
  }

  return {
    session: {
      id: session.id,
      name: session.name,
      age: session.age,
      education: session.education,
      createdAt: session.createdAt,
    },
    scores,
    clusters,
    report: session.report
      ? {
          aiSummary: session.report.aiSummary,
          primaryCluster: session.report.primaryCluster,
          createdAt: session.report.createdAt,
        }
      : null,
    roadmaps,
  };
}

/** Check if a sessionId is a career session (vs psychometric test session). */
export async function isCareerSession(sessionId: string): Promise<boolean> {
  const session = await prisma.careerSession.findUnique({
    where: { id: sessionId },
    select: { id: true },
  });
  return !!session;
}

/** Get latest career report for a user (for Career Passport). Returns null if no session. */
export async function getCareerReportByUserId(
  userId: string
): Promise<(CareerReportData & { passportId: string }) | null> {
  const session = await prisma.careerSession.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  if (!session) return null;
  const data = await getCareerReportBySessionId(session.id);
  if (!data) return null;
  const passportId = `MIB-CP-${session.id.slice(-8).toUpperCase()}`;
  return { ...data, passportId };
}
