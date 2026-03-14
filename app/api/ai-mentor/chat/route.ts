import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";

const MODEL = "gpt-4o-mini";
const TEMPERATURE = 0.7;
const DAILY_LIMIT = 20;

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

const SYSTEM_PROMPT = `You are an AI mentor helping students understand their career path and psychological strengths.

The student has completed a career intelligence test.

Provide guidance in simple, supportive language.

Do not diagnose mental illness.

Help the student understand their strengths, weaknesses, and career direction.`;

export async function POST(request: Request) {
  try {
    const session = getUserSession(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI mentor is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { message }: { message?: string } = body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const date = todayString();
    const usage = await prisma.mentorUsage.upsert({
      where: {
        userId_date: { userId: session.userId, date },
      },
      create: { userId: session.userId, date, count: 0 },
      update: {},
    });
    if (usage.count >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: "Daily message limit reached. Try again tomorrow." },
        { status: 429 }
      );
    }

    const latest = await prisma.career10DSession.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: { scores: true, report: true },
    });

    let contextBlock = "The student has not completed a career test yet. Offer general encouragement and suggest taking the Career Intelligence test.";
    if (latest?.scores && latest?.report) {
      const s = latest.scores;
      const scores = {
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
      contextBlock = `Student's career cluster: ${latest.report.cluster}\n10D scores (0-100): ${JSON.stringify(scores, null, 2)}`;
    }

    const userContent = `[Context]\n${contextBlock}\n\n[Student question]\n${message.trim()}`;

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: TEMPERATURE,
      max_tokens: 600,
    });

    const assistantMessage = completion.choices[0]?.message?.content?.trim() ?? "I couldn't generate a response. Please try again.";

    await prisma.mentorUsage.update({
      where: { id: usage.id },
      data: { count: usage.count + 1 },
    });

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (e) {
    console.error("[POST /api/ai-mentor/chat]", e);
    return NextResponse.json(
      { error: "Failed to get mentor response" },
      { status: 500 }
    );
  }
}
