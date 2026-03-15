"use client";

import { useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi2";

interface CoachFeedbackProps {
  examId: string;
  onMessage?: (msg: string | null) => void;
  message?: string | null;
}

export default function CoachFeedback({ examId, onMessage, message: controlledMessage }: CoachFeedbackProps) {
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const message = controlledMessage ?? localMessage;

  const handleFetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/exams/coach-feedback?examId=${encodeURIComponent(examId)}`);
      const data = await res.json();
      const msg = data.feedback ?? data.message ?? null;
      setLocalMessage(msg);
      onMessage?.(msg);
    } catch {
      setLocalMessage("Could not load coach feedback. Complete a diagnostic or practice session first.");
      onMessage?.(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/90 shadow-xl p-6 border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
        <HiOutlineSparkles className="w-5 h-5 text-purple-600" />
        AI Coach Feedback
      </h2>
      <p className="text-gray-600 text-sm mb-4">
        Get strict, actionable feedback based on your performance.
      </p>
      {!message ? (
        <button
          type="button"
          onClick={handleFetchFeedback}
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold px-5 py-2.5 shadow-lg hover:scale-105 transition-transform disabled:opacity-70"
        >
          {loading ? "Loading…" : "Get coach feedback"}
        </button>
      ) : (
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-gray-700 text-sm whitespace-pre-wrap">
          {message}
        </div>
      )}
    </div>
  );
}
