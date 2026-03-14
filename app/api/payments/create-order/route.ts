import { NextResponse } from "next/server";
import { razorpay, isRazorpayConfigured } from "@/lib/razorpay";

const CAREER_INTELLIGENCE_AMOUNT_PAISE = 49900; // ₹499

export async function POST(request: Request) {
  try {
    if (!isRazorpayConfigured() || !razorpay) {
      return NextResponse.json(
        { error: "Payment is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { product }: { product?: string } = body;

    if (product !== "career_intelligence") {
      return NextResponse.json(
        { error: "Invalid product" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: CAREER_INTELLIGENCE_AMOUNT_PAISE,
      currency: "INR",
      receipt: `career_${Date.now()}`,
    });

    if (process.env.NODE_ENV === "development") {
      console.debug("[payments] Payment order created", order.id);
    }

    return NextResponse.json({
      orderId: order.id,
      amount: CAREER_INTELLIGENCE_AMOUNT_PAISE,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error("[POST /api/payments/create-order]", e);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
