"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import IdentityReveal from "@/components/career/IdentityReveal";
import KeyInsights from "@/components/career/KeyInsights";
import ReportDepthPreview from "@/components/career/ReportDepthPreview";
import TrustIndicators from "@/components/career/TrustIndicators";
import ReportUnlock from "@/components/career/ReportUnlock";
import FullCareerReport from "@/components/career/FullCareerReport";
import type { ExpertSummary } from "@/components/career/ExpertInterpretationFunnel";

export type ReportPreview = {
  careerIndex: number;
  primaryCluster: string;
  topStrength: string;
  topStrengthScore?: number;
};

interface Career10DResultClientProps {
  sessionId: string;
  traitScores: Record<string, number>;
  cluster: string;
  aiReport: string;
  roadmap: import("@/lib/careerRoadmap").RoadmapStep[];
  potentialProfile: import("@/lib/careerPotential").PotentialProfile | null;
  gapAnalysis: import("@/lib/careerGapAnalysis").GapItem[];
  careerIndex: number | null;
  probabilities: import("@/lib/careerProbability").CareerProbabilityItem[];
  reportLocked: boolean;
  identity: import("@/lib/careerIdentity").CareerIdentity | null;
  preview: ReportPreview | null;
  experts: ExpertSummary[];
}

export default function Career10DResultClient({
  sessionId,
  traitScores,
  cluster,
  aiReport,
  roadmap,
  potentialProfile,
  gapAnalysis,
  careerIndex,
  probabilities,
  reportLocked,
  identity,
  preview,
  experts,
}: Career10DResultClientProps) {
  return (
    <div className="space-y-10">
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Your Career Intelligence Report
        </h1>
        <p className="mt-2 text-gray-600">
          AI-powered 10D career profile
        </p>
      </header>

      {reportLocked ? (
        <>
          {/* Preview funnel: Identity → Key Insights → Depth Preview → Trust → Paywall */}
          {identity && (
            <IdentityReveal archetype={identity.archetype} description={identity.description} />
          )}
          {preview && (
            <KeyInsights
              careerIndex={preview.careerIndex}
              topStrength={preview.topStrength}
              topPercentile="Top 15% Potential"
            />
          )}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <ReportDepthPreview
              traitScores={traitScores}
              potentialProfile={potentialProfile}
              probabilities={probabilities}
              roadmap={roadmap}
            />
          </motion.div>
          <TrustIndicators />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.4 }}
          >
            <ReportUnlock sessionId={sessionId} />
          </motion.div>
          <div className="pt-4">
            <Link
              href="/career-intelligence"
              className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700"
            >
              Back to Career Intelligence
            </Link>
          </div>
        </>
      ) : (
        <FullCareerReport
          sessionId={sessionId}
          traitScores={traitScores}
          cluster={cluster}
          aiReport={aiReport}
          roadmap={roadmap}
          potentialProfile={potentialProfile}
          gapAnalysis={gapAnalysis}
          careerIndex={careerIndex}
          probabilities={probabilities}
          identity={identity}
          experts={experts}
        />
      )}
    </div>
  );
}
