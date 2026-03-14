"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 cta-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-black/5" />
      <div className="relative z-10 container mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-md"
        >
          Start Understanding Your Mind Today
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <Link href="/mobile/tests">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block px-10 py-4 rounded-full bg-white text-purple-700 font-semibold text-lg shadow-xl hover:shadow-2xl"
          >
            Start Free Test
          </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
