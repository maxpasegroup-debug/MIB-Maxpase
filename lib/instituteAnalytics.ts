import { prisma } from "@/lib/prisma";

export interface InstituteStats {
  totalStudents: number;
  activeTrainees: number;
  avgReadiness: number;
}

const ACTIVE_DAYS = 30;

/**
 * Compute institute-wide stats: total students, active trainees, average readiness.
 */
export async function calculateInstituteStats(
  instituteId: string
): Promise<InstituteStats> {
  const students = await prisma.instituteStudent.findMany({
    where: { instituteId },
    select: { id: true },
  });
  const totalStudents = students.length;
  const studentIds = students.map((s) => s.id);

  if (studentIds.length === 0) {
    return {
      totalStudents: 0,
      activeTrainees: 0,
      avgReadiness: 0,
    };
  }

  const since = new Date();
  since.setDate(since.getDate() - ACTIVE_DAYS);

  const performances = await prisma.studentPerformance.findMany({
    where: { studentId: { in: studentIds } },
    orderBy: { createdAt: "desc" },
  });

  const activeStudentIds = new Set<string>();
  let readinessSum = 0;
  let readinessCount = 0;
  for (const p of performances) {
    if (p.createdAt >= since) {
      activeStudentIds.add(p.studentId);
    }
    readinessSum += p.readiness;
    readinessCount += 1;
  }

  const activeTrainees = activeStudentIds.size;
  const avgReadiness =
    readinessCount > 0 ? Math.round((readinessSum / readinessCount) * 10) / 10 : 0;

  return {
    totalStudents,
    activeTrainees,
    avgReadiness,
  };
}
