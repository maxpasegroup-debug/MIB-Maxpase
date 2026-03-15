import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GuidanceClient from "./GuidanceClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ sessionId?: string }>;
}

export default async function GuidancePage({ searchParams }: PageProps) {
  const { sessionId } = await searchParams;

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

  return (
    <main className="min-h-screen bg-transparent">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 mb-8"
        >
          ← Back to home
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Professional Guidance
        </h1>
        <p className="text-gray-600 mb-8">
          Connect with licensed psychologists for personalised counselling.
        </p>
        <GuidanceClient psychologists={list} sessionId={sessionId ?? null} />
      </div>
    </main>
  );
}
