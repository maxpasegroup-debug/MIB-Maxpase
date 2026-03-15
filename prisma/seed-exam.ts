/**
 * Exam Coaching Arena seed: SSC CGL with 4 subjects, expanded topics, 300 questions.
 * Subjects: Quantitative Aptitude, Logical Reasoning, English Grammar, General Awareness.
 * Invoked from seed.ts.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

function pickDifficulty(index: number): (typeof DIFFICULTIES)[number] {
  const i = index % 9;
  if (i < 4) return "easy";
  if (i < 7) return "medium";
  return "hard";
}

function genQuestion(topicName: string, difficulty: string, n: number): string {
  return `[${topicName}] ${difficulty} question ${n}. Practice item for competitive exam preparation.`;
}

export async function seedExamCoaching() {
  const count = await prisma.examCategory.count();
  if (count > 0) {
    console.log("Exam categories already exist; skipping exam coaching seed.");
    return;
  }

  const cat = await prisma.examCategory.create({
    data: {
      name: "Government & Banking",
      description: "Competitive exams for SSC, Banking, and government jobs.",
    },
  });

  const exam = await prisma.exam.create({
    data: {
      categoryId: cat.id,
      name: "SSC CGL Tier 1",
      description: "Staff Selection Commission Combined Graduate Level preliminary exam.",
      difficulty: "medium",
      duration: 60,
      totalQuestions: 25,
    },
  });

  const quant = await prisma.examSubject.create({
    data: { examId: exam.id, name: "Quantitative Aptitude", weightage: 34 },
  });
  const reasoning = await prisma.examSubject.create({
    data: { examId: exam.id, name: "Logical Reasoning", weightage: 33 },
  });
  const english = await prisma.examSubject.create({
    data: { examId: exam.id, name: "English Grammar", weightage: 33 },
  });
  const generalAwareness = await prisma.examSubject.create({
    data: { examId: exam.id, name: "General Awareness", weightage: 20 },
  });

  const topicSpecs: { subjectId: string; name: string; difficulty: string }[] = [
    { subjectId: quant.id, name: "Algebra", difficulty: "medium" },
    { subjectId: quant.id, name: "Number System", difficulty: "easy" },
    { subjectId: quant.id, name: "Percentage", difficulty: "easy" },
    { subjectId: quant.id, name: "Ratio and Proportion", difficulty: "medium" },
    { subjectId: quant.id, name: "Time and Work", difficulty: "medium" },
    { subjectId: quant.id, name: "Geometry", difficulty: "medium" },
    { subjectId: reasoning.id, name: "Logical Reasoning", difficulty: "medium" },
    { subjectId: reasoning.id, name: "Coding Decoding", difficulty: "medium" },
    { subjectId: reasoning.id, name: "Analogy", difficulty: "easy" },
    { subjectId: reasoning.id, name: "Series", difficulty: "medium" },
    { subjectId: reasoning.id, name: "Blood Relations", difficulty: "medium" },
    { subjectId: english.id, name: "Grammar", difficulty: "easy" },
    { subjectId: english.id, name: "Vocabulary", difficulty: "easy" },
    { subjectId: english.id, name: "Sentence Correction", difficulty: "medium" },
    { subjectId: english.id, name: "Reading Comprehension", difficulty: "medium" },
    { subjectId: generalAwareness.id, name: "History", difficulty: "medium" },
    { subjectId: generalAwareness.id, name: "Geography", difficulty: "medium" },
    { subjectId: generalAwareness.id, name: "Polity", difficulty: "medium" },
    { subjectId: generalAwareness.id, name: "Economics", difficulty: "medium" },
    { subjectId: generalAwareness.id, name: "Current Affairs", difficulty: "hard" },
  ];

  const topicMap = new Map<string, string>();
  for (const t of topicSpecs) {
    const rec = await prisma.examTopic.create({
      data: { subjectId: t.subjectId, name: t.name, difficulty: t.difficulty },
    });
    topicMap.set(`${t.subjectId}:${t.name}`, rec.id);
  }

  const distribution: { subjectId: string; topicNames: string[]; total: number }[] = [
    { subjectId: quant.id, topicNames: ["Algebra", "Number System", "Percentage", "Ratio and Proportion", "Time and Work", "Geometry"], total: 120 },
    { subjectId: reasoning.id, topicNames: ["Logical Reasoning", "Coding Decoding", "Analogy", "Series", "Blood Relations"], total: 80 },
    { subjectId: english.id, topicNames: ["Grammar", "Vocabulary", "Sentence Correction", "Reading Comprehension"], total: 60 },
    { subjectId: generalAwareness.id, topicNames: ["History", "Geography", "Polity", "Economics", "Current Affairs"], total: 40 },
  ];

  let globalIdx = 0;
  for (const d of distribution) {
    const perTopic = Math.ceil(d.total / d.topicNames.length);
    let subjectCount = 0;
    for (const topicName of d.topicNames) {
      const topicId = topicMap.get(`${d.subjectId}:${topicName}`);
      if (!topicId) continue;
      for (let i = 0; i < perTopic && subjectCount < d.total; i++) {
        const difficulty = pickDifficulty(globalIdx++);
        await prisma.examQuestion.create({
          data: {
            examId: exam.id,
            subjectId: d.subjectId,
            topicId,
            questionText: genQuestion(topicName, difficulty, subjectCount + 1),
            difficulty,
            questionType: "mcq",
          },
        });
        subjectCount++;
      }
    }
  }

  const totalQuestions = await prisma.examQuestion.count({ where: { examId: exam.id } });
  console.log(`Exam Coaching Arena seed complete: 1 category, 1 exam, 4 subjects, ${topicSpecs.length} topics, ${totalQuestions} questions.`);
}
