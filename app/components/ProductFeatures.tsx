"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import {
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleLeftRight,
  HiOutlineAcademicCap,
  HiOutlineTrophy,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

const FEATURES = [
  { icon: HiOutlineBriefcase, title: "Career Intelligence", description: "10D career profiling and AI-powered career discovery.", href: `${WHATS_NEXT_BASE}/career-intelligence` },
  { icon: HiOutlineClipboardDocumentList, title: "Psychological Assessments", description: "Structured tests for stress, confidence, relationships, and more.", href: `${WHATS_NEXT_BASE}/tests` },
  { icon: HiOutlineTrophy, title: "Exam Coaching Arena", description: "AI-powered exam training with diagnostics, coaching, and performance tracking.", href: `${WHATS_NEXT_BASE}/exam-coaching` },
  { icon: HiOutlineChatBubbleLeftRight, title: "AI Mentor", description: "Personalized guidance and reflection with AI.", href: `${WHATS_NEXT_BASE}/dashboard/mentor` },
  { icon: HiOutlineAcademicCap, title: "Expert Guidance", description: "Book sessions with psychologists and career counselors.", href: `${WHATS_NEXT_BASE}/guidance` },
  { icon: HiOutlineBuildingOffice2, title: "Institution Intelligence", description: "AI-powered exam training analytics for schools and coaching centres.", href: `${WHATS_NEXT_BASE}/institutes/register` },
];

export default function ProductFeatures() {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/40">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4"
        >
          Product Features
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 mb-14 max-w-2xl mx-auto"
        >
          One platform for mind, career, and growth.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={feature.href}>
                <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
