/**
 * Fix duplicate question_text in question_bank_master.csv by replacing
 * duplicate occurrences with new unique alternatives. Keeps same row count and all other fields.
 * Run: npx tsx scripts/fixDuplicateQuestions.ts
 */

import * as fs from "fs";
import * as path from "path";

const CSV_PATH = path.join(process.cwd(), "data", "question_bank_master.csv");
const HEADER = "category,trait,sub_area,question_text,reverse_scored,weight,test_type,age_group";

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if ((c === "," && !inQuotes) || c === "\r") {
      result.push(current.trim());
      current = "";
    } else if (c !== "\r") current += c;
  }
  result.push(current.trim());
  while (result.length > 0 && result[result.length - 1] === "") result.pop();
  return result;
}

interface Row {
  category: string;
  trait: string;
  sub_area: string;
  question_text: string;
  reverse_scored: string;
  weight: string;
  test_type: string;
  age_group: string;
}

function parseRow(rawCols: string[]): Row {
  if (rawCols.length >= 8) {
    const category = rawCols[0];
    const trait = rawCols[1];
    const sub_area = rawCols[2];
    const question_text =
      rawCols.length === 8 ? rawCols[3] : rawCols.slice(3, rawCols.length - 4).join(",");
    const reverse_scored = rawCols[rawCols.length - 4];
    const weight = rawCols[rawCols.length - 3];
    const test_type = rawCols[rawCols.length - 2];
    const age_group = rawCols[rawCols.length - 1];
    return { category, trait, sub_area, question_text, reverse_scored, weight, test_type, age_group };
  }
  return {
    category: rawCols[0] ?? "",
    trait: rawCols[1] ?? "",
    sub_area: rawCols[2] ?? "",
    question_text: rawCols[3] ?? "",
    reverse_scored: rawCols[4] ?? "",
    weight: rawCols[5] ?? "",
    test_type: rawCols[6] ?? "",
    age_group: rawCols[7] ?? "",
  };
}

/** Rephrase duplicate into a unique alternative measuring the same trait. */
function rephraseDuplicate(
  original: string,
  category: string,
  trait: string,
  sub_area: string,
  reverse: string,
  existingSet: Set<string>
): string {
  const normalized = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const isNew = (s: string) => s && normalized(s) !== normalized(original) && !existingSet.has(normalized(s));
  const candidates: string[] = [];

  // Structural rephrases (I X -> X is something I do / I tend to X / Often I X)
  if (original.startsWith("I ")) {
    const rest = original.slice(2);
    candidates.push(`I tend to ${rest}`);
    candidates.push(`Often I ${rest}`);
    if (rest.startsWith("feel ")) candidates.push(`${rest.replace(/^feel /, "I often feel ")}`);
    if (rest.startsWith("avoid ")) candidates.push(`I sometimes ${rest}`);
    if (rest.startsWith("rarely ")) candidates.push(`I do not often ${rest.slice(7)}`);
    if (rest.startsWith("don't ") || rest.startsWith("do not "))
      candidates.push(`I rarely ${rest.replace(/^(don't |do not )/, "")}`);
  }

  // Synonym-style replacements (same structure, different words)
  const synonymMap: [RegExp, string][] = [
    [/\boverwhelmed\b/i, "overloaded"],
    [/\btrust (my )?ability\b/i, "have confidence in my ability"],
    [/\benjoy exploring\b/i, "like to explore"],
    [/\bchallenge assumptions\b/i, "question assumptions"],
    [/\blive according to my principles\b/i, "act in line with my principles"],
    [/\bavoid thinking about purpose\b/i, "seldom think about purpose"],
    [/\bmotivate people\b/i, "encourage people"],
    [/\brarely explore\b/i, "seldom explore"],
    [/\breflect on whether\b/i, "consider whether"],
    [/\bavoid motivating\b/i, "refrain from motivating"],
    [/\bbuild trust through\b/i, "establish trust through"],
    [/\btake responsibility for my decisions\b/i, "own my decisions"],
    [/\bignore emotional needs\b/i, "overlook emotional needs"],
    [/\bavoid emotional closeness\b/i, "shy away from emotional closeness"],
    [/\bdistance myself from emotional situations\b/i, "step back from emotional situations"],
    [/\bdrift without purpose\b/i, "move through life without purpose"],
    [/\bspeak up when I believe\b/i, "voice my views when I believe"],
    [/\bignore deeper purpose\b/i, "pay little attention to deeper purpose"],
    [/\bfeel disconnected from purpose\b/i, "feel a lack of connection to purpose"],
    [/\bwithdraw from leadership roles\b/i, "step back from leadership roles"],
  ];

  for (const [regex, replacement] of synonymMap) {
    const alt = original.replace(regex, replacement);
    if (isNew(alt)) candidates.push(alt);
  }

  for (const c of candidates) {
    if (isNew(c)) return c;
  }

  if (original.startsWith("I ")) {
    const rest = original.slice(2);
    const alt = `I find that I ${rest}`;
    if (isNew(alt)) return alt;
  }
  const alt = `In general, ${original.toLowerCase()}`;
  if (isNew(alt)) return alt;

  return original + " (variant)";
}

function run(): void {
  const content = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = content.split(/\n/);
  const headerLine = (lines[0] ?? "").replace(/^\uFEFF/, "").trim();
  const dataLines = lines.slice(1).filter((l) => l.trim().length > 0);

  const rows: Row[] = [];
  for (const line of dataLines) {
    const rawCols = parseLine(line);
    rows.push(parseRow(rawCols));
  }

  const seenText = new Map<string, number>(); // question_text -> first row index
  const duplicateIndices: number[] = [];
  for (let i = 0; i < rows.length; i++) {
    const text = rows[i].question_text.trim();
    if (seenText.has(text)) duplicateIndices.push(i);
    else seenText.set(text, i);
  }

  const allQuestionTexts = new Set(rows.map((r) => r.question_text.toLowerCase().replace(/\s+/g, " ").trim()));
  let replaced = 0;
  for (const idx of duplicateIndices) {
    const row = rows[idx];
    const newText = rephraseDuplicate(
      row.question_text,
      row.category,
      row.trait,
      row.sub_area,
      row.reverse_scored,
      allQuestionTexts
    );
    if (newText !== row.question_text) {
      rows[idx] = { ...row, question_text: newText };
      allQuestionTexts.add(newText.toLowerCase().replace(/\s+/g, " ").trim());
      replaced++;
    }
  }

  // Build CSV (escape question_text if it contains comma)
  function escape(s: string): string {
    return s.includes(",") ? `"${s.replace(/"/g, '""')}"` : s;
  }
  const outLines = [headerLine];
  for (const r of rows) {
    outLines.push(
      [r.category, r.trait, r.sub_area, escape(r.question_text), r.reverse_scored, r.weight, r.test_type, r.age_group].join(",")
    );
  }
  const hasTrailingNewline = content.endsWith("\n");
  fs.writeFileSync(CSV_PATH, outLines.join("\n") + (hasTrailingNewline ? "\n" : ""), "utf-8");

  console.log("\n--- Report ---");
  console.log("Duplicate questions found:", duplicateIndices.length);
  console.log("Duplicate questions replaced:", replaced);
  console.log("Final total rows:", rows.length);
  console.log("File updated successfully.\n");
}

run();
