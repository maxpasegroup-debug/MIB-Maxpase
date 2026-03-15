import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { selectCareerQuestions } from "@/lib/careerQuestionEngine";

/**
 * Start career test without payment. Payment happens after test completion (report unlock).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const instituteTestId = (body as { instituteTestId?: string }).instituteTestId;

    const session = await prisma.career10DSession.create({
      data: {},
    });

    const questions = await selectCareerQuestions();
    if (questions.length < 50) {
      await prisma.career10DSession.delete({ where: { id: session.id } }).catch(() => {});
      return NextResponse.json(
        { error: "Not enough career questions in the bank" },
        { status: 503 }
      );
    }

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
    return NextResponse.json(
      { error: "Failed to start career assessment" },
      { status: 500 }
    );
  }
}
