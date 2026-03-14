import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      psychologistId,
      userName,
      userEmail,
      sessionId,
    }: {
      psychologistId?: string;
      userName?: string;
      userEmail?: string;
      sessionId?: string;
    } = body;

    if (!psychologistId || !userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields: psychologistId, userName, userEmail" },
        { status: 400 }
      );
    }

    await prisma.booking.create({
      data: {
        psychologistId,
        userName: String(userName).trim(),
        userEmail: String(userEmail).trim(),
        sessionId: sessionId ? String(sessionId).trim() : null,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[POST /api/bookings]", e);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
