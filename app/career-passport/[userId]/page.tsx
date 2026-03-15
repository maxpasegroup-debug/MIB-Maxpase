"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckBadge,
  HiOutlineChartBar,
  HiOutlineUser,
} from "react-icons/hi2";
import {
  CAREER_DIMENSIONS,
  SAMPLE_CAREER_SCORES,
  getTopStrengths,
  type CareerIntelligenceScores,
} from "@/lib/career-intelligence";
import { generateCareerRoadmap } from "@/lib/careerRoadmap";
import { CareerRadarChart, CareerClusterCards, CareerRoadmapTimeline } from "@/app/career-intelligence/report/[sessionId]/components";
import type { CareerReportData } from "@/lib/career-service";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.5 },
};

function buildRadarData(scores: CareerIntelligenceScores) {
  return CAREER_DIMENSIONS.map((d) => ({
    subject: d.label,
    value: scores[d.key] ?? 0,
    fullMark: 100,
  }));
}

/** Simulated previous score for growth bar (e.g. current - 6). When we have multiple assessments, use real delta. */
function getGrowthBars(scores: CareerIntelligenceScores) {
  return CAREER_DIMENSIONS.slice(0, 6).map((d) => {
    const current = scores[d.key] ?? 0;
    const previous = Math.max(0, current - 6);
    return {
      label: d.label,
      current,
      previous,
      improved: current > previous,
    };
  });
}

export default function CareerPassportPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [data, setData] = useState<(CareerReportData & { passportId?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`/api/career/passport/${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const scores: CareerIntelligenceScores = data?.scores ?? SAMPLE_CAREER_SCORES;
  const radarData = buildRadarData(scores);
  const topStrengths = getTopStrengths(scores, 4);
  const clusters = data?.clusters?.length
    ? data.clusters.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        exampleRoles: c.exampleRoles ?? [],
        growthOutlook: c.growthOutlook,
      }))
    : [
        { id: "pd", name: "Product Design", description: "UX/UI, design systems", exampleRoles: ["UI/UX Designer"], growthOutlook: "High" },
        { id: "dm", name: "Digital Marketing", description: "Content, analytics", exampleRoles: ["Marketing Strategist"], growthOutlook: "High" },
        { id: "en", name: "Entrepreneurship", description: "Startups, leadership", exampleRoles: ["Founder"], growthOutlook: "Very High" },
      ];
  const roadmapSteps = data?.roadmaps?.[0]?.steps?.length
    ? data.roadmaps[0].steps.map((s) => ({ step: s.step, title: s.title, description: s.description, skills: s.skills }))
    : generateCareerRoadmap(clusters[0]?.name ?? "Product Design");
  const growthBars = getGrowthBars(scores);
  const passportId = data?.passportId ?? `MIB-CP-${userId?.slice(-8)?.toUpperCase() ?? "DEMO"}`;
  const assessmentDate = data?.session?.createdAt
    ? new Date(data.session.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const displayName = data?.session?.name ?? "Career Passport Holder";

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 font-medium">
          Loading your Career Passport…
        </motion.p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-8 print:hidden">
          <Link
            href="/career-intelligence"
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            ← Back to Career Intelligence
          </Link>
        </div>

        {/* ——— 1. Profile Header ——— */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600/90 via-pink-500/90 to-orange-400/90 px-6 py-8 sm:p-10">
              <div className="flex flex-wrap items-center gap-6">
                <div className="rounded-2xl bg-white/20 backdrop-blur p-4">
                  <HiOutlineUser className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{displayName}</h1>
                  <p className="text-white/90 mt-1 font-mono text-sm">Passport ID: {passportId}</p>
                  <p className="text-white/80 text-sm mt-2">Assessment date: {assessmentDate}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ——— 2. Career Intelligence Scores (Radar) ——— */}
        <motion.section {...fadeUp} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineChartBar className="w-6 h-6 text-purple-600" />
            Career Intelligence Scores
          </h2>
          <CareerRadarChart data={radarData} />
        </motion.section>

        {/* ——— 3. Strength Areas ——— */}
        <motion.section {...fadeUp} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Strength Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topStrengths.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-lg p-5 border-l-4 border-l-purple-500"
              >
                <p className="font-bold text-gray-900">{s.label}</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mt-1">
                  {s.score}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ——— 4. Recommended Career Clusters ——— */}
        <motion.section {...fadeUp} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Career Clusters</h2>
          <CareerClusterCards clusters={clusters} />
        </motion.section>

        {/* ——— 5. Career Growth Tracker ——— */}
        <motion.section {...fadeUp} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineAcademicCap className="w-6 h-6 text-purple-600" />
            Career Growth Tracker
          </h2>
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-6 sm:p-8">
            <p className="text-sm text-gray-600 mb-6">
              Current 10D scores. Retake the assessment to see improvement over time.
            </p>
            <div className="space-y-4">
              {growthBars.map((bar, i) => (
                <motion.div
                  key={bar.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{bar.label}</span>
                    <span className="text-gray-600">{bar.current}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.current}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ——— 6. Skill Certifications (badges) ——— */}
        <motion.section {...fadeUp} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineCheckBadge className="w-6 h-6 text-purple-600" />
            Skill Certifications
          </h2>
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-6 sm:p-8">
            <p className="text-sm text-gray-600 mb-6">
              Strengths identified from your Career Intelligence assessment.
            </p>
            <div className="flex flex-wrap gap-3">
              {topStrengths.map((s, i) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200/60 px-4 py-3 flex items-center gap-2"
                >
                  <HiOutlineCheckBadge className="w-5 h-5 text-purple-600 shrink-0" />
                  <span className="font-semibold text-gray-900">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ——— 7. Career Roadmap ——— */}
        <motion.section {...fadeUp}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Career Roadmap</h2>
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-6 sm:p-8">
            <CareerRoadmapTimeline steps={roadmapSteps} clusterName={clusters[0]?.name} />
          </div>
        </motion.section>

        <p className="text-center text-gray-400 text-sm mt-12 print:hidden">
          MIB Career Intelligence™ · Career Passport · {passportId}
        </p>
      </div>
    </main>
  );
}
