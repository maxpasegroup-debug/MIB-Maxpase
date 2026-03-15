"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

const STORAGE_KEYS = ["exam_diagnostic_", "exam_training_"];

interface QuestionItem {
  id: string;
  questionText: string;
  difficulty: string | null;
  questionType: string;
  subjectId: string;
  topicId: string;
}

const MCQ_OPTIONS = [
  { label: "A", value: 1 },
  { label: "B", value: 2 },
  { label: "C", value: 3 },
  { label: "D", value: 4 },
];

export default function ExamTrainPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    for (const prefix of STORAGE_KEYS) {
      try {
        const raw = sessionStorage.getItem(prefix + sessionId);
        if (!raw) continue;
        const data = JSON.parse(raw) as { questions?: QuestionItem[] };
        const q = data.questions;
        if (Array.isArray(q) && q.length > 0) {
          setQuestions(q);
          return;
        }
      } catch {
        // try next key
      }
    }
    setError("Session expired. Please start again from the exam dashboard.");
  }, [sessionId]);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startTime]);

  const current = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (value: number) => {
    if (!current) return;
    setResponses((prev) => ({ ...prev, [current.id]: value }));
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
    const correct = questions.filter((q) => responses[q.id] === 1).length;
    const score = Math.round((correct / questions.length) * 100);
    const durationSec = Math.floor((Date.now() - startTime) / 1000);
    let examId = "";
    let sessionType = "diagnostic";
    try {
      const d = sessionStorage.getItem("exam_diagnostic_" + sessionId) || sessionStorage.getItem("exam_training_" + sessionId);
      if (d) {
        const parsed = JSON.parse(d) as { examId?: string; type?: string };
        examId = parsed.examId ?? "";
        sessionType = parsed.type ?? "diagnostic";
      }
      sessionStorage.removeItem(`exam_diagnostic_${sessionId}`);
      sessionStorage.removeItem(`exam_training_${sessionId}`);
    } catch {}
    try {
      await fetch("/api/exams/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          examId,
          type: sessionType,
          score: correct,
          total: questions.length,
          durationSec,
        }),
      });
    } catch {}
    router.push(
      `${WHATS_NEXT_BASE}/exam-coaching/result?sessionId=${sessionId}&score=${score}&total=${questions.length}&duration=${durationSec}&examId=${encodeURIComponent(examId)}`
    );
  };

  if (error && questions.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href={`${WHATS_NEXT_BASE}/exam-coaching`} className="text-purple-600 font-medium">
          Back to Exam Coaching
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
    <main className="min-h-screen bg-transparent">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-2 flex-1 rounded-full bg-gray-200 overflow-hidden mr-4">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Question {currentIndex + 1} of {questions.length}
        </p>

        <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {current?.questionText}
          </h2>
          <div className="space-y-3">
            {MCQ_OPTIONS.map((opt) => (
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
                Option {opt.label}
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
              className="rounded-xl bg-purple-600 px-5 py-2.5 font-medium text-white"
            >
              Submit & see result
            </button>
          )}
        </div>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        <Link href={`${WHATS_NEXT_BASE}/exam-coaching`} className="mt-8 inline-block text-sm text-purple-600">
          ← Exit
        </Link>
      </div>
    </main>
  );
}
