import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { selectAdaptiveQuestions } from "@/lib/adaptiveQuestionEngine";

type TestType = "rapid" | "deep";
type LanguageCode = "en" | "ml" | "hi" | "ta";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      categoryId,
      testType,
      ageGroup,
      languageCode,
    }: {
      categoryId: string;
      testType: TestType;
      ageGroup: string;
      languageCode: LanguageCode;
    } = body;

    if (!categoryId || !testType || !ageGroup || !languageCode) {
      return NextResponse.json(
        { error: "Missing required fields: categoryId, testType, ageGroup, languageCode" },
        { status: 400 }
      );
    }

    if (testType !== "rapid" && testType !== "deep") {
      return NextResponse.json(
        { error: "testType must be 'rapid' or 'deep'" },
        { status: 400 }
      );
    }

    // 1. Create test session (guest: no userId)
    const session = await prisma.testSession.create({
      data: {
        categoryId,
        testType,
        languageCode,
      },
    });

    // 2. Adaptive question selection (trait diversity, Fisher-Yates shuffle)
    const { questions: questionsForClient } = await selectAdaptiveQuestions({
      categoryId,
      testType,
      ageGroup,
    });

    const requiredCount = testType === "rapid" ? 35 : 100;
    if (questionsForClient.length < requiredCount) {
      await prisma.testSession.delete({ where: { id: session.id } }).catch(() => {});
      return NextResponse.json(
        {
          error:
            "Not enough questions available for this category and age group",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      questions: questionsForClient,
    });
  } catch (e) {
    console.error("[POST /api/test/start]", e);
    return NextResponse.json(
      { error: "Failed to start test session" },
      { status: 500 }
    );
  }
}
