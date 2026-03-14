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
        {/* Logo with subtle radial glow behind */}
        <div className="flex justify-center mb-6 relative">
          {/* Subtle radial glow behind logo */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden
          >
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white/20 blur-3xl" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <Image
              src="/logo.png"
              alt="What's Next Logo"
              width={176}
              height={176}
              className="w-32 h-32 sm:w-44 sm:h-44 object-contain transition-opacity duration-500"
              priority
            />
          </motion.div>
        </div>

        {/* Brand title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-5xl sm:text-6xl font-bold text-white tracking-tight"
        >
          What&apos;s Next
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-2 text-lg italic text-gray-400"
        >
          Make it Beautiful
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 text-3xl sm:text-4xl font-semibold text-white max-w-3xl mx-auto leading-tight"
        >
          Understand Your Mind.
          <br />
          Improve Your Life.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-4 text-base text-gray-400 max-w-xl mx-auto"
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
          <Link
            href="/mobile/tests"
            className="inline-flex items-center justify-center rounded-xl px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
          >
            Free Assessment
          </Link>
          <Link
            href="/career-intelligence"
            className="inline-flex items-center justify-center rounded-xl px-8 py-3 border border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300"
          >
            Career Intelligence
          </Link>
        </motion.div>

        {/* Feature bullets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-gray-400"
        >
          <span className="flex items-center gap-2">
            <span className="text-emerald-400">✔</span> Quick psychological assessment
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald-400">✔</span> Behavioral science insights
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald-400">✔</span> Used by counsellors and educators
          </span>
        </motion.div>
      </div>
    </section>
  );
}
