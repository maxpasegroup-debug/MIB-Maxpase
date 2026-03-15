"use client";

import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import { Card } from "@/components/ui/Card";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="text-gray-600 mt-1">Your tests, reports, and payments.</p>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Tests & Reports</h2>
        <Card>
          <div className="p-6">
            <Link
              href={`${WHATS_NEXT_BASE}/dashboard/results`}
              className="text-purple-600 font-medium hover:underline"
            >
              View all career and psychometric results →
            </Link>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Payments</h2>
        <Card>
          <div className="p-6">
            <Link
              href={`${WHATS_NEXT_BASE}/dashboard/payments`}
              className="text-purple-600 font-medium hover:underline"
            >
              View payment history →
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
