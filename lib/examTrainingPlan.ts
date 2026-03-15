import { prisma } from "@/lib/prisma";
import type { PerformanceMetrics } from "./examPerformance";

export interface PlanDay {
  day: number;
  focus: string;
  tasks: string[];
}

export type PlanLength = "3-day" | "7-day";

/**
 * Generate a 3-day or 7-day training plan and store in TrainingPlan.
 */
export async function generateTrainingPlan(
  userId: string,
  examId: string,
  performance: PerformanceMetrics,
  length: PlanLength = "3-day"
): Promise<PlanDay[]> {
  const days = length === "3-day" ? 3 : 7;
  const weakCount = performance.weakTopics.length;
  const plan: PlanDay[] = [];

  if (days === 3) {
    plan.push(
      {
        day: 1,
        focus: weakCount > 0 ? "Weak topic drill" : "Full syllabus practice",
        tasks: weakCount > 0
          ? [`20 questions from weak topics`, `Review incorrect answers`]
          : ["20 mixed subject questions", "Time yourself"],
      },
      {
        day: 2,
        focus: "Logic and speed",
        tasks: ["Logic drills (15 questions)", "Speed drill (20 questions in 15 min)"],
      },
      {
        day: 3,
        focus: "Mock test",
        tasks: ["Full mock test (30 questions)", "Analyse results and note weak areas"],
      }
    );
  } else {
    plan.push(
      { day: 1, focus: "Diagnostic review", tasks: ["Review weak topics", "20 practice questions"] },
      { day: 2, focus: "Algebra & Quant", tasks: ["20 algebra questions", "10 logic questions"] },
      { day: 3, focus: "Verbal & Reasoning", tasks: ["20 verbal questions", "10 reasoning questions"] },
      { day: 4, focus: "Speed drill", tasks: ["Timed 25-question drill", "Review mistakes"] },
      { day: 5, focus: "Weak topic focus", tasks: ["30 questions from weak areas only"] },
      { day: 6, focus: "Mixed practice", tasks: ["Full-length practice test (30 questions)"] },
      { day: 7, focus: "Mock test", tasks: ["Final mock test", "Calculate readiness score"] }
    );
  }

  await prisma.trainingPlan.create({
    data: {
      userId,
      examId,
      planData: JSON.stringify({ length, plan }),
    },
  });

  return plan;
}
