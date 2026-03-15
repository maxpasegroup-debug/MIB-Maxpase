"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

function ResultContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const total = searchParams.get("total");
  const duration = searchParams.get("duration");
  const examId = searchParams.get("examId");

  const scoreNum = score != null ? parseInt(score, 10) : null;
  const totalNum = total != null ? parseInt(total, 10) : null;
  const durationNum = duration != null ? parseInt(duration, 10) : null;

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4">
      <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Session complete</h1>
        {scoreNum != null && totalNum != null && (
          <p className="text-4xl font-bold text-purple-600 mb-1">
            {scoreNum} / {totalNum}
          </p>
        )}
        {scoreNum != null && totalNum != null && (
          <p className="text-gray-600 mb-4">
            {Math.round((scoreNum / totalNum) * 100)}% correct
          </p>
        )}
        {durationNum != null && (
          <p className="text-sm text-gray-500 mb-6">
            Time: {Math.floor(durationNum / 60)}m {durationNum % 60}s
          </p>
        )}
        <div className="flex flex-col gap-3">
          {examId && (
            <Link
              href={`/exam-coaching/performance/${examId}`}
              className="rounded-xl bg-purple-600 text-white font-semibold px-6 py-3 hover:bg-purple-700"
            >
              View performance
            </Link>
          )}
          <Link
            href={`${WHATS_NEXT_BASE}/exam-coaching`}
            className="rounded-xl border border-gray-300 bg-white/70 px-6 py-3 font-medium text-gray-700"
          >
            Exam Coaching Arena
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ExamResultPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading…</p></main>}>
      <ResultContent />
    </Suspense>
  );
}
