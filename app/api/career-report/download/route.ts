import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession, canBypassPayments } from "@/lib/userAuth";
import { generateCareerRoadmap } from "@/lib/careerRoadmap";
import type { CareerClusterName } from "@/lib/careerClusterMapping";
import { generatePotentialProfile } from "@/lib/careerPotential";
import { calculateCareerGaps } from "@/lib/careerGapAnalysis";
import { generateCareerProbabilities } from "@/lib/careerProbability";
import { CAREER_10D_DIMENSIONS, CAREER_10D_LABELS, type Career10DDimensionKey } from "@/lib/careerDimensions";
import type { PotentialProfile } from "@/lib/careerPotential";
import type { GapItem } from "@/lib/careerGapAnalysis";
import type { CareerProbabilityItem } from "@/lib/careerProbability";
import {
  CareerReportPDFDocument,
  type CareerReportPDFData,
} from "@/lib/careerReportPDF";
import { renderToBuffer } from "@react-pdf/renderer";
import React, { type ReactElement } from "react";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const session = await prisma.career10DSession.findUnique({
      where: { id: sessionId },
      include: { scores: true, report: true },
    });

    if (!session?.scores || !session?.report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    const userSession = getUserSession(request);
    const allowDownload = !session.report.reportLocked || canBypassPayments(userSession);
    if (!allowDownload) {
      return NextResponse.json(
        { error: "Report is locked. Unlock to download." },
        { status: 403 }
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

    const cluster = session.report.cluster as CareerClusterName;
    const roadmap = generateCareerRoadmap(cluster);
    const potentialProfile: PotentialProfile | null = session.report.potentialProfile
      ? (JSON.parse(session.report.potentialProfile) as PotentialProfile)
      : generatePotentialProfile(traitScores as import("@/lib/careerDimensions").Career10DScores);
    const gapAnalysis: GapItem[] = session.report.gapAnalysis
      ? (JSON.parse(session.report.gapAnalysis) as GapItem[])
      : potentialProfile
        ? calculateCareerGaps(traitScores as import("@/lib/careerDimensions").Career10DScores, potentialProfile)
        : [];
    const probabilities: CareerProbabilityItem[] = session.report.probabilities
      ? (JSON.parse(session.report.probabilities) as CareerProbabilityItem[])
      : generateCareerProbabilities(traitScores as import("@/lib/careerDimensions").Career10DScores);

    const dimensionScores = (CAREER_10D_DIMENSIONS as readonly Career10DDimensionKey[]).map((d) => ({
      label: CAREER_10D_LABELS[d],
      value: typeof traitScores[d] === "number" ? traitScores[d] : 0,
    }));

    const potentialScores = potentialProfile
      ? (CAREER_10D_DIMENSIONS as readonly Career10DDimensionKey[]).map((d) => {
          const key = `potential${d.charAt(0).toUpperCase()}${d.slice(1)}` as keyof PotentialProfile;
          return {
            label: CAREER_10D_LABELS[d],
            value: typeof potentialProfile[key] === "number" ? (potentialProfile[key] as number) : 0,
          };
        })
      : dimensionScores.map((d) => ({ label: d.label, value: 0 }));

    const pdfData: CareerReportPDFData = {
      archetype: session.report.identityName || "Career Profile",
      description: session.report.identityDescription || "",
      careerIndex: session.report.careerIndex ?? 0,
      cluster: session.report.cluster,
      dimensionScores,
      potentialScores,
      gapAnalysis: gapAnalysis.map((g) => ({ dimension: g.dimension, gap: g.gap })),
      probabilities: probabilities.map((p) => ({ career: p.career, probability: p.probability })),
      roadmap: roadmap.map((r) => ({ step: r.step, title: r.title, description: r.description || "" })),
      aiReport: session.report.aiReport || "",
    };

    const doc = React.createElement(CareerReportPDFDocument, { data: pdfData }) as ReactElement;
    const buffer = await renderToBuffer(doc);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="MIB_Career_Intelligence_Report.pdf"',
      },
    });
  } catch (e) {
    console.error("[GET /api/career-report/download]", e);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
