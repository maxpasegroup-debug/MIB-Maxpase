"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import {
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineLightBulb,
  HiOutlineExclamationTriangle,
  HiOutlineChartBar,
  HiOutlineMap,
  HiOutlineSparkles,
  HiOutlineCpuChip,
  HiOutlineBriefcase,
  HiOutlineHeart,
  HiOutlineBeaker,
  HiOutlineCube,
  HiOutlineStar,
} from "react-icons/hi2";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

const TEN_DIMENSIONS = [
  { label: "Cognitive Ability", icon: HiOutlineAcademicCap, gradient: "from-violet-500 to-purple-600" },
  { label: "Personality Style", icon: HiOutlineUserGroup, gradient: "from-pink-500 to-rose-600" },
  { label: "Motivation Drivers", icon: HiOutlineLightBulb, gradient: "from-amber-500 to-orange-500" },
  { label: "Emotional Intelligence", icon: HiOutlineHeart, gradient: "from-rose-500 to-pink-600" },
  { label: "Skills & Aptitude", icon: HiOutlineBeaker, gradient: "from-blue-500 to-indigo-600" },
  { label: "Technology Adaptability", icon: HiOutlineCpuChip, gradient: "from-cyan-500 to-teal-600" },
  { label: "Leadership Potential", icon: HiOutlineBriefcase, gradient: "from-emerald-500 to-green-600" },
  { label: "Creativity", icon: HiOutlineSparkles, gradient: "from-fuchsia-500 to-purple-600" },
  { label: "Work Environment Preference", icon: HiOutlineCube, gradient: "from-slate-500 to-slate-700" },
  { label: "Life Values", icon: HiOutlineStar, gradient: "from-amber-400 to-yellow-500" },
];

const PROBLEM_CARDS = [
  { title: "Too many career options", icon: HiOutlineExclamationTriangle },
  { title: "Family pressure", icon: HiOutlineUserGroup },
  { title: "Lack of self-awareness", icon: HiOutlineLightBulb },
  { title: "Fear of wrong decisions", icon: HiOutlineChartBar },
];

const REPORT_CARDS = [
  { title: "Strength Analysis", desc: "Discover your natural strengths", icon: HiOutlineChartBar },
  { title: "Career Mapping", desc: "See careers that fit your profile", icon: HiOutlineMap },
  { title: "Career Roadmap", desc: "Step-by-step guidance", icon: HiOutlineMap },
];

const RADAR_LABELS = ["Creativity", "Leadership", "Analytical Thinking", "Motivation", "Emotional Intelligence"];

export default function CareerIntelligencePage() {
  return (
    <main className="min-h-screen bg-transparent">
      {/* Section 1 — Hero + conversion */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-orange-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="relative container mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900"
          >
            Discover Your Career Intelligence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Take a free 80-question AI career intelligence test and discover your natural strengths, personality patterns, and future career paths.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600"
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Free 80-question assessment
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> AI-powered behavioral intelligence
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Used by psychologists & career mentors
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={`${WHATS_NEXT_BASE}/career-intelligence/start`}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-8 py-4 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              Start Free Career Intelligence Test
            </Link>
            <Link
              href={`${WHATS_NEXT_BASE}/#categories`}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white/70 px-8 py-4 text-gray-700 font-semibold hover:scale-105 transition-transform"
            >
              Explore Life Areas
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — The Problem */}
      <section className="py-16 lg:py-24 px-4 border-t border-white/40">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Choosing the Right Career is Hard
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {PROBLEM_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <card.icon className="w-10 h-10 text-purple-500 mb-3" />
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — The Solution */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Introducing MIB Career Intelligence™
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            A next-generation career discovery system powered by psychology,
            behavioral science and AI.
          </motion.p>
        </div>
      </section>

      {/* Section 4 — 10D Model (Life Areas) */}
      <section id="categories" className="py-16 sm:py-20 px-4 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            India&apos;s First 10D Career Intelligence Model
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-12">
            {TEN_DIMENSIONS.map((d, i) => (
              <motion.div
                key={d.label}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`rounded-2xl bg-gradient-to-br ${d.gradient} p-4 text-white shadow-lg min-h-[100px] flex flex-col justify-center`}
              >
                <d.icon className="w-8 h-8 mb-2 opacity-90" />
                <span className="text-sm font-semibold">{d.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Career Intelligence Report */}
      <section className="py-16 sm:py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Your Personalized Career Intelligence Report
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {REPORT_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <card.icon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 text-lg">{card.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Sample Career Profile (Radar) */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Sample Career Profile
          </motion.h2>
          <motion.div
            {...fadeUp}
            className="flex flex-col items-center"
          >
            <div className="w-64 h-64 sm:w-80 sm:h-80">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="50,8 92,50 50,92 8,50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                <polygon points="50,28 72,50 50,72 28,50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                {[0, 72, 144, 216, 288].map((angle, i) => {
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const x = 50 + 42 * Math.cos(rad);
                  const y = 50 - 42 * Math.sin(rad);
                  return (
                    <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                  );
                })}
                <motion.polygon
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  points="50,52 68,46 62,62 50,58 38,62"
                  fill="rgba(168, 85, 247, 0.35)"
                  stroke="rgb(168, 85, 247)"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {RADAR_LABELS.map((l) => (
                <span key={l} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {l}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 7 — For Parents */}
      <section className="py-16 sm:py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-6">
            For Parents
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-center text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Help your child discover the career path that truly matches their
            abilities and interests.
          </motion.p>
          <motion.div
            {...fadeUp}
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {["Remove career confusion", "Understand natural strengths", "Make confident decisions"].map((benefit, i) => (
              <div
                key={benefit}
                className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 text-center"
              >
                <span className="text-2xl">✓</span>
                <p className="font-semibold text-gray-900 mt-2">{benefit}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 7b — For Schools */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-6">
            MIB Career Intelligence for Schools
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-center text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Helping schools guide every student toward the right career path.
          </motion.p>
          <motion.div {...fadeUp} className="mt-8 text-center">
            <Link
              href={`${WHATS_NEXT_BASE}/school-dashboard`}
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 text-white font-semibold px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              School Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 8 — Final CTA */}
      <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #db2777 40%, #ea580c 70%, #2563eb 100%)",
          }}
        />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
          >
            Start Your Career Intelligence Assessment Today
          </motion.h2>
          <motion.p {...fadeUp} className="mt-6 text-2xl font-semibold text-white/95">
            ₹499
          </motion.p>
          <motion.div {...fadeUp} className="mt-8">
            <Link href={`${WHATS_NEXT_BASE}/career-intelligence/start`}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block rounded-2xl bg-white text-purple-700 font-semibold text-lg px-10 py-4 shadow-xl"
              >
                Start Career Intelligence Test – ₹499
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="py-8 text-center">
        <Link href={WHATS_NEXT_BASE} className="text-purple-600 font-medium">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
