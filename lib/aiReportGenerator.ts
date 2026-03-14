import OpenAI from "openai";

const OPENAI_MODEL = "gpt-4o-mini";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 1200;

export type TraitScores = Record<string, number>;

export type GenerateReportInput = {
  traitScores: TraitScores;
  category: string;
  ageGroup: string;
};

const SYSTEM_PROMPT = `You are an experienced psychologist writing a professional psychological assessment report.

A user has completed a psychometric evaluation.

Trait scores are given from 0–100.

Interpret the personality profile, emotional condition, cognitive patterns, and behavioral tendencies.

Provide a structured report with the following sections:

1. Overall Psychological Profile
2. Emotional Health
3. Personality Strengths
4. Possible Challenges
5. Behavioral Patterns
6. Career and Life Implications
7. Personal Growth Suggestions

Keep the tone supportive and professional.
Avoid clinical diagnosis.
Write in clear human language.`;

function buildUserPrompt(traitScores: TraitScores, category: string, ageGroup: string): string {
  const preamble = `Category: ${category}\nAge group: ${ageGroup}\n\nTrait scores (0–100):`;
  const scoresJson = JSON.stringify(traitScores, null, 2);
  return `${preamble}\n\n${scoresJson}`;
}

/**
 * Generate a professional psychology-style report from trait scores.
 * Uses OPENAI_API_KEY; does not modify the scoring system.
 */
export async function generatePsychologyReport(
  params: GenerateReportInput
): Promise<string> {
  const { traitScores, category, ageGroup } = params;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const userContent = buildUserPrompt(traitScores, category, ageGroup);
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
  });

  const report = completion.choices[0]?.message?.content?.trim() ?? "";
  return report;
}
