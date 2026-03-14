import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { selectCareerQuestions } from "@/lib/careerQuestionEngine";
import { REF_COOKIE_NAME } from "@/lib/referral";

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

    const body = await request.json().catch(() => ({}));
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
        { error: "Payment required. Please complete payment first." },
        { status: 402 }
      );
    }

    const payment_verified = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );

    if (!payment_verified) {
      return NextResponse.json(
        { error: "Invalid payment verification" },
        { status: 402 }
      );
    }

    const session = await prisma.career10DSession.create({
      data: {},
    });

    const questions = await selectCareerQuestions();
    if (questions.length < 50) {
      await prisma.career10DSession.delete({ where: { id: session.id } }).catch(() => {});
      return NextResponse.json(
        { error: "Not enough career questions in the bank" },
        { status: 503 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.debug("[career-10d/start] Session started", session.id);
    }

    const CAREER_INTELLIGENCE_AMOUNT = 499;

    // Record referral only after successful payment (cookie set when user came via partner link)
    const cookieHeader = request.headers.get("cookie") ?? "";
    const refMatch = cookieHeader.match(new RegExp(`${REF_COOKIE_NAME}=([^;]+)`));
    const refPartnerId = refMatch?.[1]?.trim();
    if (refPartnerId) {
      try {
        const partner = await prisma.referralPartner.findUnique({
          where: { id: refPartnerId },
        });
        if (partner) {
          const studentEmail =
            (body as { email?: string }).email ?? "referred@guest";
          const commission = Math.round(
            (CAREER_INTELLIGENCE_AMOUNT * partner.commission) / 100
          );
          await prisma.referral.create({
            data: {
              partnerId: partner.id,
              studentEmail,
              testType: "career_intelligence",
              amount: CAREER_INTELLIGENCE_AMOUNT,
              commission,
            },
          });
        }
      } catch (err) {
        console.error("[career-10d/start] Referral record failed", err);
      }
    }

    // Link institute test if started from institute dashboard
    const instituteTestId = (body as { instituteTestId?: string }).instituteTestId;
    if (instituteTestId) {
      try {
        await prisma.instituteTest.updateMany({
          where: { id: instituteTestId },
          data: { sessionId: session.id },
        });
      } catch (err) {
        console.error("[career-10d/start] InstituteTest link failed", err);
      }
    }

    const res = NextResponse.json({
      sessionId: session.id,
      questions,
    });
    // Clear ref cookie after recording so one payment = one referral
    if (refPartnerId) {
      res.cookies.set(REF_COOKIE_NAME, "", { path: "/", maxAge: 0 });
    }
    return res;
  } catch (e) {
    console.error("[POST /api/career-10d/start]", e);
    return NextResponse.json(
      { error: "Failed to start career assessment" },
      { status: 500 }
    );
  }
}
