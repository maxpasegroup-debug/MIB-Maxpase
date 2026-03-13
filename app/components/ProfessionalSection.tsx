"use client";

import { motion } from "framer-motion";
import { HiOutlineBriefcase } from "react-icons/hi2";
import Link from "next/link";

export default function ProfessionalSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl shadow-xl bg-gradient-to-br from-slate-800 to-purple-900 p-8 sm:p-12 text-white border border-white/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-white/10 mb-6">
                <HiOutlineBriefcase className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                For Psychologists and Counselors
              </h2>
              <p className="text-white/85 text-lg max-w-xl">
                Use structured psychological assessments and generate professional
                reports for your clients.
              </p>
            </div>
            <Link href="/">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block rounded-2xl bg-white text-slate-900 px-6 py-3 font-semibold shadow-lg"
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
