"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

interface ReportItem {
  id: string;
  createdAt: string;
  reportData: {
    generatedAt?: string;
    instituteName?: string;
    totalStudents?: number;
    activeTrainees?: number;
    avgReadiness?: number;
    classPerformance?: {
      averageAccuracy: number;
      averageSpeed: number;
      weakSubjects: string[];
    };
    trainingRecommendations?: string[];
  } | null;
}

export default function InstituteReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch("/api/institutes/reports", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setReports)
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/institutes/reports/generate", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      await res.json();
      const listRes = await fetch("/api/institutes/reports", { credentials: "include" });
      if (listRes.ok) {
        const list = await listRes.json();
        setReports(Array.isArray(list) ? list : []);
      }
    } catch {
      alert("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="rounded-lg bg-purple-600 text-white px-4 py-2 font-medium hover:bg-purple-700 disabled:opacity-50"
        >
          {generating ? "Generating…" : "Generate Weekly Report"}
        </button>
      </div>
      <Link href={`${WHATS_NEXT_BASE}/institutes/dashboard`} className="text-sm text-purple-600 font-medium hover:underline inline-block">
        ← Dashboard
      </Link>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            No reports yet. Generate a weekly report to see class performance, weak topics, and training recommendations.
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow p-6">
              <p className="text-sm text-gray-500 mb-2">
                {r.reportData?.generatedAt
                  ? new Date(r.reportData.generatedAt).toLocaleString()
                  : new Date(r.createdAt).toLocaleString()}
              </p>
              {r.reportData && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Students</p>
                      <p className="font-semibold">{r.reportData.totalStudents ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Active Trainees</p>
                      <p className="font-semibold">{r.reportData.activeTrainees ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg. Readiness</p>
                      <p className="font-semibold">{r.reportData.avgReadiness != null ? `${r.reportData.avgReadiness}%` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg. Accuracy</p>
                      <p className="font-semibold">{r.reportData.classPerformance?.averageAccuracy != null ? `${r.reportData.classPerformance.averageAccuracy}%` : "—"}</p>
                    </div>
                  </div>
                  {r.reportData.classPerformance?.weakSubjects?.length ? (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Weak subjects:</span>{" "}
                      {r.reportData.classPerformance.weakSubjects.slice(0, 5).join(", ")}
                    </p>
                  ) : null}
                  {r.reportData.trainingRecommendations?.length ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {r.reportData.trainingRecommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
