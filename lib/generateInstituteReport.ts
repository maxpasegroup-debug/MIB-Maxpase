import { prisma } from "@/lib/prisma";
import { calculateInstituteStats } from "@/lib/instituteAnalytics";
import { analyzeClassPerformance } from "@/lib/classPerformance";

export interface InstituteReportData {
  generatedAt: string;
  instituteName: string;
  totalStudents: number;
  activeTrainees: number;
  avgReadiness: number;
  classPerformance: {
    averageAccuracy: number;
    averageSpeed: number;
    weakSubjects: string[];
    topicMastery: { topicName: string; studentCount: number }[];
  };
  trainingRecommendations: string[];
}

/**
 * Generate weekly report: class performance, weak topics, training recommendations.
 * Store in InstituteReport.
 */
export async function generateInstituteReport(
  instituteId: string
): Promise<InstituteReportData> {
  const institute = await prisma.institute.findUnique({
    where: { id: instituteId },
    select: { name: true },
  });
  if (!institute) {
    throw new Error("Institute not found");
  }

  const stats = await calculateInstituteStats(instituteId);
  const classPerf = await analyzeClassPerformance(instituteId);

  const trainingRecommendations: string[] = [];
  if (stats.avgReadiness < 50) {
    trainingRecommendations.push("Schedule focused revision sessions for low-readiness students.");
  }
  if (classPerf.weakSubjects.length > 0) {
    trainingRecommendations.push(
      `Prioritise practice in: ${classPerf.weakSubjects.slice(0, 5).join(", ")}.`
    );
  }
  if (classPerf.averageSpeed < 60) {
    trainingRecommendations.push("Introduce timed drills to improve speed across the class.");
  }
  if (stats.activeTrainees < stats.totalStudents * 0.5) {
    trainingRecommendations.push("Encourage more students to complete at least one practice session this week.");
  }
  if (trainingRecommendations.length === 0) {
    trainingRecommendations.push("Maintain current training schedule and monitor consistency.");
  }

  const reportData: InstituteReportData = {
    generatedAt: new Date().toISOString(),
    instituteName: institute.name,
    totalStudents: stats.totalStudents,
    activeTrainees: stats.activeTrainees,
    avgReadiness: stats.avgReadiness,
    classPerformance: {
      averageAccuracy: classPerf.averageAccuracy,
      averageSpeed: classPerf.averageSpeed,
      weakSubjects: classPerf.weakSubjects,
      topicMastery: classPerf.topicMastery.map((t) => ({
        topicName: t.topicName,
        studentCount: t.studentCount,
      })),
    },
    trainingRecommendations,
  };

  await prisma.instituteReport.create({
    data: {
      instituteId,
      reportData: JSON.stringify(reportData),
    },
  });

  return reportData;
}
