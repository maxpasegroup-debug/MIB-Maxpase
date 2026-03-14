import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";
import OpenAI from "openai";

const MODEL = "gpt-4o-mini";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 300;

export async function GET(request: Request) {
  try {
    const session = getUserSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().slice(0, 10);

    const existing = await prisma.lifeCoachMessage.findUnique({
      where: {
        userId_date: { userId: session.userId, date: today },
      },
    });
    if (existing) {
      const habits: string[] = existing.habits
        ? (JSON.parse(existing.habits) as string[])
        : [];
      return NextResponse.json({
        message: existing.message,
        habits: Array.isArray(habits) ? habits : [],
        date: existing.date,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Life coach is not configured" },
        { status: 503 }
      );
    }

    const [latestSession, growth, recentMissions] = await Promise.all([
      prisma.career10DSession.findFirst({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        include: { scores: true, report: true },
      }),
      prisma.userGrowth.findUnique({
        where: { userId: session.userId },
      }),
      prisma.userMission.findMany({
        where: { userId: session.userId, completed: true },
        orderBy: { completedAt: "desc" },
        take: 5,
        include: { mission: true },
      }),
    ]);

    const contextParts: string[] = [];
    if (latestSession?.report) {
      contextParts.push(`Latest career cluster: ${latestSession.report.cluster}`);
    }
    if (latestSession?.scores) {
      const s = latestSession.scores;
      contextParts.push(
        `10D career scores: creativity ${s.creativity}, analytical ${s.analytical}, leadership ${s.leadership}, social ${s.social}, technology ${s.technology}, entrepreneurial ${s.entrepreneurial}, practical ${s.practical}, learning ${s.learning}, risk ${s.risk}, purpose ${s.purpose}`
      );
    }
    if (growth) {
      contextParts.push(`Growth level: ${growth.level}, current streak: ${growth.streak} days, total points: ${growth.points}`);
    }
    if (recentMissions.length > 0) {
      contextParts.push(
        `Recent completed missions: ${recentMissions.map((m) => m.mission.title).join(", ")}`
      );
    }
    const context = contextParts.length > 0 ? contextParts.join("\n") : "No career or growth data yet.";

    const systemPrompt = `You are an AI life coach helping a person improve their life step by step.
Provide one short daily guidance message and exactly 3 habit suggestions.
Use supportive, motivational language.
Avoid medical or clinical advice.
Respond with valid JSON only, no markdown: {"message": "your short message here", "habits": ["habit 1", "habit 2", "habit 3"]}`;

    const userPrompt = `User context:
${context}

Generate today's daily guidance message and 3 habit suggestions. Return JSON only.`;

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    let message = "Today is a good day to take one small step toward your goals.";
    let habits: string[] = [
      "Drink water mindfully",
      "Practice gratitude",
      "Reflect on one achievement today",
    ];

    try {
      const parsed = JSON.parse(raw) as { message?: string; habits?: string[] };
      if (typeof parsed.message === "string") message = parsed.message;
      if (Array.isArray(parsed.habits) && parsed.habits.length >= 3) {
        habits = parsed.habits.slice(0, 3);
      }
    } catch {
      if (raw) message = raw.slice(0, 400);
    }

    await prisma.lifeCoachMessage.create({
      data: {
        userId: session.userId,
        message,
        habits: JSON.stringify(habits),
        date: today,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.debug("[life-coach] Generated new message for user", session.userId, "date", today);
    }

    return NextResponse.json({
      message,
      habits,
      date: today,
    });
  } catch (e) {
    console.error("[GET /api/life-coach/today]", e);
    return NextResponse.json(
      { error: "Failed to load daily guidance" },
      { status: 500 }
    );
  }
}
