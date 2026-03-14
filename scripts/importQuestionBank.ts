/**
 * Import question_bank_master.csv into the database (questions table).
 * Uses Prisma. Does NOT modify the CSV.
 * Run: npx tsx scripts/importQuestionBank.ts
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const CSV_PATH = path.join(process.cwd(), "data", "question_bank_master.csv");
const prisma = new PrismaClient();

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

function parseRow(rawCols: string[]): {
  category: string;
  trait: string;
  sub_area: string;
  question_text: string;
  reverse_scored: string;
  weight: string;
  test_type: string;
  age_group: string;
} | null {
  if (rawCols.length < 8) return null;
  const category = rawCols[0];
  const trait = rawCols[1];
  const sub_area = rawCols[2];
  const question_text =
    rawCols.length === 8 ? rawCols[3] : rawCols.slice(3, rawCols.length - 4).join(",");
  const reverse_scored = rawCols[rawCols.length - 4];
  const weight = rawCols[rawCols.length - 3];
  const test_type = rawCols[rawCols.length - 2];
  const age_group = rawCols[rawCols.length - 1];
  return {
    category,
    trait,
    sub_area,
    question_text,
    reverse_scored,
    weight,
    test_type,
    age_group,
  };
}

function validateRow(r: {
  question_text: string;
  reverse_scored: string;
  weight: string;
  test_type: string;
  age_group: string;
}): string | null {
  if (!r.question_text || !r.question_text.trim()) return "question_text empty";
  const rs = r.reverse_scored.toLowerCase().trim();
  if (rs !== "true" && rs !== "false") return "reverse_scored must be true or false";
  const w = parseInt(r.weight, 10);
  if (Number.isNaN(w) || String(w) !== r.weight.trim()) return "weight must be integer";
  const tt = r.test_type.toLowerCase().trim();
  if (tt !== "rapid" && tt !== "deep") return "test_type must be rapid or deep";
  const ag = r.age_group.trim();
  if (ag !== "15-60" && ag !== "18-60") return "age_group must be 15-60 or 18-60";
  return null;
}

async function main() {
  const content = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = content.split(/\n/);
  const dataLines = lines.slice(1).filter((l) => l.trim().length > 0);

  let inserted = 0;
  let skippedDuplicates = 0;
  let errors = 0;
  const categoryIdBySlug = new Map<string, string>();

  for (let i = 0; i < dataLines.length; i++) {
    const rawCols = parseLine(dataLines[i]);
    const row = parseRow(rawCols);
    if (!row) {
      errors++;
      continue;
    }

    const err = validateRow(row);
    if (err) {
      errors++;
      continue;
    }

    const questionText = row.question_text.trim();
    const reverseScored = row.reverse_scored.toLowerCase().trim() === "true";
    const weight = parseInt(row.weight, 10);
    const testType = row.test_type.toLowerCase().trim();
    const ageGroup = row.age_group.trim();

    const existing = await prisma.question.findFirst({
      where: { questionText },
    });
    if (existing) {
      skippedDuplicates++;
      continue;
    }

    let categoryId = categoryIdBySlug.get(row.category);
    if (!categoryId) {
      const cat = await prisma.category.findFirst({
        where: { name: row.category },
      });
      if (cat) {
        categoryId = cat.id;
        categoryIdBySlug.set(row.category, categoryId);
      } else {
        const newCat = await prisma.category.create({
          data: {
            name: row.category,
            description: `Category: ${row.category}`,
          },
        });
        categoryId = newCat.id;
        categoryIdBySlug.set(row.category, categoryId);
      }
    }

    try {
      await prisma.question.create({
        data: {
          categoryId,
          traitMeasured: row.trait,
          subArea: row.sub_area || null,
          questionText,
          reverseScored,
          weight,
          testType,
          ageGroup,
        },
      });
      inserted++;
    } catch (e) {
      errors++;
    }
  }

  const finalCount = await prisma.question.count();

  console.log("\nIMPORT SUMMARY\n");
  console.log("CSV rows processed:", dataLines.length);
  console.log("Inserted questions:", inserted);
  console.log("Skipped duplicates:", skippedDuplicates);
  console.log("Errors:", errors);
  console.log("");
  console.log("Final questions in database:", finalCount);
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
