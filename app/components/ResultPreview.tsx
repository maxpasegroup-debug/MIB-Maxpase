"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const scores = [
  { label: "Stress Score", value: 42, max: 100, color: "bg-amber-500" },
  { label: "Confidence Score", value: 68, max: 100, color: "bg-emerald-500" },
  { label: "Emotional Balance", value: 75, max: 100, color: "bg-blue-500" },
];

export default function ResultPreview() {
  return (
    <section id="result-preview" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          Sample result preview
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-12"
        >
          A glimpse of what your mind report looks like.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100 transition-all duration-300 hover:shadow-xl"
        >
          <div className="space-y-8">
            {scores.map((s, i) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>{s.label}</span>
                  <span>{s.value}/{s.max}</span>
                </div>
                <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(s.value / s.max) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.12 }}
                    className={`h-full rounded-full ${s.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Radar-style SVG */}
          <div className="mt-10 flex justify-center">
            <div className="w-52 h-52 sm:w-60 sm:h-60">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="50,12 88,50 50,88 12,50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                <polygon points="50,32 68,50 50,68 32,50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="50" x2="50" y2="12" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="50" x2="88" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="50" x2="12" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="50" x2="50" y2="88" stroke="#e5e7eb" strokeWidth="1" />
                <motion.polygon
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  points="50,56 70,50 50,44 30,50"
                  fill="rgba(168, 85, 247, 0.3)"
                  stroke="rgb(168, 85, 247)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link href="/mobile/tests">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-8 py-4 text-white font-semibold shadow-xl"
              >
                See Your Mind Report
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
