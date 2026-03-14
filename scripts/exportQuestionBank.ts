/**
 * Export full question bank from the database to JSON.
 * Run: npm run export:questions  (or npx tsx scripts/exportQuestionBank.ts)
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const EXPORT_PATH = path.join(process.cwd(), "exports", "question_bank.json");

interface ExportRow {
  id: string;
  category_id: string;
  sub_area: string | null;
  age_group: string;
  question_text: string;
  trait_measured: string;
  weight: number;
  reverse_scored: boolean;
  test_type: string;
}

async function main() {
  const questions = await prisma.question.findMany({
    orderBy: [{ categoryId: "asc" }, { traitMeasured: "asc" }],
    select: {
      id: true,
      categoryId: true,
      subArea: true,
      ageGroup: true,
      questionText: true,
      traitMeasured: true,
      weight: true,
      reverseScored: true,
      testType: true,
    },
  });

  const exportData: ExportRow[] = questions.map((q) => ({
    id: q.id,
    category_id: q.categoryId,
    sub_area: q.subArea,
    age_group: q.ageGroup,
    question_text: q.questionText,
    trait_measured: q.traitMeasured,
    weight: q.weight,
    reverse_scored: q.reverseScored,
    test_type: q.testType,
  }));

  const dir = path.dirname(EXPORT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(EXPORT_PATH, JSON.stringify(exportData, null, 2), "utf-8");
  console.log(`Exported ${exportData.length} questions to ${EXPORT_PATH}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
