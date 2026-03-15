import { NextResponse } from "next/server";
import { getInstituteSession } from "@/lib/instituteAuth";
import { generateInstituteReport } from "@/lib/generateInstituteReport";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = getInstituteSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const report = await generateInstituteReport(session.instituteId);
    return NextResponse.json(report);
  } catch (e) {
    console.error("[POST /api/institutes/reports/generate]", e);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
