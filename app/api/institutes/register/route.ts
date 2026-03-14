import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INSTITUTE_COOKIE_NAME } from "@/lib/instituteAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name,
      email,
      phone,
      address,
    }: { name?: string; email?: string; phone?: string; address?: string } =
      body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Institute name and email are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.institute.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      const res = NextResponse.json({
        success: true,
        instituteId: existing.id,
        message: "Already registered",
      });
      res.cookies.set(INSTITUTE_COOKIE_NAME, existing.id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return res;
    }

    const institute = await prisma.institute.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() ?? null,
        address: address?.trim() ?? null,
      },
    });

    const res = NextResponse.json({
      success: true,
      instituteId: institute.id,
      message: "Registration successful",
    });
    res.cookies.set(INSTITUTE_COOKIE_NAME, institute.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  } catch (e) {
    console.error("[POST /api/institutes/register]", e);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
