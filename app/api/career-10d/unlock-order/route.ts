import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay, isRazorpayConfigured } from "@/lib/razorpay";

const UNLOCK_AMOUNT_PAISE = 49900; // ₹499

export async function POST(request: Request) {
  try {
    if (!isRazorpayConfigured() || !razorpay) {
      return NextResponse.json(
        { error: "Payment is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { sessionId }: { sessionId?: string } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const report = await prisma.career10DReport.findUnique({
      where: { sessionId },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    if (!report.reportLocked) {
      return NextResponse.json(
        { error: "Report is already unlocked" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: UNLOCK_AMOUNT_PAISE,
      currency: "INR",
      receipt: `unlock_${sessionId}_${Date.now()}`.slice(0, 40),
      notes: { sessionId },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: UNLOCK_AMOUNT_PAISE,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error("[POST /api/career-10d/unlock-order]", e);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
