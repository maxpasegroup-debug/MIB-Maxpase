import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PARTNER_SESSION_COOKIE } from "@/lib/referral";
import { generateReferralLink } from "@/lib/referral";

function getPartnerIdFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    new RegExp(`${PARTNER_SESSION_COOKIE}=([^;]+)`)
  );
  return match?.[1]?.trim() ?? null;
}

export async function GET(request: Request) {
  try {
    const partnerId = getPartnerIdFromRequest(request);
    if (!partnerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partner = await prisma.referralPartner.findUnique({
      where: { id: partnerId },
    });
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const referrals = await prisma.referral.findMany({
      where: { partnerId },
      select: { amount: true, commission: true },
    });

    const totalReferrals = referrals.length;
    const totalRevenue = referrals.reduce((s, r) => s + r.amount, 0);
    const totalCommission = referrals.reduce((s, r) => s + r.commission, 0);
    const referralLink = generateReferralLink(partner.id);

    return NextResponse.json({
      totalReferrals,
      totalRevenue,
      totalCommission,
      referralLink,
      partnerName: partner.name,
    });
  } catch (e) {
    console.error("[GET /api/partners/dashboard]", e);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
