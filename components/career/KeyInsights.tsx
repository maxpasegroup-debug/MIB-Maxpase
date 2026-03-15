"use client";

import { motion } from "framer-motion";

interface KeyInsightsProps {
  careerIndex: number;
  topStrength: string;
  topPercentile?: string;
}

export default function KeyInsights({ careerIndex, topStrength, topPercentile = "Top 15% Potential" }: KeyInsightsProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.45 }}
    >
      <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <p className="text-sm font-medium text-gray-500 mb-1">Career Intelligence Index</p>
        <p className="text-3xl font-bold text-purple-600">{Math.round(careerIndex)} / 100</p>
        <p className="text-xs text-gray-500 mt-2">{topPercentile}</p>
      </div>
      <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <p className="text-sm font-medium text-gray-500 mb-1">Top Strength</p>
        <p className="text-xl font-bold text-gray-900">{topStrength}</p>
      </div>
    </motion.div>
  );
}
