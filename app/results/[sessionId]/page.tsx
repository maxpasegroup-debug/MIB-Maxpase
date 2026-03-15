import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ResultDashboard from "./ResultDashboard";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ResultPage({ params }: PageProps) {
  const { sessionId } = await params;

  const result = await prisma.result.findUnique({
    where: { sessionId },
  });

  if (!result) {
    notFound();
  }

  const traitScores = result.traitScores
    ? (JSON.parse(result.traitScores) as Record<string, number>)
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 mb-8"
        >
          ← Back to home
        </Link>

        <ResultDashboard
          stressScore={result.stressScore}
          confidenceScore={result.confidenceScore}
          emotionalScore={result.emotionalScore}
          traitScores={traitScores}
          aiAnalysis={result.aiAnalysis}
          sessionId={sessionId}
        />
      </div>
    </main>
  );
}
