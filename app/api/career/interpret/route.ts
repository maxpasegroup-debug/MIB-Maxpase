import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { CAREER_DIMENSIONS, DIMENSION_KEYS } from "@/lib/career-intelligence";
import { getCareerClusters } from "@/lib/careerClusters";
import type { CareerIntelligenceScores } from "@/lib/career-intelligence";

const OPENAI_MODEL = "gpt-4o-mini";

function buildCareerPrompt(
  scores: CareerIntelligenceScores,
  topClusterNames: string[]
): string {
  const lines = CAREER_DIMENSIONS.map(
    (d) => `${d.label}: ${scores[d.key] ?? 0}`
  ).join("\n");

  return `You are a career psychologist. Explain the user's career intelligence profile based on the following 10D scores (each 0–100).

Scores:
${lines}

Recommended career directions from the assessment: ${topClusterNames.join(", ")}

Explain in simple language suitable for students and parents:
• Personality traits that stand out
• Key strengths for work and study
• Likely work style and preferences
• Ideal career directions and why they fit

Use warm, supportive tone. Limit response to 200–300 words. Write in short paragraphs; avoid bullet points in the main text.`;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { sessionId }: { sessionId?: string } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid sessionId" },
        { status: 400 }
      );
    }

    let traitScores: CareerIntelligenceScores;

    // 1) Try Career Intelligence session (career_sessions + career_scores)
    const careerSession = await prisma.careerSession.findUnique({
      where: { id: sessionId },
      include: { scores: true },
    });

    if (careerSession?.scores?.length) {
      traitScores = DIMENSION_KEYS.reduce((acc, dim) => {
        const row = careerSession.scores.find((s) => s.dimension === dim);
        acc[dim] = row?.score ?? 0;
        return acc;
      }, {} as CareerIntelligenceScores);
    } else {
      // 2) Fallback: psychometric Result (traitScores JSON)
      const result = await prisma.result.findUnique({
        where: { sessionId },
      });
      if (!result) {
        return NextResponse.json(
          { error: "Career or result not found for this session" },
          { status: 404 }
        );
      }
      const traitScoresRaw = result.traitScores;
      traitScores = traitScoresRaw
        ? (typeof traitScoresRaw === "string"
            ? JSON.parse(traitScoresRaw)
            : traitScoresRaw) as CareerIntelligenceScores
        : ({} as CareerIntelligenceScores);
    }

    const clusters = getCareerClusters(traitScores);
    const topClusterNames = clusters.map((c) => c.name);

    const prompt = buildCareerPrompt(traitScores, topClusterNames);

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a supportive career psychologist. Write a brief, clear interpretation of a Career Intelligence (10D) profile. Use simple language and short paragraphs. Address students and parents.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const generatedText =
      completion.choices[0]?.message?.content?.trim() ?? "";

    if (!generatedText) {
      return NextResponse.json(
        { error: "OpenAI returned no content" },
        { status: 502 }
      );
    }

    if (careerSession) {
      await prisma.careerReport.upsert({
        where: { sessionId },
        create: { sessionId, aiSummary: generatedText, primaryCluster: topClusterNames[0] ?? null },
        update: { aiSummary: generatedText, primaryCluster: topClusterNames[0] ?? null },
      });
    } else {
      await prisma.result.update({
        where: { sessionId },
        data: { aiAnalysis: generatedText },
      });
    }

    return NextResponse.json({
      success: true,
      aiAnalysis: generatedText,
    });
  } catch (e) {
    console.error("[POST /api/career/interpret]", e);
    if (e instanceof Error && "code" in e && (e as { code?: string }).code === "invalid_json") {
      return NextResponse.json(
        { error: "Invalid trait scores in result" },
        { status: 400 }
      );
    }
    if (e instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: "AI service error", details: e.message },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate career interpretation" },
      { status: 500 }
    );
  }
}
