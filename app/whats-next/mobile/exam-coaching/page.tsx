"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import {
  HiOutlineAcademicCap,
  HiOutlineClipboardDocumentList,
  HiOutlineFire,
  HiOutlineChartBar,
  HiOutlineCalendar,
  HiOutlineSparkles,
} from "react-icons/hi2";

const TABS = [
  { id: "exam", label: "My Exam", icon: HiOutlineAcademicCap },
  { id: "mission", label: "Daily Mission", icon: HiOutlineCalendar },
  { id: "practice", label: "Practice", icon: HiOutlineFire },
  { id: "mock", label: "Mock Test", icon: HiOutlineClipboardDocumentList },
  { id: "performance", label: "Performance", icon: HiOutlineChartBar },
];

export default function MobileExamCoachingPage() {
  const [tab, setTab] = useState("exam");
  const [intelligence, setIntelligence] = useState<{
    examName: string;
    examId: string;
    readinessScore: number;
    predictedRank: string;
  } | null>(null);
  const [dailyMission, setDailyMission] = useState<{
    examId: string;
    examName: string;
    missionId: string;
    completed: boolean;
    tasks: { title: string; target: number; unit: string }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/exams/list")
      .then((r) => r.json())
      .then((groups: { exams: { id: string; name: string }[] }[]) => {
        const firstExam = groups?.[0]?.exams?.[0];
        if (!firstExam) return;
        return fetch(`/api/exams/performance?examId=${encodeURIComponent(firstExam.id)}`).then((r) => r.json()).then((data) => {
          if (data.readiness) {
            setIntelligence({
              examName: firstExam.name,
              examId: firstExam.id,
              readinessScore: data.readiness.readinessScore,
              predictedRank: data.rankPrediction?.rankRange ?? data.readiness.predictedRank,
            });
          }
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/exams/list")
      .then((r) => r.json())
      .then((groups: { exams: { id: string; name: string }[] }[]) => {
        const firstExam = groups?.[0]?.exams?.[0];
        if (!firstExam) return;
        return fetch("/api/exams/missions/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId: firstExam.id, userId: "guest" }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.missionId && data.missionData?.tasks) {
              setDailyMission({
                examId: firstExam.id,
                examName: firstExam.name,
                missionId: data.missionId,
                completed: !!data.completed,
                tasks: data.missionData.tasks,
              });
            }
          });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-md p-4 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Exam Coaching Arena</h1>
        <p className="text-gray-500 text-sm mt-0.5">AI-powered exam training</p>
      </div>

      {dailyMission && (
        <Link href={`${WHATS_NEXT_BASE}/exam-coaching/${dailyMission.examId}`}>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-amber-50 border border-amber-200 shadow-lg p-4 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <HiOutlineCalendar className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Today&apos;s Training Mission</p>
              <p className="text-xs text-gray-500 mt-0.5">{dailyMission.examName}</p>
              {dailyMission.completed ? (
                <p className="text-sm text-emerald-600 font-medium mt-2">Completed</p>
              ) : (
                <ul className="mt-2 space-y-0.5 text-xs text-gray-600">
                  {dailyMission.tasks.slice(0, 3).map((t, i) => (
                    <li key={i}>{t.title}: {t.target} {t.unit}</li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-purple-600 font-medium mt-2">Start Training →</p>
            </div>
          </motion.div>
        </Link>
      )}

      {intelligence && (
        <Link href={`/exam-coaching/performance/${intelligence.examId}`}>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-lg p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <HiOutlineSparkles className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Exam Intelligence</p>
              <p className="text-xs text-gray-500 truncate">{intelligence.examName}</p>
              <p className="text-sm mt-1">
                <span className="font-semibold text-purple-600">Readiness: {intelligence.readinessScore}%</span>
                {" · "}
                <span className="font-medium text-gray-700">Rank: {intelligence.predictedRank}</span>
              </p>
            </div>
          </motion.div>
        </Link>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/80 border border-gray-200 text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "exam" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <p className="text-gray-600 text-sm">Select an exam to start.</p>
          <Link href={`${WHATS_NEXT_BASE}/exam-coaching`}>
            <div className="rounded-xl bg-white/80 backdrop-blur-md border border-white/60 shadow-lg p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <HiOutlineAcademicCap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Exam directory</h3>
                <p className="text-sm text-gray-500">Categories & exams</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {tab === "mission" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-gray-600 text-sm">Your daily training mission.</p>
          {dailyMission ? (
            <Link href={`${WHATS_NEXT_BASE}/exam-coaching/${dailyMission.examId}`}>
              <div className="rounded-xl bg-amber-50 border border-amber-200 shadow-lg p-5">
                <p className="font-semibold text-gray-900">Today&apos;s Training Mission</p>
                <p className="text-xs text-gray-500 mt-0.5">{dailyMission.examName}</p>
                {!dailyMission.completed && (
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {dailyMission.tasks.map((t, i) => (
                      <li key={i}>{t.title}: {t.target} {t.unit}</li>
                    ))}
                  </ul>
                )}
                {dailyMission.completed && <p className="text-sm text-emerald-600 font-medium mt-2">Completed</p>}
                <p className="mt-3 text-purple-600 text-sm font-medium">Open exam dashboard →</p>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl bg-white/80 border border-white/60 shadow-lg p-5">
              <p className="text-gray-500 text-sm">Complete a diagnostic or practice session to get a personalised daily plan.</p>
              <Link href={`${WHATS_NEXT_BASE}/exam-coaching`} className="mt-3 inline-block text-purple-600 text-sm font-medium">
                Go to Exam Coaching →
              </Link>
            </div>
          )}
        </motion.div>
      )}

      {tab === "practice" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-gray-600 text-sm">Start a practice session.</p>
          <Link href={`${WHATS_NEXT_BASE}/exam-coaching`}>
            <div className="rounded-xl bg-white/80 border border-white/60 shadow-lg p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <HiOutlineFire className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Training Arena</h3>
                <p className="text-sm text-gray-500">Practice · Mock · Speed drill</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {tab === "mock" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-gray-600 text-sm">Take a full mock test.</p>
          <Link href={`${WHATS_NEXT_BASE}/exam-coaching`}>
            <div className="rounded-xl bg-white/80 border border-white/60 shadow-lg p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <HiOutlineClipboardDocumentList className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Mock test</h3>
                <p className="text-sm text-gray-500">Choose exam → Start mock</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {tab === "performance" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-gray-600 text-sm">View your performance analytics.</p>
          <Link href={`${WHATS_NEXT_BASE}/exam-coaching`}>
            <div className="rounded-xl bg-white/80 border border-white/60 shadow-lg p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <HiOutlineChartBar className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Performance</h3>
                <p className="text-sm text-gray-500">Accuracy · Speed · Readiness</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      <Link href={`${WHATS_NEXT_BASE}/mobile`} className="inline-block text-sm text-purple-600 font-medium mt-4">
        ← Back to Home
      </Link>
    </div>
  );
}
