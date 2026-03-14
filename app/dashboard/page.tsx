"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileCard from "@/components/dashboard/ProfileCard";
import SkillRecommendations from "@/components/dashboard/SkillRecommendations";
import DailyLifeCoachCard from "@/components/life-coach/DailyLifeCoachCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DashboardSummarySkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { sectionSpacing, sectionHeaderClass, typography, dividerClass } from "@/styles/designSystem";

const CareerSummary = dynamic(() => import("@/components/dashboard/CareerSummary"), { ssr: false });

interface Summary {
  user: { name: string; email: string; role: string };
  latestSession: {
    sessionId: string;
    cluster: string;
    traitScores: Record<string, number>;
    roadmap: { step: number; title: string; description: string }[];
  } | null;
}

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/summary", { credentials: "include" })
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
      <div className={sectionSpacing}>
        <h1 className={typography.h1}>Dashboard</h1>
        <p className={typography.caption}>Loading your dashboard…</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardSummarySkeleton />
          <DashboardSummarySkeleton />
          <DashboardSummarySkeleton />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <h1 className={typography.h1}>Dashboard</h1>
        <p className="text-red-600">{error ?? "No data"}</p>
      </div>
    );
  }

  return (
    <div className={sectionSpacing}>
      <header>
        <h1 className={typography.h1}>Hello, {data.user.name}</h1>
        <p className={typography.caption}>Welcome to your career dashboard.</p>
      </header>

      <section>
        <DailyLifeCoachCard />
      </section>

      <section className={dividerClass + " pt-6"}>
        <h2 className={sectionHeaderClass + " mb-4"}>Career Profile Summary</h2>
        {data.latestSession ? (
          <CareerSummary
            cluster={data.latestSession.cluster}
            traitScores={data.latestSession.traitScores}
            sessionId={data.latestSession.sessionId}
          />
        ) : (
          <EmptyState
            title="No tests yet"
            description="Start your first assessment to see your career profile and roadmap here."
            actionLabel="Start Career Test"
            actionHref="/career-intelligence/start"
          />
        )}
      </section>

      {data.latestSession?.roadmap && data.latestSession.roadmap.length > 0 && (
        <section className={dividerClass + " pt-6"}>
          <h2 className={sectionHeaderClass + " mb-4"}>Career Roadmap</h2>
          <Card>
            <ol className="space-y-3 p-6">
              {data.latestSession.roadmap.map((step) => (
                <li key={step.step} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold flex items-center justify-center text-sm">
                    {step.step}
                  </span>
                  <span className={typography.body + " font-medium text-gray-900"}>{step.title}</span>
                </li>
              ))}
            </ol>
          </Card>
        </section>
      )}

      <section className={dividerClass + " pt-6"}>
        <h2 className={sectionHeaderClass + " mb-4"}>Recommended Skills</h2>
        <SkillRecommendations />
      </section>

      <section className={dividerClass + " pt-6"}>
        <h2 className={sectionHeaderClass + " mb-4"}>Guidance</h2>
        <Card>
          <div className="p-6">
            <p className={typography.body + " mb-4"}>Get personalised advice from a career expert.</p>
            <Link href="/guidance">
              <Button variant="primary">Talk to a Career Expert</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
