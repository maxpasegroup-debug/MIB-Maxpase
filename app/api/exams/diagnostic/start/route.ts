import { NextResponse } from "next/server";
import { startDiagnosticTest } from "@/lib/examDiagnosticEngine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { examId } = body as { examId?: string };
    if (!examId || typeof examId !== "string") {
      return NextResponse.json(
        { error: "Missing examId" },
        { status: 400 }
      );
    }
    const result = await startDiagnosticTest(examId);
    return NextResponse.json(result);
  } catch (e) {
    console.error("[POST /api/exams/diagnostic/start]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to start diagnostic" },
      { status: 500 }
    );
  }
}
