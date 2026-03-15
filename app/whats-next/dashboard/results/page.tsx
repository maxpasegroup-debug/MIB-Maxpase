"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ResultsListSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { typography, sectionHeaderClass } from "@/styles/designSystem";

interface ResultRow {
  sessionId: string;
  date: string;
  cluster: string;
}

export default function DashboardResultsPage() {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/results", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => setResults(data.results ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={typography.h1}>Career Test Results</h1>
        <ResultsListSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className={typography.h1}>Career Test Results</h1>
      {error && <p className="text-red-600">{error}</p>}
      {results.length === 0 ? (
        <EmptyState
          title="No tests yet"
          description="Complete your first assessment to see results here."
          actionLabel="Start your first assessment"
          actionHref="/career-intelligence/start"
        />
      ) : (
        <Card className="overflow-hidden" hoverScale={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Cluster</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.sessionId} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(r.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{r.cluster}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/career-results/${r.sessionId}`}
                        className="text-purple-600 font-medium hover:underline"
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
