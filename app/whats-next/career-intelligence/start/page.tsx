"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

const STORAGE_KEY_PREFIX = "career10d_";

const FEATURES = [
  "10D Career Profiling",
  "AI Career Report",
  "Career Roadmap",
  "Parent Guidance",
];

function CareerIntelligenceStartContent() {
  const router = useRouter();
  const instituteTestId = useSearchParams().get("instituteTestId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartFreeTest = async () => {
    setError(null);
    setLoading(true);
    try {
      const startRes = await fetch("/api/career-10d/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          instituteTestId ? { instituteTestId } : {}
        ),
      });
      const startData = await startRes.json();
      if (!startRes.ok) throw new Error(startData.error || "Failed to start test");
      const { sessionId, questions } = startData;
      if (!sessionId || !questions?.length) throw new Error("Invalid start response");
      try {
        sessionStorage.setItem(
          `${STORAGE_KEY_PREFIX}${sessionId}`,
          JSON.stringify(questions)
        );
      } catch {
        // ignore
      }
      router.push(`${WHATS_NEXT_BASE}/career-intelligence/test/${sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Career Intelligence Test
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              Free 80-question assessment. Unlock your full report after completion.
            </p>
            <ul className="space-y-2 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            <button
              type="button"
              onClick={handleStartFreeTest}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-6 py-4 text-white font-semibold shadow-lg disabled:opacity-70"
            >
              {loading ? "Starting…" : "Start Free Career Intelligence Test"}
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          You will answer 80 questions. Allow about 15–20 minutes.
        </p>
        <Link
          href={`${WHATS_NEXT_BASE}/career-intelligence`}
          className="mt-8 block text-center text-purple-600 font-medium"
        >
          ← Back to Career Intelligence
        </Link>
      </div>
    </main>
  );
}

export default function CareerIntelligenceStartPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-md w-full animate-pulse rounded-2xl bg-white shadow-xl border border-gray-100 h-80" />
        </main>
      }
    >
      <CareerIntelligenceStartContent />
    </Suspense>
  );
}
