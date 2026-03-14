"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  name: string;
  totalStudents: number;
  testsConducted: number;
  careerTests: number;
  psychometricTests: number;
}

interface Student {
  id: string;
  name: string;
  email: string | null;
  age: number | null;
  createdAt: string;
}

export default function InstituteDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addAge, setAddAge] = useState("");
  const [adding, setAdding] = useState(false);
  const [startingTest, setStartingTest] = useState<string | null>(null);

  const load = () => {
    Promise.all([
      fetch("/api/institutes/dashboard", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch("/api/institutes/students", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : []
      ),
    ])
      .then(([d, s]) => {
        setDashboard(d ?? null);
        setStudents(Array.isArray(s) ? s : []);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/institutes/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: addName.trim(),
          email: addEmail.trim() || undefined,
          age: addAge ? parseInt(addAge, 10) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to add");
      setAddName("");
      setAddEmail("");
      setAddAge("");
      load();
    } catch {
      setError("Failed to add student");
    } finally {
      setAdding(false);
    }
  };

  const handleStartTest = async (studentId: string) => {
    setStartingTest(studentId);
    try {
      const res = await fetch("/api/institutes/tests/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.path) window.location.href = data.path;
    } catch {
      setError("Failed to start test");
    } finally {
      setStartingTest(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome {dashboard?.name ?? "Institute"}
        </h1>
      </header>

      {/* Section 1 — Metrics */}
      <section id="metrics">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dashboard?.totalStudents ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-600">Tests Conducted</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dashboard?.testsConducted ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-600">Career Tests</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dashboard?.careerTests ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-600">Psychometric Tests</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dashboard?.psychometricTests ?? 0}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — Students list */}
      <section id="students">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Students</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Student Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Age
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No students yet. Add one below.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="py-3 px-4 text-gray-900">{s.name}</td>
                      <td className="py-3 px-4 text-gray-600">{s.email ?? "—"}</td>
                      <td className="py-3 px-4 text-gray-600">{s.age ?? "—"}</td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleStartTest(s.id)}
                          disabled={startingTest !== null}
                          className="rounded-lg bg-purple-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                        >
                          {startingTest === s.id ? "Redirecting…" : "Start Career Test"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 3 — Add Student */}
      <section id="start">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Student</h2>
        <div className="bg-white rounded-xl shadow p-6 max-w-md">
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age (optional)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={addAge}
                onChange={(e) => setAddAge(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="rounded-lg bg-purple-600 text-white px-4 py-2 font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {adding ? "Adding…" : "Add Student"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
