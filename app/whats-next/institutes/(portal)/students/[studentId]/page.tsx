"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

interface StudentInsights {
  studentId: string;
  name: string;
  email: string | null;
  readinessScore: number | null;
  accuracy: number | null;
  speed: number | null;
  weakTopics: string[];
  examName: string | null;
  allPerformances: { readiness: number; accuracy: number; speed: number; examName: string | null; createdAt: string }[];
}

export default function StudentInsightsPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const [data, setData] = useState<StudentInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;
    fetch(`/api/institutes/students/${studentId}/performance`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then(setData)
      .catch(() => setError("Failed to load student insights"))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-red-600">{error ?? "Student not found"}</p>
        <Link href={`${WHATS_NEXT_BASE}/institutes/dashboard#students`} className="mt-4 inline-block text-purple-600 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <Link href={`${WHATS_NEXT_BASE}/institutes/dashboard#students`} className="text-sm text-purple-600 font-medium hover:underline">
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Student Insights — {data.name}</h1>
      {data.email && <p className="text-gray-600 text-sm">{data.email}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Readiness Score</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {data.readinessScore != null ? `${data.readinessScore}%` : "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Accuracy</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {data.accuracy != null ? `${data.accuracy}%` : "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Speed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {data.speed != null ? `${data.speed}%` : "—"}
          </p>
        </div>
      </div>

      {data.weakTopics.length > 0 && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Weak Topics</h2>
          <div className="flex flex-wrap gap-2">
            {data.weakTopics.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-sm font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.allPerformances.length > 0 && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Performance History</h2>
          <ul className="space-y-2 text-sm">
            {data.allPerformances.map((p, i) => (
              <li key={i} className="flex justify-between text-gray-700">
                <span>{p.examName ?? "Exam"} — {new Date(p.createdAt).toLocaleDateString()}</span>
                <span>Readiness: {p.readiness}% · Accuracy: {p.accuracy}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!data.readinessScore && !data.accuracy && data.weakTopics.length === 0 && (
        <p className="text-gray-500">No exam performance data yet for this student.</p>
      )}
    </div>
  );
}
