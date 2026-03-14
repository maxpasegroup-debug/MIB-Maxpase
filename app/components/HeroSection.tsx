"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const BLOB_COLORS = [
  "bg-purple-500/30",
  "bg-pink-500/30",
  "bg-blue-500/30",
  "bg-orange-500/30",
  "bg-cyan-500/20",
  "bg-yellow-400/20",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
      {/* Animated gradient blobs */}
      {BLOB_COLORS.map((color, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl w-[min(80vw,400px)] h-[min(80vw,400px)] ${color}`}
          style={{
            left: `${15 + (i * 14) % 70}%`,
            top: `${10 + (i * 17) % 70}%`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            rotate: [0, 15, -10, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo in glass card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <motion.div
            className="glass-card rounded-2xl p-5 shadow-xl flex items-center justify-center"
            animate={{ boxShadow: ["0 25px 50px -12px rgba(0,0,0,0.2)", "0 25px 50px -12px rgba(168,85,247,0.3)"] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          >
            <Image src="/logo.png" alt="MIB Logo" width={112} height={112} className="w-24 h-24 sm:w-28 sm:h-28 object-contain" priority />
          </motion.div>
        </motion.div>

        {/* Brand title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
        >
          MIB - Thathaastu
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-2 text-xl sm:text-2xl text-white/90 font-light italic"
        >
          Make it Beautiful
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 text-2xl sm:text-3xl md:text-4xl font-bold text-white max-w-3xl mx-auto leading-tight"
        >
          Understand Your Mind.
          <br />
          Improve Your Life.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-4 text-base text-white/85 max-w-xl mx-auto"
        >
          Scientific psychological tests for children, youth and adults.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/mobile"
              className="cta-primary-gradient inline-block rounded-2xl px-8 py-4 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-pink-500/25 transition-shadow"
            >
              Open Mobile App
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/mobile/tests"
              className="inline-block rounded-2xl px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-semibold text-lg border-2 border-white/40 hover:bg-white/25 transition-colors"
            >
              Start Free Assessment
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/#categories"
              className="inline-block rounded-2xl px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-semibold text-lg border-2 border-white/40 hover:bg-white/25 transition-colors"
            >
              Explore Life Areas
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-white/80"
        >
          <span className="flex items-center gap-2">
            <span className="text-emerald-400">✔</span> 2 minute quick assessment
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald-400">✔</span> Behavioral science insights
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald-400">✔</span> Used by counselors and educators
          </span>
        </motion.div>
      </div>
    </section>
  );
}
