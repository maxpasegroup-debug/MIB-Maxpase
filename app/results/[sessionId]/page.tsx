import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRecommendedTests, getRecommendedTestsFromRules } from "@/lib/recommendations";
import ResultReport from "./ResultReport";

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

  let recommendations = await getRecommendedTests(prisma, traitScores);
  if (recommendations.length === 0 && traitScores) {
    recommendations = getRecommendedTestsFromRules(traitScores);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 mb-8"
        >
          ← Back to home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Your Mind Report
        </h1>
        <p className="text-gray-600 mb-10">
          Here’s a snapshot of your assessment results.
        </p>

        <ResultReport
          sessionId={sessionId}
          stressScore={result.stressScore}
          confidenceScore={result.confidenceScore}
          emotionalScore={result.emotionalScore}
          traitScores={traitScores}
          aiAnalysis={result.aiAnalysis}
          recommendations={recommendations}
        />
      </div>
    </main>
  );
}
