"use client";

import { motion } from "framer-motion";

interface IdentityRevealProps {
  archetype: string;
  description: string;
}

export default function IdentityReveal({ archetype, description }: IdentityRevealProps) {
  return (
    <motion.section
      className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-10 text-center overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-transparent to-indigo-50/60 pointer-events-none" aria-hidden />
      <div className="relative">
        <motion.p
          className="text-lg sm:text-xl text-gray-500 uppercase tracking-wide mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          You Are
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-900 text-center tracking-tight mb-6"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
        >
          {archetype}
        </motion.h2>
        <motion.p
          className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.section>
  );
}
