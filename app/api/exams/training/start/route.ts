import { NextResponse } from "next/server";
import { generateTrainingSession, type SessionType } from "@/lib/trainingArena";

export const dynamic = "force-dynamic";

const VALID_TYPES: SessionType[] = [
  "practice",
  "mock_test",
  "mock_exam",
  "speed_drill",
  "memory_training",
  "logic_training",
];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, examId, sessionType } = body as {
      userId?: string;
      examId?: string;
      sessionType?: string;
    };
    if (!examId || typeof examId !== "string") {
      return NextResponse.json(
        { error: "Missing examId" },
        { status: 400 }
      );
    }
    const uid = (typeof userId === "string" && userId) || "guest";
    const type = (VALID_TYPES.includes(sessionType as SessionType) ? sessionType : "practice") as SessionType;
    const result = await generateTrainingSession(uid, examId, type);
    return NextResponse.json(result);
  } catch (e) {
    console.error("[POST /api/exams/training/start]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to start training" },
      { status: 500 }
    );
  }
}
