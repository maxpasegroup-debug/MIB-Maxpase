"use client";

import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi2";

interface AIInterpretationCardProps {
  text: string;
}

export function AIInterpretationCard({ text }: AIInterpretationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-xl p-6 sm:p-8 max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2.5">
          <HiOutlineSparkles className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          AI Career Interpretation
        </h2>
      </div>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </motion.div>
  );
}
