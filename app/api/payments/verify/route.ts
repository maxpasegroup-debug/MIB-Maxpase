import { NextResponse } from "next/server";
import crypto from "crypto";

function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export async function POST(request: Request) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Payment is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }: {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    const valid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.debug("[payments] Payment verified", razorpay_order_id);
    }

    return NextResponse.json({
      success: true,
      razorpay_order_id,
      razorpay_payment_id,
    });
  } catch (e) {
    console.error("[POST /api/payments/verify]", e);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
