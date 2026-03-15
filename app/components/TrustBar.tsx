"use client";

import { motion } from "framer-motion";
import {
  HiOutlineCpuChip,
  HiOutlineClipboardDocumentList,
  HiOutlineAcademicCap,
  HiOutlineLockClosed,
} from "react-icons/hi2";

const BADGES = [
  { icon: HiOutlineCpuChip, label: "AI Behavioral Intelligence" },
  { icon: HiOutlineClipboardDocumentList, label: "80 Question Assessment" },
  { icon: HiOutlineAcademicCap, label: "Used by Psychologists" },
  { icon: HiOutlineLockClosed, label: "Private & Secure" },
];

export default function TrustBar() {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/40">
      <div className="container mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-12"
        >
          Trusted Career Intelligence Platform
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-white/70 border border-white/60 flex items-center justify-center text-gray-500 mb-3">
                <badge.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-600">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
