"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import {
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineExclamationTriangle,
  HiOutlineDocumentText,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer as RadarResponsiveContainer,
  Tooltip as RadarTooltip,
} from "recharts";
import type { SchoolDashboardData } from "@/lib/school-dashboard";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const BAR_COLORS = ["#9333ea", "#ec4899", "#f97316", "#06b6d4", "#10b981"];

export default function SchoolDashboardPage() {
  const [data, setData] = useState<SchoolDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/school-dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 font-medium"
        >
          Loading dashboard…
        </motion.p>
      </main>
    );
  }

  const dashboard = data ?? {
    totalStudents: 0,
    topStrengthCluster: "—",
    studentsNeedingGuidance: 0,
    careerDomainDistribution: [],
    classTalentProfile: {},
    students: [],
  };

  const radarData = Object.entries(dashboard.classTalentProfile).map(
    ([subject, value]) => ({ subject, value: value as number, fullMark: 100 })
  );

  return (
    <main className="min-h-screen bg-transparent">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            MIB Career Intelligence for Schools
          </h1>
          <p className="mt-2 text-gray-600">
            Helping schools guide every student toward the right career path.
          </p>
        </motion.header>

        {/* ——— Overview Cards ——— */}
        <motion.section
          {...fadeUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-100 p-3">
                <HiOutlineUserGroup className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Students Assessed
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboard.totalStudents}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-pink-100 p-3">
                <HiOutlineSparkles className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Top Strength Cluster
                </p>
                <p className="text-xl font-bold text-gray-900 truncate">
                  {dashboard.topStrengthCluster}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-100 p-3">
                <HiOutlineExclamationTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Students Needing Guidance
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboard.studentsNeedingGuidance}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* ——— Career Domain Distribution ——— */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Career Domain Distribution
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Top recommended career clusters across assessed students.
            </p>
            {dashboard.careerDomainDistribution.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboard.careerDomainDistribution}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                      {dashboard.careerDomainDistribution.map((_, i) => (
                        <Cell
                          key={i}
                          fill={BAR_COLORS[i % BAR_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-8 text-center">
                No career data yet. Run assessments to see distribution.
              </p>
            )}
          </motion.section>

          {/* ——— Class Talent Profile (Radar) ——— */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Class Career Profile
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Average scores across 10 dimensions (class-level).
            </p>
            {radarData.length > 0 ? (
              <div className="h-72">
                <RadarResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 10, fill: "#4b5563" }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                    />
                    <Radar
                      name="Average"
                      dataKey="value"
                      stroke="#9333ea"
                      fill="#9333ea"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                    <RadarTooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  </RadarChart>
                </RadarResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-8 text-center">
                No assessment data yet.
              </p>
            )}
          </motion.section>
        </div>

        {/* ——— Student List + Counselor View ——— */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <HiOutlineDocumentText className="w-5 h-5 text-purple-600" />
              Student Talent Mapping
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Click a row to open the full Career Intelligence report (Counselor view).
            </p>
          </div>
          <div className="overflow-x-auto">
            {dashboard.students.length > 0 ? (
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Top Strength
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Recommended Career Cluster
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Guidance Needed
                    </th>
                    <th className="w-10 py-3 px-2" aria-label="Open report" />
                  </tr>
                </thead>
                <tbody>
                  {dashboard.students.map((student, i) => (
                    <motion.tr
                      key={student.sessionId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 * i }}
                      className="border-t border-gray-100 hover:bg-purple-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {student.topStrength}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {student.recommendedCluster}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            student.guidanceNeeded
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {student.guidanceNeeded ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Link
                          href={`/career-intelligence/report/${student.sessionId}`}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                          title="Open full report"
                        >
                          <HiOutlineArrowTopRightOnSquare className="w-5 h-5" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <HiOutlineUserGroup className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No students assessed yet.</p>
                <Link
                  href={`${WHATS_NEXT_BASE}/career-intelligence`}
                  className="mt-3 inline-block text-purple-600 font-medium hover:underline"
                >
                  Run Career Intelligence assessments →
                </Link>
              </div>
            )}
          </div>
        </motion.section>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center text-sm text-gray-500"
        >
          MIB Career Intelligence for Schools · Data-driven career counseling
        </motion.footer>
      </div>
    </main>
  );
}
