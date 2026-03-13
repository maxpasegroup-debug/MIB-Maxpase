"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiOutlineBolt, HiOutlineSparkles, HiOutlineHeart } from "react-icons/hi2";

const MOCK_SCORES = { stress: 42, confidence: 68, emotional: 75 };

const RECOMMENDED = [
  { id: "stress", title: "Stress & Anxiety", gradient: "from-violet-500 to-purple-600", icon: "🧠" },
  { id: "confidence", title: "Confidence", gradient: "from-amber-400 to-orange-500", icon: "💪" },
  { id: "relationship", title: "Relationships", gradient: "from-pink-500 to-rose-600", icon: "❤️" },
];

export default function MobileHome() {
  return (
    <div className="px-4 py-6 space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-2"
      >
        <h1 className="text-xl font-semibold text-gray-900">Hello, welcome back.</h1>
        <p className="text-gray-500 text-sm mt-0.5">Here’s your mind at a glance.</p>
      </motion.section>

      {/* Mind Score summary */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white p-5 shadow-lg border border-gray-100"
      >
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Mind Score</h2>
        <div className="space-y-4">
          {[
            { label: "Stress", value: MOCK_SCORES.stress, icon: HiOutlineBolt, color: "bg-amber-500" },
            { label: "Confidence", value: MOCK_SCORES.confidence, icon: HiOutlineSparkles, color: "bg-emerald-500" },
            { label: "Emotional Balance", value: MOCK_SCORES.emotional, icon: HiOutlineHeart, color: "bg-blue-500" },
          ].map((item, i) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Quick action */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/mobile/tests">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4 text-white text-center font-semibold shadow-lg"
          >
            Start New Assessment
          </motion.div>
        </Link>
      </motion.section>

      {/* Recommended tests - horizontal scroll */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Recommended for you</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {RECOMMENDED.map((card, i) => (
            <Link key={card.id} href="/mobile/tests">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className={`flex-shrink-0 w-40 rounded-2xl bg-gradient-to-br ${card.gradient} p-4 text-white shadow-md`}
              >
                <span className="text-2xl">{card.icon}</span>
                <p className="font-semibold text-sm mt-2">{card.title}</p>
                <p className="text-white/80 text-xs mt-0.5">Quick check</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
