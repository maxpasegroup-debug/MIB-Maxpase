import { NextResponse } from "next/server";
import { createCareerSessionWithResult } from "@/lib/career-service";
import type { CareerIntelligenceScores } from "@/lib/career-intelligence";
import { DIMENSION_KEYS } from "@/lib/career-intelligence";

function parseScores(body: unknown): CareerIntelligenceScores | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const scores: Record<string, number> = {};
  for (const key of DIMENSION_KEYS) {
    const v = o[key];
    if (typeof v === "number" && v >= 0 && v <= 100) scores[key] = Math.round(v);
    else if (typeof v === "string") scores[key] = Math.min(100, Math.max(0, parseInt(v, 10) || 0));
    else scores[key] = 0;
  }
  return scores as CareerIntelligenceScores;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      name,
      age,
      education,
      scores: scoresInput,
      aiSummary,
    } = body as {
      userId?: string | null;
      name?: string;
      age?: number;
      education?: string | null;
      scores?: unknown;
      aiSummary?: string | null;
    };

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Missing or invalid name" },
        { status: 400 }
      );
    }
    const ageNum = typeof age === "number" ? age : parseInt(String(age ?? 0), 10);
    if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      return NextResponse.json(
        { error: "Missing or invalid age" },
        { status: 400 }
      );
    }

    const scores = parseScores(scoresInput);
    if (!scores) {
      return NextResponse.json(
        { error: "Missing or invalid scores (need 10D object)" },
        { status: 400 }
      );
    }

    const { sessionId, reportId } = await createCareerSessionWithResult({
      userId: userId ?? null,
      name: name.trim(),
      age: ageNum,
      education: education ?? null,
      scores,
      aiSummary: aiSummary ?? null,
    });

    return NextResponse.json({
      success: true,
      sessionId,
      reportId,
      reportUrl: `/career-intelligence/report/${sessionId}`,
    });
  } catch (e) {
    console.error("[POST /api/career/complete]", e);
    return NextResponse.json(
      { error: "Failed to complete career assessment" },
      { status: 500 }
    );
  }
}
