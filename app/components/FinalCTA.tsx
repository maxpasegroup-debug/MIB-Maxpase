"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/40">
      {/* Soft light halos (reduced blur on mobile) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-purple-400/20 blur-[80px] sm:blur-[120px] rounded-full top-[-100px] left-[20%]" />
        <div className="absolute w-[450px] h-[450px] bg-pink-400/20 blur-[80px] sm:blur-[120px] rounded-full bottom-[-120px] right-[10%]" />
        <div className="absolute w-[400px] h-[400px] bg-orange-400/20 blur-[80px] sm:blur-[120px] rounded-full top-[100px] right-[25%]" />
      </div>
      <div className="relative z-10 container mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900"
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
          className="mt-12"
        >
          <Link
            href="/career-intelligence/start"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold text-lg px-12 py-5 shadow-2xl hover:scale-105 transition-transform"
          >
            Start Free Assessment
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
