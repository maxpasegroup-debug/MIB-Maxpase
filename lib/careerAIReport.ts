/**
 * MIB Career Intelligence 10D — AI career report via OpenAI.
 */

import OpenAI from "openai";
import type { Career10DScores } from "./careerDimensions";
import type { CareerClusterName } from "./careerClusterMapping";

const MODEL = "gpt-4o-mini";
const MAX_TOKENS = 1500;
const TEMPERATURE = 0.7;

const SYSTEM_PROMPT = `You are a career psychologist.

A user completed a multidimensional career intelligence test (10 dimensions).

Explain the career profile and suggest career directions.

Include:
1. Career personality profile
2. Strengths
3. Potential career paths
4. Learning roadmap
5. Advice for parents and students

Write in clear, supportive language. Use short paragraphs and bullet points where helpful.`;

export async function generateCareerAIReport(
  scores: Career10DScores,
  cluster: CareerClusterName
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const userContent = `10D dimension scores (0–100):
${JSON.stringify(scores, null, 2)}

Primary career cluster: ${cluster}

Generate the career report as specified.`;

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
  });

  const report = completion.choices[0]?.message?.content?.trim() ?? "";
  return report;
}
