"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

const PREVIEW_CARDS = [
  { title: "10D Radar", subtitle: "Your 10 dimensions at a glance" },
  { title: "Potential Profile", subtitle: "Current vs growth potential" },
  { title: "Career Probability", subtitle: "Top career fits" },
  { title: "Life Path Simulation", subtitle: "Roadmap and next steps" },
];

export default function ResultPreview() {
  return (
    <section id="result-preview" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/40">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4"
        >
          Inside Your Career Intelligence Report
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 mb-12 max-w-2xl mx-auto"
        >
          A glimpse of what you unlock after the assessment.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {PREVIEW_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 blur-sm opacity-70 hover:opacity-90 hover:blur-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{card.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href={`${WHATS_NEXT_BASE}/career-intelligence/start`}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold px-8 py-4 shadow-lg hover:scale-105 transition-transform"
          >
            Start Free Assessment
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
