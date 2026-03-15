"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineArrowDownTray, HiOutlineShare } from "react-icons/hi2";
import {
  CAREER_DIMENSIONS,
  SAMPLE_CAREER_SCORES,
  getTopStrengths,
  getScoreInterpretation,
  type CareerIntelligenceScores,
} from "@/lib/career-intelligence";
import { getCareerClusters } from "@/lib/careerClusters";
import { generateCareerRoadmap } from "@/lib/careerRoadmap";
import {
  getComparisonMetaForCareers,
  getCareerComparisonMeta,
  getSkillGapStatus,
} from "@/lib/career-comparison";
import type { CareerReportData } from "@/lib/career-service";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import { StrengthCards, CareerClusterCards, CareerRoadmapTimeline, CareerComparisonSection, FutureCareerSimulationSection, SkillGapAnalysisSection, CareerOutlookCard, ShareableCard } from "./components";
import { ReportSkeleton } from "@/components/ui/Skeleton";

const CareerRadarChart = dynamic(() => import("./components/CareerRadarChart").then((m) => ({ default: m.CareerRadarChart })), { ssr: false });
const AIInterpretationCard = dynamic(
  () => import("./components/AIInterpretationCard").then((m) => ({ default: m.AIInterpretationCard })),
  { ssr: false }
);

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

export default function CareerReportPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [reportData, setReportData] = useState<CareerReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    fetch(`/api/career/report/${sessionId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CareerReportData | null) => setReportData(data))
      .catch(() => setReportData(null))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const scores: CareerIntelligenceScores = reportData?.scores ?? SAMPLE_CAREER_SCORES;
  const radarData = buildRadarData(scores);
  const topStrengths = getTopStrengths(scores, 3);
  const careerClustersFromLib = getCareerClusters(scores);
  const careerClusters = reportData?.clusters?.length
    ? reportData.clusters.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        exampleRoles: c.exampleRoles ?? [],
        growthOutlook: c.growthOutlook,
      }))
    : careerClustersFromLib.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        exampleRoles: c.example_roles ?? [],
        growthOutlook: c.growth_outlook,
      }));
  const roadmapSteps = reportData?.roadmaps?.[0]?.steps?.length
    ? reportData.roadmaps[0].steps.map((s) => ({
        step: s.step,
        title: s.title,
        description: s.description,
        skills: s.skills,
      }))
    : generateCareerRoadmap(careerClustersFromLib[0]?.name ?? "Product Design");

  const displayName = reportData?.session?.name ?? "Report User";
  const displayAge = reportData?.session?.age != null ? `${reportData.session.age}` : "18–25";
  const assessmentDate =
    reportData?.session?.createdAt != null
      ? new Date(reportData.session.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  const primaryStrength = topStrengths[0]?.label ?? "—";

  const strengthItems = topStrengths.map((s) => {
    const dim = CAREER_DIMENSIONS.find((d) => d.key === s.key);
    const band = getScoreInterpretation(s.score);
    return {
      key: s.key,
      label: s.label,
      score: s.score,
      explanation: dim ? `${dim.measures} — ${band}` : `${band} in this area.`,
    };
  });

  const comparisonCareers = getComparisonMetaForCareers(
    careerClusters.map((c) => c.name)
  );
  const firstCareerName = careerClusters[0]?.name ?? "Product Design";
  const firstCareerMeta = getCareerComparisonMeta(firstCareerName);
  const topStrengthLabels = topStrengths.map((s) => s.label);
  const skillGapRows = firstCareerMeta
    ? firstCareerMeta.skills.map((skill) => ({
        skill,
        status: getSkillGapStatus(skill, topStrengthLabels),
      }))
    : [];

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "MIB Career Intelligence Report",
          text: "My Career Intelligence Report — Make Your Career Beautiful",
          url: window.location.href,
        });
      } catch {
        await navigator.clipboard?.writeText(window.location.href);
      }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent px-4 py-8">
        <div className="container mx-auto max-w-6xl space-y-6">
          <ReportSkeleton />
          <ReportSkeleton />
          <ReportSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent career-report-print">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* Top bar: Back + Download/Share — print hidden */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 print:hidden">
          <Link
            href={`${WHATS_NEXT_BASE}/career-intelligence`}
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            ← Back to Career Intelligence
          </Link>
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={handleShare}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-purple-200 bg-white px-5 py-2.5 text-purple-700 font-semibold hover:bg-purple-50 transition-colors"
            >
              <HiOutlineShare className="w-5 h-5" />
              Share Report
            </motion.button>
            <motion.button
              type="button"
              onClick={handleDownloadPDF}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              <HiOutlineArrowDownTray className="w-5 h-5" />
              Download PDF Report
            </motion.button>
          </div>
        </div>

        {/* ——— Section 1: Report Header ——— */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Career Intelligence Report
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Your personalized career profile based on MIB&apos;s 10-Dimensional Career Intelligence Model.
          </p>
        </motion.header>

        {/* ——— Section 1b: Profile card (gradient) ——— */}
        <motion.section {...fadeUp} className="mb-16">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-8 sm:p-10 shadow-xl max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white">
              <div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Name</p>
                <p className="font-bold text-lg mt-1">{displayName}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Age</p>
                <p className="font-bold text-lg mt-1">{displayAge}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Assessment Date</p>
                <p className="font-bold text-lg mt-1">{assessmentDate}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Primary Strength</p>
                <p className="font-bold text-lg mt-1">{primaryStrength}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ——— Section 2: Career Radar Profile ——— */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Career Intelligence Profile
          </h2>
          <CareerRadarChart data={radarData} />
        </motion.section>

        {/* ——— Section 3: Strength Zones ——— */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Key Strength Areas
          </h2>
          <StrengthCards strengths={strengthItems} />
        </motion.section>

        {/* ——— Section 4: Career Clusters ——— */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            Recommended Career Paths
          </h2>
          <CareerClusterCards clusters={careerClusters} />
        </motion.section>

        {/* ——— Section 4b: Compare Your Career Options ——— */}
        {comparisonCareers.length > 0 && (
          <motion.section {...fadeUp} className="mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Compare Your Career Options
            </h2>
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-6 sm:p-8">
              <CareerComparisonSection careers={comparisonCareers} />
            </div>
          </motion.section>
        )}

        {/* ——— Section 4c: Future Career Simulation ——— */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            Future Career Simulation
          </h2>
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-6 sm:p-8">
            <FutureCareerSimulationSection
              careerName={firstCareerName}
              steps={roadmapSteps}
            />
          </div>
        </motion.section>

        {/* ——— Section 5: Career Roadmap ——— */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Career Development Roadmap
          </h2>
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-6 sm:p-8">
            <CareerRoadmapTimeline
              steps={roadmapSteps}
              clusterName={careerClusters[0]?.name}
            />
          </div>
        </motion.section>

        {/* ——— Section 5b: Skill Gap Analysis ——— */}
        {skillGapRows.length > 0 && (
          <motion.section {...fadeUp} className="mb-16">
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-6 sm:p-8 max-w-2xl mx-auto">
              <SkillGapAnalysisSection
                careerName={firstCareerName}
                rows={skillGapRows}
              />
            </div>
          </motion.section>
        )}

        {/* ——— Section 5c: Career Outlook (for parents) ——— */}
        {firstCareerMeta && (
          <motion.section {...fadeUp} className="mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Career Outlook
            </h2>
            <div className="max-w-2xl mx-auto">
              <CareerOutlookCard
                careerName={firstCareerMeta.name}
                demand={firstCareerMeta.futureDemand}
                salaryRange={firstCareerMeta.salaryRange}
                industryGrowth={firstCareerMeta.industryGrowth}
              />
            </div>
          </motion.section>
        )}

        {/* ——— Section 6: AI Career Insight ——— */}
        {reportData?.report?.aiSummary ? (
          <motion.section {...fadeUp} className="mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              AI Career Interpretation
            </h2>
            <AIInterpretationCard text={reportData.report.aiSummary} />
          </motion.section>
        ) : (
          <motion.section {...fadeUp} className="mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              AI Career Interpretation
            </h2>
            <AIInterpretationCard
              text="Your results suggest strong creativity and leadership potential. You appear comfortable generating ideas and influencing people. These traits align well with careers in product design, marketing strategy, and entrepreneurship."
            />
          </motion.section>
        )}

        {/* ——— Section 6b: Shareable profile card (viral) ——— */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            Share Your Career Profile
          </h2>
          <ShareableCard
            topStrengths={topStrengths.map((s) => s.label)}
            recommendedCareers={careerClusters.map((c) => c.name)}
            onShare={handleShare}
          />
        </motion.section>

        {/* ——— Section 7: Guidance Recommendation ——— */}
        <motion.section {...fadeUp} className="mb-16">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-8 sm:p-10 text-center text-white shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Need Career Guidance?
            </h2>
            <p className="text-white/95 max-w-xl mx-auto text-lg">
              Career decisions can be challenging. Speaking with a professional career mentor can help you gain clarity.
            </p>
            <Link href={`${WHATS_NEXT_BASE}/mobile/guidance`}>
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block mt-6 rounded-2xl bg-white text-purple-600 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-shadow"
              >
                Book Career Guidance Session
              </motion.span>
            </Link>
          </div>
        </motion.section>

        {/* ——— Section 8: Download Report ——— */}
        <motion.section {...fadeUp} className="print:hidden">
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-8 text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Save or share your report
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                type="button"
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 text-gray-700 font-semibold hover:border-purple-200 hover:bg-purple-50 transition-colors"
              >
                <HiOutlineShare className="w-5 h-5" />
                Share Report
              </motion.button>
              <motion.button
                type="button"
                onClick={handleDownloadPDF}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                <HiOutlineArrowDownTray className="w-5 h-5" />
                Download PDF Report
              </motion.button>
            </div>
          </div>
        </motion.section>

        <p className="text-center text-gray-400 text-sm mt-8 print:hidden">
          MIB Career Intelligence™ — Make Your Career Beautiful with AI-Powered Career Intelligence · Session: {sessionId}
        </p>
      </div>
    </main>
  );
}
