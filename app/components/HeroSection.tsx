"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MOBILE_BREAKPOINT = 768;

export default function HeroSection() {
  const router = useRouter();

  const handleFreeAssessmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT) {
      router.push("/mobile/tests");
    } else {
      router.push("/tests");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6 relative">
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
          className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight"
        >
          What&apos;s Next
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-2 text-lg italic text-gray-600"
        >
          Make it Beautiful
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 text-3xl sm:text-4xl font-semibold text-gray-800 max-w-3xl mx-auto leading-tight"
        >
          Understand Your Mind.
          <br />
          Improve Your Life.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-4 text-base text-gray-600 max-w-xl mx-auto"
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
          <button
            type="button"
            onClick={handleFreeAssessmentClick}
            className="inline-flex items-center justify-center rounded-xl px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold shadow-md hover:scale-105 transition-all duration-300"
          >
            Free Assessment
          </button>
          <Link
            href="/career-intelligence"
            className="inline-flex items-center justify-center rounded-xl px-8 py-3 bg-white/70 backdrop-blur-md border border-white/60 text-gray-800 font-semibold hover:bg-white/80 transition-all duration-300"
          >
            Career Intelligence
          </Link>
        </motion.div>

        {/* Feature bullets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-gray-600"
        >
          <span className="flex items-center gap-2">
            <span className="text-emerald-500">✔</span> Quick psychological assessment
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald-500">✔</span> Behavioral science insights
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald-500">✔</span> Used by counsellors and educators
          </span>
        </motion.div>
      </div>
    </section>
  );
}
