import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { TRAIT_LABELS, type TraitKey } from "@/lib/traits";

const OPENAI_MODEL = "gpt-4o-mini";

function buildPrompt(traitScores: Record<string, number>): string {
  const lines = (Object.entries(traitScores) as [TraitKey, number][])
    .filter(([_, v]) => typeof v === "number")
    .map(([trait, score]) => `${TRAIT_LABELS[trait]}: ${score}`)
    .join("\n");

  return `Write a psychological interpretation based on the following trait scores (each 0–100):

${lines}

Explain in simple language suitable for the general public:
• personality profile
• emotional condition
• behavioral patterns
• strengths
• areas for improvement

Use warm, supportive tone. Limit to 300 words. Do not use bullet points in the main text; write in short paragraphs.`;
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

    const result = await prisma.result.findUnique({
      where: { sessionId },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Result not found for this session" },
        { status: 404 }
      );
    }

    const traitScoresRaw = result.traitScores;
    const traitScores: Record<string, number> = traitScoresRaw
      ? (typeof traitScoresRaw === "string"
          ? JSON.parse(traitScoresRaw)
          : traitScoresRaw)
      : {
          stress: result.stressScore,
          confidence: result.confidenceScore,
          emotional_stability: result.emotionalScore,
        };
    const prompt = buildPrompt(traitScores as Record<TraitKey, number>);

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a supportive psychologist writing a brief, accessible interpretation of psychometric trait scores for a general audience. Use simple language and short paragraphs.",
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

    await prisma.result.update({
      where: { sessionId },
      data: { aiAnalysis: generatedText },
    });

    return NextResponse.json({
      success: true,
      aiAnalysis: generatedText,
    });
  } catch (e) {
    console.error("[POST /api/test/ai-analysis]", e);
    if (e instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: "AI service error", details: e.message },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate AI interpretation" },
      { status: 500 }
    );
  }
}
