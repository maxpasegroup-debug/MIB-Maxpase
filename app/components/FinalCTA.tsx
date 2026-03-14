"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: "linear-gradient(135deg, #a855f7 0%, #ec4899 30%, #f97316 60%, #3b82f6 100%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="absolute inset-0 bg-black/10" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
          backgroundSize: "200% 200%",
        }}
      />
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
          transition={{ delay: 0.15 }}
          className="mt-10"
        >
          <Link href="/mobile/tests">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block rounded-2xl bg-white text-purple-700 font-semibold text-lg px-10 py-4 shadow-xl hover:shadow-2xl"
            >
              Start Free Assessment
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
