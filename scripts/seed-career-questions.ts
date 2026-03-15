/**
 * Seed career_intelligence category and questions from data/question_bank_master.csv.
 * Ensures category exists, then imports rows where category = "career_intelligence".
 * Skips duplicates by questionText (per category).
 * Run: npx tsx scripts/seed-career-questions.ts
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const CSV_PATH = path.join(process.cwd(), "data", "question_bank_master.csv");

interface CsvRow {
  category: string;
  trait: string;
  sub_area: string;
  question_text: string;
  reverse_scored: string;
  weight: string;
  test_type: string;
  age_group: string;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row: Record<string, string> = {};
    header.forEach((h, j) => {
      row[h] = (values[j] ?? "").trim();
    });
    if (row.category && row.question_text) {
      rows.push({
        category: row.category ?? "",
        trait: row.trait ?? "",
        sub_area: row.sub_area ?? "",
        question_text: row.question_text ?? "",
        reverse_scored: (row.reverse_scored ?? "false").toLowerCase(),
        weight: row.weight ?? "1",
        test_type: (row.test_type ?? "deep").toLowerCase(),
        age_group: (row.age_group ?? "18-60").replace(/-/g, "_"),
      });
    }
  }
  return rows;
}

function normalizeAgeGroup(age: string): string {
  const a = age.toUpperCase().replace(/-/g, "_");
  if (a === "15_60" || a === "18_60") return "AGE_18_25"; // map to existing
  if (a.startsWith("AGE_")) return a;
  return "AGE_18_25";
}

async function main() {
  console.log("Career question bank seed — category: career_intelligence");
  let category = await prisma.category.findFirst({
    where: { name: "career_intelligence" },
  });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "career_intelligence",
        description: "Career Intelligence 10D assessment",
      },
    });
    console.log("  Created category: career_intelligence");
  } else {
    console.log("  Category career_intelligence already exists");
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.log("  CSV not found:", CSV_PATH);
    process.exit(1);
  }
  const content = fs.readFileSync(CSV_PATH, "utf-8");
  const allRows = parseCsv(content);
  const careerRows = allRows.filter((r) => r.category === "career_intelligence");
  console.log("  Rows with category=career_intelligence:", careerRows.length);

  const existingTexts = new Set(
    (
      await prisma.question.findMany({
        where: { categoryId: category.id },
        select: { questionText: true },
      })
    ).map((q) => q.questionText)
  );

  let created = 0;
  let skipped = 0;
  for (const row of careerRows) {
    if (existingTexts.has(row.question_text)) {
      skipped++;
      continue;
    }
    const ageGroup = normalizeAgeGroup(row.age_group);
    const testType = row.test_type === "rapid" ? "rapid" : "deep";
    const reverseScored = row.reverse_scored === "true" || row.reverse_scored === "1";
    const weight = Math.max(1, parseInt(row.weight, 10) || 1);
    await prisma.question.create({
      data: {
        categoryId: category.id,
        subArea: row.sub_area || null,
        ageGroup,
        questionText: row.question_text,
        traitMeasured: row.trait,
        weight,
        testType,
        reverseScored,
        culturalContext: false,
        techContext: false,
      },
    });
    existingTexts.add(row.question_text);
    created++;
  }
  console.log("  Created:", created, "Skipped (duplicate):", skipped);
  const total = await prisma.question.count({
    where: { categoryId: category.id },
  });
  console.log("  Total career_intelligence questions in DB:", total);
  if (total < 80) {
    console.warn("  WARNING: Need at least 80 questions for the test. Run with more data or add questions.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
