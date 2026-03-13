import { NextResponse } from "next/server";
import { getSchoolDashboardData } from "@/lib/school-dashboard";

export async function GET() {
  try {
    const data = await getSchoolDashboardData();
    return NextResponse.json(data);
  } catch (e) {
    console.error("[GET /api/school-dashboard]", e);
    return NextResponse.json(
      { error: "Failed to load school dashboard" },
      { status: 500 }
    );
  }
}
