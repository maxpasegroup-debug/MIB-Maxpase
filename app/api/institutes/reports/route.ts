import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstituteSession } from "@/lib/instituteAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reports = await prisma.instituteReport.findMany({
      where: { instituteId: session.instituteId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const list = reports.map((r) => {
      let data: unknown = null;
      try {
        data = JSON.parse(r.reportData);
      } catch {}
      return {
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        reportData: data,
      };
    });

    return NextResponse.json(list);
  } catch (e) {
    console.error("[GET /api/institutes/reports]", e);
    return NextResponse.json(
      { error: "Failed to load reports" },
      { status: 500 }
    );
  }
}
