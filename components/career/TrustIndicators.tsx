"use client";

import { motion } from "framer-motion";

const INDICATORS = [
  {
    icon: (
      <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    text: "AI Behavioral Analysis",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    text: "80 Question Assessment",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8v8M3 21h18M3 10v11V3h8v7H3z" />
      </svg>
    ),
    text: "Career Intelligence Model",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: "Used by Counselors",
  },
];

export default function TrustIndicators() {
  return (
    <motion.div
      className="flex flex-row flex-wrap justify-center gap-6 text-sm text-gray-500 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.4 }}
    >
      {INDICATORS.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2"
        >
          <span className="flex-shrink-0" aria-hidden>
            {item.icon}
          </span>
          <span>{item.text}</span>
        </div>
      ))}
    </motion.div>
  );
}
