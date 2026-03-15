"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

interface Summary {
  points: number;
  level: number;
  streak: number;
  progressToNextLevel: number;
  pointsToNextLevel: number;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  completed: boolean;
}

const BADGES: { level: number; name: string }[] = [
  { level: 5, name: "Mind Explorer" },
  { level: 10, name: "Life Architect" },
];

export default function MobileGrowthPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const load = () => {
    setUnauth(false);
    Promise.all([
      fetch("/api/growth/summary", { credentials: "include" }).then((r) => {
        if (r.status === 401) {
          setUnauth(true);
          return null;
        }
        return r.ok ? r.json() : null;
      }),
      fetch("/api/growth/missions", { credentials: "include" }).then((r) => {
        if (r.status === 401) return [];
        return r.ok ? r.json() : [];
      }),
    ])
      .then(([s, m]) => {
        setSummary(s ?? null);
        setMissions(Array.isArray(m) ? m : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleComplete = async (missionId: string) => {
    setCompletingId(missionId);
    try {
      const res = await fetch("/api/growth/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ missionId }),
      });
      if (res.ok) load();
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md p-4 space-y-6">
        <h1 className="text-xl font-semibold text-gray-900">Growth</h1>
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (unauth) {
    return (
      <div className="mx-auto max-w-md p-4 space-y-6">
        <h1 className="text-xl font-semibold text-gray-900">Growth</h1>
        <p className="text-purple-600 font-medium">
          Small steps today build a beautiful future.
        </p>
        <div className="rounded-xl shadow-md bg-white p-6 border border-gray-100">
          <p className="text-gray-600 mb-4">Sign in to track your growth and complete missions.</p>
          <Link
            href={`${WHATS_NEXT_BASE}/login`}
            className="inline-block rounded-xl bg-purple-600 text-white px-4 py-3 font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-semibold text-gray-900">Growth</h1>
        <p className="text-purple-600 font-medium mt-0.5">
          Small steps today build a beautiful future.
        </p>
      </motion.div>

      {summary && (
        <>
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl shadow-md bg-white p-4 border border-gray-100"
          >
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Level</p>
                <p className="text-xl font-bold text-gray-900">{summary.level}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Points</p>
                <p className="text-xl font-bold text-gray-900">{summary.points}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Streak</p>
                <p className="text-xl font-bold text-gray-900">{summary.streak}d</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>To Level {summary.level + 1}</span>
                <span>{summary.pointsToNextLevel} pts</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${summary.progressToNextLevel * 100}%` }}
                />
              </div>
            </div>
          </motion.section>

          {BADGES.filter((b) => summary.level >= b.level).length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl shadow-md bg-white p-4 border border-gray-100"
            >
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Badges</h2>
              <div className="flex flex-wrap gap-2">
                {BADGES.filter((b) => summary.level >= b.level).map((b) => (
                  <span
                    key={b.level}
                    className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800"
                  >
                    {b.name}
                  </span>
                ))}
              </div>
            </motion.section>
          )}
        </>
      )}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Missions</h2>
        <div className="space-y-3">
          {missions.map((m) => (
            <div
              key={m.id}
              className="rounded-xl shadow-md bg-white p-4 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900">{m.title}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{m.description}</p>
              <p className="text-xs text-purple-600 mt-1">{m.points} pts</p>
              {m.completed ? (
                <span className="inline-block mt-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                  Completed
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleComplete(m.id)}
                  disabled={completingId !== null}
                  className="mt-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {completingId === m.id ? "…" : "Complete Mission"}
                </button>
              )}
            </div>
          ))}
        </div>
        {missions.length === 0 && !summary && (
          <p className="text-gray-500 text-sm">No missions available.</p>
        )}
      </motion.section>
    </div>
  );
}
