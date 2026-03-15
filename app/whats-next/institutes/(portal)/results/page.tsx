"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

interface ResultRow {
  id: string;
  studentName: string;
  studentEmail: string | null;
  cluster: string;
  testDate: string;
  sessionId: string | null;
}

export default function InstituteResultsPage() {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/institutes/results", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then(setResults)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Results</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Student Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Cluster
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Test Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  View Report
                </th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No completed test results yet.
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="py-3 px-4 text-gray-900">{r.studentName}</td>
                    <td className="py-3 px-4 text-gray-600">{r.cluster}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(r.testDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      {r.sessionId ? (
                        <Link
                          href={`${WHATS_NEXT_BASE}/career-results/${r.sessionId}`}
                          className="text-purple-600 font-medium hover:underline"
                        >
                          View Report
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
