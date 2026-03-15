"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function ExamPerformancePage() {
  const params = useParams();
  const examId = params.examId as string;
  const [logs, setLogs] = useState<{ accuracy: number; speed: number; consistency?: number; createdAt: string }[]>([]);
  const [readiness, setReadiness] = useState<{ readinessScore: number; predictedRank: string } | null>(null);
  const [weakTopicNames, setWeakTopicNames] = useState<string[]>([]);
  const [rankPrediction, setRankPrediction] = useState<{ rankRange: string; examClearProbability: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;
    fetch(`/api/exams/performance?examId=${encodeURIComponent(examId)}`)
      .then((r) => r.json())
      .then((data) => {
        setLogs(Array.isArray(data.logs) ? data.logs : []);
        setReadiness(data.readiness ?? null);
        setWeakTopicNames(Array.isArray(data.weakTopicNames) ? data.weakTopicNames : []);
        setRankPrediction(data.rankPrediction ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [examId]);

  const accuracyData = logs.map((l, i) => ({
    name: `#${i + 1}`,
    accuracy: Math.round(l.accuracy),
    speed: Math.round(l.speed),
  }));

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-gray-500">Loading performance…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <Link href={`/exam-coaching/${examId}`} className="text-sm text-purple-600 font-medium hover:underline mb-6 inline-block">
          ← Exam dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance</h1>
        <p className="text-gray-600 text-sm mb-8">Accuracy trend, speed, and readiness.</p>

        {(readiness || rankPrediction) && (
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Exam Intelligence</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {readiness && (
                <>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Readiness Score</p>
                    <p className="text-2xl font-bold text-purple-600">{readiness.readinessScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Predicted Rank Range</p>
                    <p className="text-xl font-bold text-gray-900">{rankPrediction?.rankRange ?? readiness.predictedRank}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Exam Clear Probability</p>
                    <p className="text-2xl font-bold text-emerald-600">{rankPrediction?.examClearProbability ?? "—"}%</p>
                  </div>
                </>
              )}
              {!readiness && rankPrediction && (
                <>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Predicted Rank Range</p>
                    <p className="text-xl font-bold text-gray-900">{rankPrediction.rankRange}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Exam Clear Probability</p>
                    <p className="text-2xl font-bold text-emerald-600">{rankPrediction.examClearProbability}%</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {weakTopicNames.length > 0 && (
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Topic mastery — focus areas</h2>
            <p className="text-sm text-gray-500 mb-3">Weak topics to practise (from latest performance)</p>
            <div className="flex flex-wrap gap-2">
              {weakTopicNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-sm font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {accuracyData.length > 0 ? (
          <>
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Accuracy trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={2} name="Accuracy %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Speed score</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="speed" fill="#ec4899" name="Speed %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-8 text-center">
            <p className="text-gray-500">No performance data yet. Complete a diagnostic or training session to see charts.</p>
            <Link href={`/exam-coaching/${examId}`} className="mt-4 inline-block text-purple-600 font-medium">
              Go to exam dashboard →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
