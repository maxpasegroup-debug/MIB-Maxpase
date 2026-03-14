import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const CAREER_TEST_PRICE = 499;
const DAYS_CHART = 14;

export async function GET(request: Request) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.NODE_ENV === "development") {
      console.debug("[admin/analytics] Analytics API called");
    }

    const [
      psychometricTests,
      careerTests,
      bookings,
      psychologists,
      referralPartnersCount,
      partnerRevenueResult,
      totalInstitutes,
      totalInstituteStudents,
    ] = await Promise.all([
      prisma.testSession.count(),
      prisma.career10DSession.count(),
      prisma.booking.count(),
      prisma.psychologist.count(),
      prisma.referralPartner.count(),
      prisma.referral.aggregate({ _sum: { amount: true } }),
      prisma.institute.count(),
      prisma.instituteStudent.count(),
    ]);

    const revenue = careerTests * CAREER_TEST_PRICE;
    const totalReferralPartners = referralPartnersCount;
    const totalPartnerRevenue = partnerRevenueResult._sum.amount ?? 0;

    const since = new Date();
    since.setDate(since.getDate() - DAYS_CHART);
    since.setHours(0, 0, 0, 0);

    const [psychometricSessions, careerSessions] = await Promise.all([
      prisma.testSession.findMany({
        where: { startedAt: { gte: since } },
        select: { startedAt: true },
      }),
      prisma.career10DSession.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
    ]);

    const dateKey = (d: Date) => d.toISOString().slice(0, 10);
    const psychByDay: Record<string, number> = {};
    const careerByDay: Record<string, number> = {};
    for (let i = 0; i < DAYS_CHART; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const k = dateKey(d);
      psychByDay[k] = 0;
      careerByDay[k] = 0;
    }
    psychometricSessions.forEach((s) => {
      const k = dateKey(s.startedAt);
      if (psychByDay[k] !== undefined) psychByDay[k]++;
    });
    careerSessions.forEach((s) => {
      const k = dateKey(s.createdAt);
      if (careerByDay[k] !== undefined) careerByDay[k]++;
    });

    const testsPerDay = Object.entries(psychByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, psychometric]) => ({
        date,
        psychometric,
        career: careerByDay[date] ?? 0,
      }));

    const revenuePerDay = testsPerDay.map(({ date, career }) => ({
      date,
      revenue: career * CAREER_TEST_PRICE,
    }));

    const recentBookings = await prisma.booking.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { psychologist: { select: { name: true } } },
    });

    return NextResponse.json({
      psychometricTests,
      careerTests,
      revenue,
      bookings,
      psychologists,
      totalReferralPartners,
      totalPartnerRevenue,
      totalInstitutes,
      totalInstituteStudents,
      testsPerDay,
      revenuePerDay,
      recentBookings: recentBookings.map((b) => ({
        id: b.id,
        userName: b.userName,
        userEmail: b.userEmail,
        psychologist: b.psychologist.name,
        date: b.createdAt,
        status: b.status,
      })),
    });
  } catch (e) {
    console.error("[GET /api/admin/analytics]", e);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
