"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "parent">("student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = isRegister ? "/api/auth/register" : "/api/auth/login";
      const body = isRegister
        ? { name: name.trim(), email: email.trim().toLowerCase(), password, role }
        : { email: email.trim().toLowerCase(), password };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">
          {isRegister ? "Create account" : "Sign in"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "student" | "parent")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
            </>
          )}
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-2.5 text-white font-medium hover:bg-purple-700 disabled:opacity-70"
          >
            {loading ? "Please wait…" : isRegister ? "Register" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-purple-600 font-medium"
          >
            {isRegister ? "Sign in" : "Register"}
          </button>
        </p>
      </div>
      <Link href="/" className="mt-6 text-sm text-gray-500 hover:text-gray-700">
        ← Back to home
      </Link>
    </main>
  );
}
