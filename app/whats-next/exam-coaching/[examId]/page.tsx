"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineFire,
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineCalendarDays,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import CoachFeedback from "@/components/exam/CoachFeedback";

interface Exam {
  id: string;
  name: string;
  description: string | null;
  difficulty: string | null;
  duration: number | null;
  totalQuestions: number | null;
}

export default function ExamDashboardPage() {
  const params = useParams();
  const examId = params.examId as string;
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingDiagnostic, setStartingDiagnostic] = useState(false);
  const [startingTraining, setStartingTraining] = useState<string | null>(null);
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [intelligence, setIntelligence] = useState<{ readinessScore: number; predictedRank: string; rankRange?: string } | null>(null);
  const [dailyMission, setDailyMission] = useState<{
    missionId: string;
    completed: boolean;
    missionData: { tasks: { type: string; title: string; target: number; unit: string; focus?: string }[] };
  } | null>(null);
  const [completingMission, setCompletingMission] = useState(false);
  const [missionCompleteMessage, setMissionCompleteMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;
    fetch("/api/exams/list")
      .then((r) => r.json())
      .then((groups: { exams: Exam[] }[]) => {
        for (const g of groups) {
          const found = g.exams.find((e) => e.id === examId);
          if (found) {
            setExam(found);
            break;
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [examId]);

  useEffect(() => {
    if (!examId) return;
    fetch(`/api/exams/performance?examId=${encodeURIComponent(examId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.readiness) {
          setIntelligence({
            readinessScore: data.readiness.readinessScore,
            predictedRank: data.readiness.predictedRank,
            rankRange: data.rankPrediction?.rankRange,
          });
        }
      })
      .catch(() => {});
  }, [examId]);

  useEffect(() => {
    if (!examId) return;
    fetch("/api/exams/missions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId, userId: "guest" }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.missionId && data.missionData) {
          setDailyMission({
            missionId: data.missionId,
            completed: !!data.completed,
            missionData: data.missionData,
          });
        }
      })
      .catch(() => {});
  }, [examId]);

  const handleCompleteMission = async () => {
    if (!dailyMission?.missionId || dailyMission.completed) return;
    setCompletingMission(true);
    try {
      const res = await fetch("/api/exams/missions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId: dailyMission.missionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to complete");
      setDailyMission((m) => (m ? { ...m, completed: true } : m));
      setMissionCompleteMessage(
        [data.coachMessage, data.pointsEarned ? `+${data.pointsEarned} growth points` : null, data.streak ? `Streak: ${data.streak}d` : null]
            .filter(Boolean)
            .join("\n\n")
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setCompletingMission(false);
    }
  };

  const handleStartDiagnostic = async () => {
    setStartingDiagnostic(true);
    try {
      const res = await fetch("/api/exams/diagnostic/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start");
      const { sessionId, questions } = data;
      if (sessionId && Array.isArray(questions)) {
        try {
          sessionStorage.setItem(
            `exam_diagnostic_${sessionId}`,
            JSON.stringify({ examId, questions, type: "diagnostic" })
          );
        } catch {}
        window.location.href = `/exam-coaching/train/${sessionId}`;
        return;
      }
      throw new Error("Invalid response");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setStartingDiagnostic(false);
    }
  };

  const handleStartTraining = async (sessionType: string) => {
    setStartingTraining(sessionType);
    try {
      const res = await fetch("/api/exams/training/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest",
          examId,
          sessionType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start");
      const { sessionId, questions } = data;
      if (sessionId && Array.isArray(questions)) {
        try {
          sessionStorage.setItem(
            `exam_training_${sessionId}`,
            JSON.stringify({ examId, questions, type: sessionType })
          );
        } catch {}
        window.location.href = `/exam-coaching/train/${sessionId}`;
        return;
      }
      throw new Error("Invalid response");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setStartingTraining(null);
    }
  };

  if (loading || !exam) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <Link href={`${WHATS_NEXT_BASE}/exam-coaching`} className="text-sm text-purple-600 font-medium hover:underline mb-6 inline-block">
          ← Exam Coaching Arena
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{exam.name}</h1>
        {exam.description && (
          <p className="mt-1 text-gray-600">{exam.description}</p>
        )}

        {intelligence && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-xl p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-purple-600" />
              Exam Intelligence
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              {exam.name} — readiness and rank prediction
            </p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Readiness</p>
                <p className="text-2xl font-bold text-purple-600">{intelligence.readinessScore}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Predicted Rank</p>
                <p className="text-xl font-bold text-gray-900">{intelligence.rankRange ?? intelligence.predictedRank}</p>
              </div>
            </div>
            <Link
              href={`/exam-coaching/performance/${examId}`}
              className="mt-3 inline-block text-sm font-medium text-purple-600 hover:underline"
            >
              View full performance →
            </Link>
          </motion.section>
        )}

        {/* Today's Mission */}
        {dailyMission && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl bg-white/90 backdrop-blur-xl border border-amber-100 shadow-xl p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <HiOutlineCalendarDays className="w-5 h-5 text-amber-600" />
              Today&apos;s Mission
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Daily AI-generated training. Complete to earn growth points and build your streak.
            </p>
            <ul className="space-y-2 mb-4">
              {dailyMission.missionData.tasks?.map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">{t.title}:</span>
                  <span className="text-gray-600">{t.target} {t.unit}</span>
                  {t.focus && <span className="text-amber-700 text-xs">({t.focus})</span>}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleStartTraining("practice")}
                disabled={startingTraining !== null}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 shadow disabled:opacity-50"
              >
                {startingTraining ? "Starting…" : "Start Training"}
              </button>
              {!dailyMission.completed && (
                <button
                  type="button"
                  onClick={handleCompleteMission}
                  disabled={completingMission}
                  className="rounded-xl border border-emerald-500 text-emerald-700 font-medium px-5 py-2.5 hover:bg-emerald-50 disabled:opacity-50 flex items-center gap-2"
                >
                  <HiOutlineCheckBadge className="w-4 h-4" />
                  {completingMission ? "Completing…" : "Mark complete"}
                </button>
              )}
              {dailyMission.completed && (
                <span className="rounded-xl bg-emerald-100 text-emerald-800 px-4 py-2.5 text-sm font-medium flex items-center gap-2">
                  <HiOutlineCheckBadge className="w-4 h-4" /> Completed
                </span>
              )}
            </div>
            {missionCompleteMessage && (
              <div className="mt-4 p-4 rounded-xl bg-white/80 border border-purple-100 text-sm text-gray-700 whitespace-pre-wrap">
                {missionCompleteMessage}
              </div>
            )}
          </motion.section>
        )}

        {/* Start Diagnostic Test */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <HiOutlineClipboardDocumentList className="w-5 h-5 text-purple-600" />
            Start Diagnostic Test
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Get a baseline and identify weak areas.
          </p>
          <button
            type="button"
            onClick={handleStartDiagnostic}
            disabled={startingDiagnostic}
            className="rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold px-6 py-3 shadow-lg hover:scale-105 transition-transform disabled:opacity-70"
          >
            {startingDiagnostic ? "Starting…" : "Start diagnostic"}
          </button>
        </motion.section>

        {/* Training Arena */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <HiOutlineFire className="w-5 h-5 text-orange-500" />
            Training Arena
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Practice drills, mock tests, and topic-focused sessions.
          </p>
          <div className="flex flex-wrap gap-3">
            {["practice", "mock_test", "mock_exam", "speed_drill"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleStartTraining(type)}
                disabled={startingTraining !== null}
                className="rounded-xl border border-gray-300 bg-white/70 px-4 py-2.5 text-sm font-medium text-gray-700 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {startingTraining === type ? "Starting…" : type === "mock_exam" ? "Mock exam (100q)" : type.replace("_", " ")}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Performance */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <Link href={`/exam-coaching/performance/${examId}`}>
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <HiOutlineChartBar className="w-5 h-5 text-purple-600" />
                Performance
              </h2>
              <p className="text-gray-600 text-sm">
                View accuracy trend, topic mastery, speed, and readiness score.
              </p>
            </div>
          </Link>
        </motion.section>

        {/* AI Coach Feedback */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8"
        >
          <CoachFeedback
            examId={examId}
            onMessage={setCoachMessage}
            message={coachMessage}
          />
        </motion.section>
      </div>
    </main>
  );
}
