"use client";

import { motion } from "framer-motion";
import { HiOutlineBriefcase } from "react-icons/hi2";
import Link from "next/link";

export default function ProfessionalSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/60 p-8 sm:p-12"
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
            <Link href="/school-dashboard">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-6 py-3 font-semibold shadow-md"
              >
                Professional Dashboard
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
