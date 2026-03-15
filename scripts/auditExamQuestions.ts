/**
 * Exam Coaching Arena — question bank audit.
 * Run: npx tsx scripts/auditExamQuestions.ts
 *
 * Checks: total questions per exam, subjects/topics distribution,
 * duplicate question_text, missing options (schema has no options field).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const report: string[] = [];
  report.push("=== EXAM COACHING ARENA — QUESTION BANK AUDIT ===");
  report.push(`Run at: ${new Date().toISOString()}`);
  report.push("");

  const categories = await prisma.examCategory.findMany({
    include: { exams: true },
    orderBy: { name: "asc" },
  });

  if (categories.length === 0) {
    report.push("No exam categories found. Run seed: npx tsx prisma/seed.ts");
    console.log(report.join("\n"));
    return;
  }

  let totalQuestions = 0;
  const duplicateTexts: { text: string; count: number; examIds: string[] }[] = [];

  for (const cat of categories) {
    report.push(`--- Category: ${cat.name} (${cat.exams.length} exam(s)) ---`);

    for (const exam of cat.exams) {
      const questions = await prisma.examQuestion.findMany({
        where: { examId: exam.id },
        include: { subject: true, topic: true },
      });

      totalQuestions += questions.length;

      const bySubject: Record<string, number> = {};
      const byTopic: Record<string, number> = {};
      for (const q of questions) {
        bySubject[q.subject.name] = (bySubject[q.subject.name] ?? 0) + 1;
        byTopic[q.topic.name] = (byTopic[q.topic.name] ?? 0) + 1;
      }

      report.push(`  Exam: ${exam.name} (id: ${exam.id})`);
      report.push(`    Total questions: ${questions.length}`);
      report.push(`    Subjects distribution: ${JSON.stringify(bySubject)}`);
      report.push(`    Topics distribution: ${JSON.stringify(byTopic)}`);

      const textCount: Record<string, number> = {};
      for (const q of questions) {
        const t = q.questionText.trim();
        textCount[t] = (textCount[t] ?? 0) + 1;
      }
      const dupes = Object.entries(textCount).filter(([, count]) => count > 1);
      for (const [text, count] of dupes) {
        duplicateTexts.push({
          text: text.slice(0, 60) + (text.length > 60 ? "…" : ""),
          count,
          examIds: [exam.id],
        });
      }

      report.push(`    Duplicate question_text in this exam: ${dupes.length}`);
      report.push("");
    }
  }

  report.push("--- Schema: options ---");
  report.push("  ExamQuestion model has no 'options' field; MCQ options are not stored. Report: N/A for options.");
  report.push("");

  report.push("--- Duplicate question_text (across all exams) ---");
  if (duplicateTexts.length === 0) {
    report.push("  None found.");
  } else {
    for (const d of duplicateTexts.slice(0, 20)) {
      report.push(`  "${d.text}" — count: ${d.count}, examIds: ${d.examIds.join(", ")}`);
    }
    if (duplicateTexts.length > 20) report.push(`  ... and ${duplicateTexts.length - 20} more.`);
  }

  report.push("");
  report.push("--- Summary ---");
  report.push(`  Total categories: ${categories.length}`);
  report.push(`  Total exams: ${categories.reduce((s, c) => s + c.exams.length, 0)}`);
  report.push(`  Total questions: ${totalQuestions}`);
  report.push(`  Duplicate question texts: ${duplicateTexts.length}`);
  report.push("=== END AUDIT ===");

  console.log(report.join("\n"));
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
