"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

const MOBILE_BREAKPOINT = 768;

// Unsplash student / career imagery (high-quality, royalty-free)
const HERO_IMAGES = [
  { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80", alt: "Students studying together" },
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80", alt: "Career discussion" },
  { src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80", alt: "Student thinking" },
];

export default function HeroSection() {
  const router = useRouter();

  const handleExploreAssessments = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT) {
      router.push(`${WHATS_NEXT_BASE}/mobile/tests`);
    } else {
      router.push(`${WHATS_NEXT_BASE}/tests`);
    }
  };

  return (
    <section className="relative min-h-[90vh] w-full flex items-center overflow-hidden bg-transparent py-16 lg:py-24">
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/50 to-orange-50/60" />
        <div className="absolute w-[500px] h-[500px] bg-purple-400/20 blur-[80px] sm:blur-[120px] rounded-full top-[-100px] left-[20%]" />
        <div className="absolute w-[450px] h-[450px] bg-pink-400/20 blur-[80px] sm:blur-[120px] rounded-full bottom-[-120px] right-[10%]" />
        <div className="absolute w-[400px] h-[400px] bg-orange-400/20 blur-[80px] sm:blur-[120px] rounded-full top-[100px] right-[25%]" />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Headline, subtext, CTAs */}
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
              className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-gray-900"
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
                href={`${WHATS_NEXT_BASE}/career-intelligence/start`}
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

          {/* Right: Student / career photos with soft overlay */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-full max-w-lg mx-auto lg:mx-0"
          >
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              {HERO_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] ${
                    i === 0 ? "col-span-2" : ""
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
