"use client";

import { motion } from "framer-motion";
import { HiOutlineBolt, HiOutlineMagnifyingGlassCircle } from "react-icons/hi2";

const tests = [
  {
    icon: HiOutlineBolt,
    title: "Rapid Mind Check",
    duration: "15 minutes",
    questions: "35 questions",
    button: "Start Quick Test",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: HiOutlineMagnifyingGlassCircle,
    title: "Deep Psychological Assessment",
    duration: "60 minutes",
    questions: "100 questions",
    button: "Start Detailed Test",
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function TestTypes() {
  return (
    <section id="test-types" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          Test Types
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-12"
        >
          Choose the depth that fits you.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tests.map((test, i) => (
            <motion.div
              key={test.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl p-8 sm:p-10 bg-white shadow-xl border-2 border-purple-200/50 glow-border"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${test.gradient} text-white mb-6`}>
                <test.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{test.title}</h3>
              <p className="text-gray-600 mb-1">{test.duration}</p>
              <p className="text-gray-600 mb-8">{test.questions}</p>
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${test.gradient} text-white font-semibold shadow-lg`}
              >
                {test.button}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
