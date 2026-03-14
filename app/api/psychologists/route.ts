import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const psychologists = await prisma.psychologist.findMany({
      orderBy: { rating: "desc" },
      select: {
        id: true,
        name: true,
        specialization: true,
        experienceYears: true,
        languages: true,
        rating: true,
        consultationFee: true,
        profilePhoto: true,
      },
    });

    const list = psychologists.map((p) => ({
      id: p.id,
      name: p.name,
      specialization: p.specialization,
      experience: p.experienceYears,
      languages: p.languages,
      rating: p.rating,
      sessionPrice: p.consultationFee,
      photo: p.profilePhoto,
    }));

    return NextResponse.json(list);
  } catch (e) {
    console.error("[GET /api/psychologists]", e);
    return NextResponse.json(
      { error: "Failed to fetch psychologists" },
      { status: 500 }
    );
  }
}
