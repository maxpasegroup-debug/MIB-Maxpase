import { NextResponse } from "next/server";
import { getCareerReportBySessionId } from "@/lib/career-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const data = await getCareerReportBySessionId(sessionId);
    if (!data) {
      return NextResponse.json(
        { error: "Career report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[GET /api/career/report/[sessionId]]", e);
    return NextResponse.json(
      { error: "Failed to load career report" },
      { status: 500 }
    );
  }
}
