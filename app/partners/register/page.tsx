"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/partners/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          organization: organization.trim() || undefined,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/partners/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2 text-center">
          Become a Referral Partner
        </h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          Refer students to Career Intelligence and earn commission on every paid test.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
              Organization (optional)
            </label>
            <input
              id="organization"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="School, institute, or practice"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 text-white py-2.5 font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? "Registering…" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already a partner?{" "}
          <Link href="/partners/dashboard" className="text-purple-600 hover:underline">
            Go to dashboard
          </Link>
        </p>
      </div>
    </main>
  );
}
