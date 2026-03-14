import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePsychologyReport } from "@/lib/aiReportGenerator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId }: { sessionId?: string } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid sessionId" },
        { status: 400 }
      );
    }

    const result = await prisma.result.findUnique({
      where: { sessionId },
      include: {
        session: {
          include: { category: true },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Result not found for this session" },
        { status: 404 }
      );
    }

    if (result.aiAnalysis) {
      return NextResponse.json({
        success: true,
        report: result.aiAnalysis,
      });
    }

    const traitScoresRaw = result.traitScores;
    const traitScores: Record<string, number> = traitScoresRaw
      ? typeof traitScoresRaw === "string"
        ? JSON.parse(traitScoresRaw)
        : traitScoresRaw
      : {
          stress: result.stressScore,
          confidence: result.confidenceScore,
          emotional_stability: result.emotionalScore,
        };

    const category = result.session.category.name;
    const ageGroup = "general";

    if (process.env.NODE_ENV === "development") {
      console.debug("[interpret] Generating AI report");
      console.debug("[interpret] Trait scores:", traitScores);
    }

    const report = await generatePsychologyReport({
      traitScores,
      category,
      ageGroup,
    });

    if (process.env.NODE_ENV === "development") {
      console.debug("[interpret] AI response length:", report.length);
    }

    await prisma.result.update({
      where: { sessionId },
      data: { aiAnalysis: report },
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (e) {
    console.error("[POST /api/test/interpret]", e);
    return NextResponse.json(
      { error: "Failed to generate interpretation" },
      { status: 500 }
    );
  }
}
