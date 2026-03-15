"use client";

import { motion } from "framer-motion";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineSparkles,
  HiOutlineLockOpen,
} from "react-icons/hi2";

const steps = [
  {
    icon: HiOutlineClipboardDocumentList,
    title: "Take the Intelligence Test",
    description: "Answer 80 questions at your own pace. Free to start.",
  },
  {
    icon: HiOutlineSparkles,
    title: "Discover Your Career Identity",
    description: "See your 10D profile and archetype reveal.",
  },
  {
    icon: HiOutlineLockOpen,
    title: "Unlock Your Intelligence Report",
    description: "Get your full report, roadmap, and AI insights.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/40">
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 mb-14"
        >
          Three steps to your career intelligence.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white shadow-lg mb-5">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
