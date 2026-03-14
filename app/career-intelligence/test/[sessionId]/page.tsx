"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const STORAGE_KEY_PREFIX = "career10d_";

interface QuestionItem {
  id: string;
  question_text: string;
  trait_measured: string;
}

const ANSWER_OPTIONS = [
  { label: "Never", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Always", value: 4 },
];

export default function CareerTestPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    try {
      const raw = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
      if (!raw) {
        setError("Session expired. Please start again.");
        return;
      }
      const q = JSON.parse(raw) as QuestionItem[];
      setQuestions(Array.isArray(q) ? q : []);
    } catch {
      setError("Could not load questions.");
    }
  }, [sessionId]);

  const current = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (score: number) => {
    if (!current) return;
    setResponses((prev) => ({ ...prev, [current.id]: score }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleSubmit = async () => {
    const missing = questions.filter((q) => responses[q.id] == null);
    if (missing.length > 0) {
      setError(`Please answer all questions. ${missing.length} remaining.`);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const body = {
        sessionId,
        responses: questions.map((q) => ({
          questionId: q.id,
          trait_measured: q.trait_measured,
          score: responses[q.id] ?? 2,
        })),
      };
      const res = await fetch("/api/career-10d/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      try {
        sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
      } catch {}
      router.push(data.reportUrl ?? `/career-results/${sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && questions.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/career-intelligence/start" className="text-purple-600 font-medium">
          Start again
        </Link>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-gray-600">Loading questions…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {current?.question_text}
          </h2>
          <div className="space-y-3">
            {ANSWER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleAnswer(opt.value)}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 font-medium transition-colors ${
                  responses[current?.id ?? ""] === opt.value
                    ? "border-purple-600 bg-purple-50 text-purple-800"
                    : "border-gray-200 hover:border-purple-300 text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-between">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="rounded-xl bg-purple-600 px-5 py-2.5 font-medium text-white"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-purple-600 px-5 py-2.5 font-medium text-white disabled:opacity-70"
            >
              {submitting ? "Submitting…" : "See my report"}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-4 text-red-600 text-sm">{error}</p>
        )}

        <Link href="/career-intelligence" className="mt-8 inline-block text-sm text-purple-600">
          ← Exit test
        </Link>
      </div>
    </main>
  );
}
