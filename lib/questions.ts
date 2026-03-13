/**
 * Question helpers: display order, translated text for rural/regional (ml, hi, ta).
 */
import type { Question, QuestionTranslation } from "@prisma/client";

export const SUPPORTED_LANGUAGES = ["en", "ml", "hi", "ta"] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export type QuestionWithTranslations = Question & {
  translations?: QuestionTranslation[];
};

/**
 * Get display text for a question: translated if available for languageCode, else question_text.
 */
export function getQuestionText(
  question: QuestionWithTranslations,
  languageCode: LanguageCode = "en"
): string {
  if (languageCode === "en") return question.questionText;
  const t = question.translations?.find(
    (x) => x.languageCode === languageCode
  );
  return t?.translatedText ?? question.questionText;
}

/**
 * Sort questions for a test: display_order ASC (nulls last), then id for stability.
 * B2B: set display_order for fixed order; leave null for randomized.
 */
export function sortQuestionsByDisplayOrder<T extends { displayOrder: number | null; id: string }>(
  questions: T[]
): T[] {
  return [...questions].sort((a, b) => {
    const ao = a.displayOrder ?? 999_999;
    const bo = b.displayOrder ?? 999_999;
    if (ao !== bo) return ao - bo;
    return a.id.localeCompare(b.id);
  });
}
