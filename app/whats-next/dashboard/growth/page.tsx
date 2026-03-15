"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { sectionSpacing, sectionHeaderClass, typography, dividerClass } from "@/styles/designSystem";

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

export default function GrowthPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const load = () => {
    Promise.all([
      fetch("/api/growth/summary", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch("/api/growth/missions", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : []
      ),
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
      <div className={sectionSpacing}>
        <h1 className={typography.h1}>Growth</h1>
        <p className={typography.caption}>Loading…</p>
      </div>
    );
  }

  return (
    <div className={sectionSpacing}>
      <header>
        <h1 className={typography.h1}>Psychological Growth</h1>
        <p className="text-purple-600 font-medium">Small steps today build a beautiful future.</p>
      </header>

      {summary && (
        <>
          <section>
            <Card>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className={typography.caption}>Level</p>
                    <p className={typography.h2}>{summary.level}</p>
                  </div>
                  <div>
                    <p className={typography.caption}>Total points</p>
                    <p className={typography.h2}>{summary.points}</p>
                  </div>
                  <div>
                    <p className={typography.caption}>Current streak</p>
                    <p className={typography.h2}>{summary.streak} days</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress to Level {summary.level + 1}</span>
                    <span>{summary.pointsToNextLevel} pts to go</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${summary.progressToNextLevel * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {BADGES.filter((b) => summary.level >= b.level).length > 0 && (
            <section className={dividerClass + " pt-6"}>
              <h2 className={sectionHeaderClass + " mb-4"}>Badges</h2>
              <Card>
                <div className="p-6 flex flex-wrap gap-3">
                  {BADGES.filter((b) => summary.level >= b.level).map((b) => (
                    <span
                      key={b.level}
                      className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800"
                    >
                      Level {b.level} · {b.name}
                    </span>
                  ))}
                </div>
              </Card>
            </section>
          )}
        </>
      )}

      <section className={dividerClass + " pt-6"}>
        <h2 className={sectionHeaderClass + " mb-2"}>Missions</h2>
        <p className={typography.caption + " mb-4"}>Complete missions to earn points and level up.</p>
        <Card className="overflow-hidden" hoverScale={false}>
          <div className="divide-y divide-gray-50">
            {missions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No missions available.</div>
            ) : (
              missions.map((m) => (
                <div
                  key={m.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className={typography.h3}>{m.title}</h3>
                    <p className={typography.caption + " mt-0.5"}>{m.description}</p>
                    <p className="text-xs text-purple-600 mt-1">{m.points} pts</p>
                  </div>
                  <div className="shrink-0">
                    {m.completed ? (
                      <span className="inline-block rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                        Completed
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => handleComplete(m.id)}
                        disabled={completingId !== null}
                      >
                        {completingId === m.id ? "Completing…" : "Complete Mission"}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
