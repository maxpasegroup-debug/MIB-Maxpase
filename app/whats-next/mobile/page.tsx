"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import { Brain, GraduationCap, MessageCircle, User, Trophy } from "lucide-react";
import DailyLifeCoachCard from "@/components/life-coach/DailyLifeCoachCard";

export default function MobileHome() {
  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 p-6 text-gray-900 shadow-xl"
      >
        <h1 className="text-2xl font-bold">MIB – Thathaastu</h1>
        <p className="text-gray-600 italic mt-0.5">Make it Beautiful</p>
      </motion.section>

      {/* Daily Life Coach */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 }}
      >
        <DailyLifeCoachCard compact />
      </motion.section>

      {/* Card sections */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-4"
      >
        <Link href={`${WHATS_NEXT_BASE}/mobile/tests`} className="block min-h-[80px]">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-md p-5 flex items-center gap-4 border border-white/60 transition-all duration-300 hover:shadow-xl min-h-[80px]"
          >
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">Psychological Tests</h2>
              <p className="text-sm text-gray-500">Assess stress, personality, and more</p>
            </div>
          </motion.div>
        </Link>

        <Link href={`${WHATS_NEXT_BASE}/career-intelligence/start`} className="block min-h-[80px]">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-md p-5 flex items-center gap-4 border border-white/60 transition-all duration-300 hover:shadow-xl min-h-[80px]"
          >
            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">Career Intelligence Test</h2>
              <p className="text-sm text-gray-500">₹499 · 10D career profiling</p>
            </div>
          </motion.div>
        </Link>

        <Link href={`${WHATS_NEXT_BASE}/dashboard/mentor`} className="block min-h-[80px]">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-md p-5 flex items-center gap-4 border border-white/60 transition-all duration-300 hover:shadow-xl min-h-[80px]"
          >
            <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">AI Mentor</h2>
              <p className="text-sm text-gray-500">Chat for career guidance</p>
            </div>
          </motion.div>
        </Link>

        <Link href={`${WHATS_NEXT_BASE}/mobile/exam-coaching`} className="block min-h-[80px]">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-md p-5 flex items-center gap-4 border border-white/60 transition-all duration-300 hover:shadow-xl min-h-[80px]"
          >
            <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">Exam Coaching Arena</h2>
              <p className="text-sm text-gray-500">Diagnostic · Practice · Mock test</p>
            </div>
          </motion.div>
        </Link>

        <Link href={`${WHATS_NEXT_BASE}/mobile/guidance`} className="block min-h-[80px]">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-md p-5 flex items-center gap-4 border border-white/60 transition-all duration-300 hover:shadow-xl min-h-[80px]"
          >
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">Talk to Psychologist</h2>
              <p className="text-sm text-gray-500">Book a counselling session</p>
            </div>
          </motion.div>
        </Link>
      </motion.section>
    </div>
  );
}
