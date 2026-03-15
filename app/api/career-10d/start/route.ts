import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { selectCareerQuestions } from "@/lib/careerQuestionEngine";

const MIN_QUESTIONS = 80;

/**
 * Start career test without payment. Payment happens after test completion (report unlock).
 * Loads questions first (category = career_intelligence), shuffle, 80 questions, then create session.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const instituteTestId = (body as { instituteTestId?: string }).instituteTestId;

    const questions = await selectCareerQuestions();
    if (questions.length < MIN_QUESTIONS) {
      return NextResponse.json(
        { error: "Career question bank is not set up. Please contact support." },
        { status: 503 }
      );
    }

    const session = await prisma.career10DSession.create({
      data: {},
    });

    if (process.env.NODE_ENV === "development") {
      console.debug("[career-10d/start] Session started", session.id);
    }

    if (instituteTestId) {
      try {
        await prisma.instituteTest.updateMany({
          where: { id: instituteTestId },
          data: { sessionId: session.id },
        });
      } catch (err) {
        console.error("[career-10d/start] InstituteTest link failed", err);
      }
    }

    return NextResponse.json({
      sessionId: session.id,
      questions,
    });
  } catch (e) {
    console.error("[POST /api/career-10d/start]", e);
    const msg =
      e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P1001"
        ? "Database unavailable. Please try again later."
        : "Failed to start career assessment. Please try again.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
