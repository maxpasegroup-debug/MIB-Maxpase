"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MOBILE_BREAKPOINT = 768;

export default function HeroSection() {
  const router = useRouter();

  const handleExploreAssessments = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT) {
      router.push("/mobile/tests");
    } else {
      router.push("/tests");
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-transparent py-16 lg:py-24">
      <div className="relative overflow-hidden w-full">
        {/* Soft light halos (reduced blur on mobile) */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-purple-400/20 blur-[80px] sm:blur-[120px] rounded-full top-[-100px] left-[20%]" />
          <div className="absolute w-[450px] h-[450px] bg-pink-400/20 blur-[80px] sm:blur-[120px] rounded-full bottom-[-120px] right-[10%]" />
          <div className="absolute w-[400px] h-[400px] bg-orange-400/20 blur-[80px] sm:blur-[120px] rounded-full top-[100px] right-[25%]" />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy + CTAs */}
            <div className="text-center lg:text-left space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                What&apos;s Next by MIB — Make it Beautiful
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl font-bold tracking-tight leading-tight text-gray-900"
              >
                Discover Your Career Intelligence
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Take a free AI-powered 80-question assessment to understand your personality, strengths, and future career possibilities.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/career-intelligence/start"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold px-8 py-4 shadow-lg hover:scale-105 transition-transform"
                >
                  Start Free Career Intelligence Test
                </Link>
                <button
                  type="button"
                  onClick={handleExploreAssessments}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white/70 text-gray-700 font-semibold px-8 py-4 hover:scale-105 transition-transform"
                >
                  Explore Assessments
                </button>
              </motion.div>
            </div>

            {/* Right: Floating dashboard preview card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Report preview
                </p>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl font-bold text-purple-600">72</span>
                  <span className="text-sm text-gray-600">Career Intelligence Index</span>
                </div>
                {/* Mini radar preview */}
                <div className="h-40 flex items-center justify-center rounded-xl bg-gray-50/80 border border-gray-100">
                  <svg viewBox="0 0 100 100" className="w-28 h-28 text-purple-400/60">
                    <polygon
                      points="50,15 85,50 50,85 15,50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <polygon
                      points="50,35 65,50 50,65 35,50"
                      fill="rgba(124,58,237,0.15)"
                      stroke="rgba(124,58,237,0.5)"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Identity archetype</span>
                  <br />
                  <span className="text-gray-600">Creative problem-solver</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
