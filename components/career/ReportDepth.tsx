"use client";

import { motion } from "framer-motion";

const DEPTH_ITEMS = [
  {
    title: "Behavioral Intelligence",
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Cognitive Pattern Analysis",
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Career Probability Modeling",
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8v8M3 21h18M3 10v11V3h8v7H3z" />
      </svg>
    ),
  },
];

export default function ReportDepth() {
  return (
    <motion.section
      className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.4 }}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Report Depth</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DEPTH_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex flex-col items-center text-center p-4 rounded-lg border border-gray-100 bg-gray-50/50"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.1, duration: 0.35 }}
          >
            <span className="mb-2" aria-hidden>
              {item.icon}
            </span>
            <span className="text-sm font-medium text-gray-800">{item.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
