/**
 * MIB Career Intelligence for Schools — Dashboard aggregation
 * Aggregates career session data for institutional view.
 */

import { prisma } from "@/lib/prisma";
import { CAREER_DIMENSIONS, DIMENSION_KEYS } from "@/lib/career-intelligence";
import type { CareerIntelligenceScores } from "@/lib/career-intelligence";

const GUIDANCE_THRESHOLD = 40; // any dimension below this → needs guidance

export interface SchoolDashboardStudent {
  sessionId: string;
  name: string;
  topStrength: string;
  recommendedCluster: string;
  guidanceNeeded: boolean;
}

export interface SchoolDashboardData {
  totalStudents: number;
  topStrengthCluster: string;
  studentsNeedingGuidance: number;
  careerDomainDistribution: Array<{ name: string; count: number }>;
  classTalentProfile: Record<string, number>; // dimension label -> average score
  students: SchoolDashboardStudent[];
}

/** Build scores map from session scores array */
function scoresFromRows(
  rows: Array<{ dimension: string; score: number }>
): CareerIntelligenceScores {
  return DIMENSION_KEYS.reduce((acc, dim) => {
    const row = rows.find((r) => r.dimension === dim);
    acc[dim] = row?.score ?? 0;
    return acc;
  }, {} as CareerIntelligenceScores);
}

/** Get dimension label with highest score */
function getTopStrengthLabel(scores: CareerIntelligenceScores): string {
  let maxScore = 0;
  let label = "—";
  for (const d of CAREER_DIMENSIONS) {
    const v = scores[d.key] ?? 0;
    if (v > maxScore) {
      maxScore = v;
      label = d.label;
    }
  }
  return label;
}

/** Determine if student needs guidance (any dimension very low or unclear profile) */
function needsGuidance(scores: CareerIntelligenceScores): boolean {
  const values = DIMENSION_KEYS.map((k) => scores[k] ?? 0);
  const min = Math.min(...values);
  return min < GUIDANCE_THRESHOLD;
}

/**
 * Get aggregated dashboard data for school view.
 * Uses all career sessions (optional: pass schoolId when added to schema).
 */
export async function getSchoolDashboardData(
  _schoolId?: string
): Promise<SchoolDashboardData> {
  const sessions = await prisma.careerSession.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      scores: true,
      recommendations: { include: { cluster: true }, orderBy: { rank: "asc" } },
    },
  });

  const totalStudents = sessions.length;

  const dimensionSums: Record<string, number> = {};
  const dimensionCounts: Record<string, number> = {};
  const topStrengthCounts: Record<string, number> = {};
  const primaryClusterCounts: Record<string, number> = {};
  const students: SchoolDashboardStudent[] = [];

  for (const session of sessions) {
    const scores = scoresFromRows(
      session.scores.map((s) => ({ dimension: s.dimension, score: s.score }))
    );
    const topStrength = getTopStrengthLabel(scores);
    const primaryRec = session.recommendations[0];
    const recommendedCluster = primaryRec?.cluster?.name ?? "—";
    const guidanceNeeded = needsGuidance(scores);

    for (const d of CAREER_DIMENSIONS) {
      const v = scores[d.key] ?? 0;
      dimensionSums[d.label] = (dimensionSums[d.label] ?? 0) + v;
      dimensionCounts[d.label] = (dimensionCounts[d.label] ?? 0) + 1;
    }
    topStrengthCounts[topStrength] = (topStrengthCounts[topStrength] ?? 0) + 1;
    if (recommendedCluster !== "—") {
      primaryClusterCounts[recommendedCluster] =
        (primaryClusterCounts[recommendedCluster] ?? 0) + 1;
    }
    students.push({
      sessionId: session.id,
      name: session.name,
      topStrength,
      recommendedCluster,
      guidanceNeeded,
    });
  }

  let topStrengthCluster = "—";
  let maxCount = 0;
  for (const [label, count] of Object.entries(topStrengthCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topStrengthCluster = label;
    }
  }

  const classTalentProfile: Record<string, number> = {};
  for (const d of CAREER_DIMENSIONS) {
    const sum = dimensionSums[d.label] ?? 0;
    const count = dimensionCounts[d.label] ?? 1;
    classTalentProfile[d.label] = Math.round(sum / count);
  }

  const careerDomainDistribution = Object.entries(primaryClusterCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const studentsNeedingGuidance = students.filter((s) => s.guidanceNeeded).length;

  return {
    totalStudents,
    topStrengthCluster,
    studentsNeedingGuidance,
    careerDomainDistribution,
    classTalentProfile,
    students,
  };
}
