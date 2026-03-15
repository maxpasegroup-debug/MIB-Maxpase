"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

export default function CareerIntelligenceBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 sm:p-8 text-white text-center shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold">
            🚀 NEW — MIB Career Intelligence™
          </h2>
          <p className="mt-2 text-white/95">
            Discover your career direction with AI-powered 10D career profiling.
          </p>
          <p className="mt-3 text-lg font-semibold">
            Career Intelligence Test — ₹499
          </p>
          <Link href={`${WHATS_NEXT_BASE}/career-intelligence/start`}>
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block mt-4 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold shadow-lg"
            >
              Start Career Intelligence Test
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
