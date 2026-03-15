"use client";

import { motion } from "framer-motion";
import { HiOutlineBriefcase } from "react-icons/hi2";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

export default function ProfessionalSection() {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/40">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-12 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-purple-100/80 mb-6">
                <HiOutlineBriefcase className="w-10 h-10 text-purple-700" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                For Psychologists and Counselors
              </h2>
              <p className="text-gray-700 text-lg max-w-xl">
                Use structured psychological assessments and generate professional
                reports for your clients.
              </p>
            </div>
            <Link href={`${WHATS_NEXT_BASE}/school-dashboard`}>
              <span className="inline-block rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-6 py-3 font-semibold shadow-lg hover:scale-105 transition-transform">
                Professional Dashboard
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
