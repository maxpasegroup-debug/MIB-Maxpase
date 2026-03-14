"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  totalReferrals: number;
  totalRevenue: number;
  totalCommission: number;
  referralLink: string;
  partnerName?: string;
}

export default function PartnerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/partners/dashboard", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Please register first");
        }
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    if (!data?.referralLink) return;
    navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-500">Loading dashboard…</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <p className="text-red-600 mb-4">{error ?? "Unable to load dashboard"}</p>
          <Link
            href="/partners/register"
            className="inline-block rounded-lg bg-purple-600 text-white px-4 py-2 font-medium hover:bg-purple-700"
          >
            Register as partner
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
            {data.partnerName && (
              <p className="text-gray-600">Hello, {data.partnerName}</p>
            )}
          </div>
          <Link
            href="/partners/register"
            className="text-sm text-purple-600 hover:underline"
          >
            Update details
          </Link>
        </header>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your referral link</h2>
          <p className="text-sm text-gray-600 mb-3">
            Share this link. When someone completes a paid Career Intelligence test, you earn commission.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={data.referralLink}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-gray-50"
            />
            <button
              type="button"
              onClick={copyLink}
              className="rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-700 whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-600">Total referrals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.totalReferrals}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-600">Total revenue generated</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₹{data.totalRevenue}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-600">Total commission earned</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₹{data.totalCommission}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
