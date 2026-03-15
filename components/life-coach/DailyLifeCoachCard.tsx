"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

interface LifeCoachData {
  message: string;
  habits: string[];
  date?: string;
}

interface DailyLifeCoachCardProps {
  /** Compact layout for mobile */
  compact?: boolean;
}

export default function DailyLifeCoachCard({ compact }: DailyLifeCoachCardProps) {
  const [data, setData] = useState<LifeCoachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/life-coach/today", { credentials: "include" })
      .then((r) => {
        if (!r.ok) {
          setError(true);
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setData({ message: d.message, habits: d.habits ?? [], date: d.date });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className={
          compact
            ? "rounded-2xl shadow-lg bg-white/80 backdrop-blur-md p-4 border border-white/60 transition-all duration-300 hover:shadow-xl"
            : "rounded-2xl shadow-lg border border-white/60 bg-white/80 backdrop-blur-md p-6 transition-all duration-300 hover:shadow-xl"
        }
      >
        <div className="flex items-center gap-2 text-gray-500">
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">Daily Life Coach</span>
        </div>
        <p className="text-gray-400 text-sm mt-2">Loading your daily guidance…</p>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const habits = Array.isArray(data.habits) ? data.habits : [];

  return (
    <div
      className={
        compact
          ? "rounded-2xl shadow-lg bg-white/80 backdrop-blur-md p-4 border border-white/60 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
          : "rounded-2xl shadow-lg border border-white/60 bg-white/80 backdrop-blur-md p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
      }
    >
      <div className="flex items-center gap-2 text-purple-700 mb-3">
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span className="font-semibold text-gray-900">Daily Life Coach</span>
      </div>
      <p className="text-gray-700 text-sm sm:text-base">{data.message}</p>
      {habits.length > 0 && (
        <ul className={`mt-4 space-y-1.5 ${compact ? "text-sm" : ""}`}>
          {habits.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600">
              <span className="text-purple-500 shrink-0">•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
