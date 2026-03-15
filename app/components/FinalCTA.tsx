"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Stronger splash background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20" />
        <div className="absolute w-[600px] h-[600px] bg-purple-400/25 blur-[140px] rounded-full -top-40 left-1/4" />
        <div className="absolute w-[500px] h-[500px] bg-pink-400/25 blur-[120px] rounded-full bottom-0 right-1/4" />
        <div className="absolute w-[400px] h-[400px] bg-orange-400/20 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="relative z-10 container mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900"
        >
          Discover Your Career Intelligence
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-lg text-gray-600"
        >
          Take the free 80-question assessment and unlock your report.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-10"
        >
          <Link
            href="/career-intelligence/start"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold text-lg px-12 py-5 shadow-xl hover:scale-[1.03] transition-transform"
          >
            Start Free Assessment
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
