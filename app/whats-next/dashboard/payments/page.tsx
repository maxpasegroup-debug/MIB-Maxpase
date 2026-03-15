"use client";

import { Card } from "@/components/ui/Card";

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-1">Your payment history and receipts.</p>
      </header>

      <Card>
        <div className="p-6">
          <p className="text-gray-600">No payments yet. When you unlock reports or book sessions, they will appear here.</p>
        </div>
      </Card>
    </div>
  );
}
