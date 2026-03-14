import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PARTNER_SESSION_COOKIE } from "@/lib/referral";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name,
      email,
      phone,
      organization,
    }: { name?: string; email?: string; phone?: string; organization?: string } =
      body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.referralPartner.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      const res = NextResponse.json({
        success: true,
        partnerId: existing.id,
        message: "Already registered. Redirecting to dashboard.",
      });
      res.cookies.set(PARTNER_SESSION_COOKIE, existing.id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return res;
    }

    const partner = await prisma.referralPartner.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() ?? null,
        organization: organization?.trim() ?? null,
        commission: 30,
      },
    });

    const res = NextResponse.json({
      success: true,
      partnerId: partner.id,
      message: "Registration successful",
    });
    res.cookies.set(PARTNER_SESSION_COOKIE, partner.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  } catch (e) {
    console.error("[POST /api/partners/register]", e);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
