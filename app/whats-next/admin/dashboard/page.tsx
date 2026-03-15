"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MetricCard from "@/components/admin/MetricCard";

const TestChart = dynamic(() => import("@/components/admin/TestChart"), { ssr: false });
const RevenueChart = dynamic(() => import("@/components/admin/RevenueChart"), { ssr: false });

interface Analytics {
  psychometricTests: number;
  careerTests: number;
  revenue: number;
  bookings: number;
  psychologists: number;
  totalReferralPartners?: number;
  totalPartnerRevenue?: number;
  totalInstitutes?: number;
  totalInstituteStudents?: number;
  testsPerDay: { date: string; psychometric: number; career: number }[];
  revenuePerDay: { date: string; revenue: number }[];
  recentBookings: {
    id: string;
    userName: string;
    userEmail: string;
    psychologist: string;
    date: string;
    status: string;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">MIB Platform Analytics</h1>
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">MIB Platform Analytics</h1>
        <p className="text-red-600">{error ?? "No data"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">MIB Platform Analytics</h1>
      </header>

      {/* Section 1 — Metrics cards */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <MetricCard title="Psychometric Tests" value={data.psychometricTests} />
          <MetricCard title="Career Intelligence Tests" value={data.careerTests} />
          <MetricCard title="Total Revenue" value={`₹${data.revenue}`} subtitle="From career tests" />
          <MetricCard title="Counselling Bookings" value={data.bookings} />
          <MetricCard title="Registered Psychologists" value={data.psychologists} />
          <MetricCard title="Referral Partners" value={data.totalReferralPartners ?? 0} />
          <MetricCard title="Partner Revenue" value={`₹${data.totalPartnerRevenue ?? 0}`} subtitle="Via referrals" />
          <MetricCard title="Institutes" value={data.totalInstitutes ?? 0} />
          <MetricCard title="Institute Students" value={data.totalInstituteStudents ?? 0} />
        </div>
      </section>

      {/* Section 2 — Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tests per day</h2>
          <TestChart data={data.testsPerDay ?? []} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue per day</h2>
          <RevenueChart data={data.revenuePerDay ?? []} />
        </div>
      </section>

      {/* Section 3 — Recent bookings */}
      <section className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-700">User Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">User Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Psychologist</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentBookings ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                (data.recentBookings ?? []).map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-900">{b.userName}</td>
                    <td className="py-3 px-4 text-gray-600">{b.userEmail}</td>
                    <td className="py-3 px-4 text-gray-600">{b.psychologist}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(b.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : b.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
