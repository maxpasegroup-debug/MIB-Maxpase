"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

interface StudentPerformanceItem {
  studentId: string;
  name: string;
  email: string | null;
  readinessScore: number | null;
  accuracy: number | null;
  speed: number | null;
  weakTopics: string[];
  examName: string | null;
}

interface AnalyticsData {
  totalStudents: number;
  activeTrainees: number;
  avgReadiness: number;
  topPerformers: { studentId: string; studentName: string; readiness: number; accuracy: number }[];
}

interface ClassPerformanceData {
  topicMastery: { topicName: string; studentCount: number }[];
  weakSubjects: string[];
  averageAccuracy: number;
  averageSpeed: number;
  accuracyDistribution: { range: string; count: number }[];
}

export default function InstituteDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformanceItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [classPerf, setClassPerf] = useState<ClassPerformanceData | null>(null);
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
      fetch("/api/institutes/students-performance", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : []
      ),
      fetch("/api/institutes/analytics", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch("/api/institutes/class-performance", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null
      ),
    ])
      .then(([d, s, sp, a, cp]) => {
        setDashboard(d ?? null);
        setStudents(Array.isArray(s) ? s : []);
        setStudentPerformance(Array.isArray(sp) ? sp : []);
        setAnalytics(a ?? null);
        setClassPerf(cp ?? null);
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

  const getPerformance = (studentId: string) =>
    studentPerformance.find((p) => p.studentId === studentId);

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
          Welcome, {dashboard?.name ?? "Institute"}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Institution Intelligence Network</p>
      </header>

      {/* Institute Overview */}
      <section id="overview">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Institute Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analytics?.totalStudents ?? dashboard?.totalStudents ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-600">Active Trainees (30d)</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {analytics?.activeTrainees ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-600">Avg. Readiness</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analytics?.avgReadiness != null ? `${analytics.avgReadiness}%` : "—"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-600">Career Tests</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dashboard?.careerTests ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-600">Tests Conducted</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dashboard?.testsConducted ?? 0}
            </p>
          </div>
        </div>
      </section>

      {/* Class Analytics + Top Performers + Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Class Analytics</h2>
          <div className="bg-white rounded-xl shadow p-5">
            {classPerf && classPerf.accuracyDistribution.some((d) => d.count > 0) ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classPerf.accuracyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7c3aed" name="Students" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-8 text-center">
                Accuracy distribution will appear once students have exam performance data.
              </p>
            )}
            {classPerf && (
              <p className="text-xs text-gray-500 mt-2">
                Avg accuracy: {classPerf.averageAccuracy}% · Avg speed: {classPerf.averageSpeed}%
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h2>
          <div className="bg-white rounded-xl shadow p-5">
            {analytics?.topPerformers?.length ? (
              <ul className="space-y-2">
                {analytics.topPerformers.slice(0, 5).map((p, i) => (
                  <li key={p.studentId} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {i + 1}. {p.studentName}
                    </span>
                    <span className="font-medium text-purple-600">{p.readiness}% readiness</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm py-4">No performance data yet.</p>
            )}
          </div>
        </section>
      </div>

      {/* Weak Topics */}
      {classPerf && classPerf.weakSubjects.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weak Topics (class-wide)</h2>
          <div className="bg-white rounded-xl shadow p-5 flex flex-wrap gap-2">
            {classPerf.weakSubjects.slice(0, 10).map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Students list */}
      <section id="students">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Students</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Student Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Readiness</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Accuracy</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Weak Topics</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No students yet. Add one below.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => {
                    const perf = getPerformance(s.id);
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50"
                      >
                        <td className="py-3 px-4 text-gray-900">{s.name}</td>
                        <td className="py-3 px-4 text-gray-600">{s.email ?? "—"}</td>
                        <td className="py-3 px-4">
                          {perf?.readinessScore != null ? (
                            <span className="font-medium text-purple-600">{perf.readinessScore}%</span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {perf?.accuracy != null ? `${perf.accuracy}%` : "—"}
                        </td>
                        <td className="py-3 px-4">
                          {perf?.weakTopics?.length ? (
                            <span className="text-amber-700 text-xs">
                              {perf.weakTopics.slice(0, 2).join(", ")}
                              {perf.weakTopics.length > 2 ? "…" : ""}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          <Link
                            href={`/institutes/students/${s.id}`}
                            className="rounded-lg bg-gray-100 text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-200"
                          >
                            View Student Insights
                          </Link>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add Student */}
      <section id="start">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Student</h2>
        <div className="bg-white rounded-xl shadow p-6 max-w-md">
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age (optional)</label>
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
