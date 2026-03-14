"use client";

import { motion } from "framer-motion";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineChartBar,
  HiOutlineSparkles,
} from "react-icons/hi2";

const steps = [
  {
    icon: HiOutlineClipboardDocumentList,
    title: "Take a short assessment",
    description: "Answer simple questions at your own pace.",
  },
  {
    icon: HiOutlineChartBar,
    title: "Discover your mind profile",
    description: "See your trait scores and radar profile.",
  },
  {
    icon: HiOutlineSparkles,
    title: "Get AI powered insights",
    description: "Personalized interpretation and recommendations.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 mb-4"
        >
          How it works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 mb-16"
        >
          Three steps to understand your mind.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white shadow-xl mb-6"
              >
                <step.icon className="w-10 h-10" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-base text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
