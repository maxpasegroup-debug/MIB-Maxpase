import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const list = await prisma.psychologist.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      specialization: true,
      experienceYears: true,
      consultationFee: true,
      profilePhoto: true,
    },
  });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const ok = await isAdminAuthenticated(request);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const {
      name,
      specialization,
      experienceYears,
      profilePhoto,
      languages,
      bio,
      consultationFee,
      availability,
      expertiseTags,
    } = body as {
      name?: string;
      specialization?: string;
      experienceYears?: number;
      profilePhoto?: string;
      languages?: string;
      bio?: string;
      consultationFee?: number;
      availability?: string;
      expertiseTags?: string;
    };
    if (!name?.trim() || !specialization?.trim()) {
      return NextResponse.json({ error: "Name and specialization required" }, { status: 400 });
    }
    const psychologist = await prisma.psychologist.create({
      data: {
        name: name.trim(),
        specialization: specialization.trim(),
        experienceYears: Math.max(0, Number(experienceYears) ?? 0),
        profilePhoto: profilePhoto?.trim() || null,
        languages: languages?.trim() || "English",
        bio: bio?.trim() || null,
        consultationFee: Math.max(0, Number(consultationFee) ?? 0),
        availability: availability?.trim() || null,
      },
    });
    return NextResponse.json(psychologist);
  } catch (e) {
    console.error("[POST /api/admin/psychologists]", e);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
