import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const QUESTION_COUNT = {
  rapid: 35,
  deep: 100,
} as const;

type TestType = "rapid" | "deep";
type LanguageCode = "en" | "ml" | "hi" | "ta";

/** Fisher-Yates shuffle for unbiased randomization */
function shuffle<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

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

    const questionCount = QUESTION_COUNT[testType];

    // 1. Create test session (guest: no userId)
    const session = await prisma.testSession.create({
      data: {
        categoryId,
        testType,
        languageCode,
      },
    });

    // 2. Fetch questions: filter by category, age group, test type
    const questions = await prisma.question.findMany({
      where: {
        categoryId,
        ageGroup,
        testType,
      },
      select: {
        id: true,
        questionText: true,
        traitMeasured: true,
        reverseScored: true,
      },
    });

    if (questions.length < questionCount) {
      await prisma.testSession.delete({ where: { id: session.id } }).catch(() => {});
      return NextResponse.json(
        {
          error:
            "Not enough questions available for this category and age group",
        },
        { status: 400 }
      );
    }

    // 3. Randomize and limit
    const shuffled = shuffle(questions);
    const selectedQuestions = shuffled.slice(0, questionCount);

    // 4. Map to response shape (id, question_text, trait_measured, reverse_scored)
    const questionsForClient = selectedQuestions.map((q) => ({
      id: q.id,
      question_text: q.questionText,
      trait_measured: q.traitMeasured,
      reverse_scored: q.reverseScored,
    }));

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
