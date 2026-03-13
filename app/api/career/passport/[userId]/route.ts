import { NextResponse } from "next/server";
import { getCareerReportByUserId } from "@/lib/career-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const data = await getCareerReportByUserId(userId);
    if (!data) {
      return NextResponse.json(
        { error: "No career passport found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[GET /api/career/passport/[userId]]", e);
    return NextResponse.json(
      { error: "Failed to load career passport" },
      { status: 500 }
    );
  }
}
