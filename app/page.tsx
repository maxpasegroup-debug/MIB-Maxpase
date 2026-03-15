"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const MIB_COLORS = {
  purple: "#7c3aed",
  pink: "#ec4899",
  orange: "#f97316",
  blue: "#3b82f6",
  teal: "#14b8a6",
  yellow: "#eab308",
};

export default function MIBLandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[80vmax] h-[80vmax] rounded-full opacity-30 blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle, ${MIB_COLORS.purple}40, transparent 70%)`,
            top: "-20%",
            left: "-10%",
            animationDuration: "8s",
          }}
        />
        <div
          className="absolute w-[60vmax] h-[60vmax] rounded-full opacity-30 blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle, ${MIB_COLORS.pink}50, transparent 70%)`,
            top: "40%",
            right: "-15%",
            animationDuration: "10s",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute w-[50vmax] h-[50vmax] rounded-full opacity-25 blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle, ${MIB_COLORS.orange}40, transparent 70%)`,
            bottom: "-10%",
            left: "20%",
            animationDuration: "12s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle, ${MIB_COLORS.teal}50, transparent 70%)`,
            top: "60%",
            left: "-5%",
            animationDuration: "9s",
            animationDelay: "0.5s",
          }}
        />
        <div
          className="absolute w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle, ${MIB_COLORS.blue}40, transparent 70%)`,
            top: "10%",
            right: "10%",
            animationDuration: "11s",
          }}
        />
      </div>

      {/* Section 1 — Hero (full screen) */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* MIB splash logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-4 mib-gradient-text"
          >
            MIB
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2"
          >
            Make It Beautiful
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm sm:text-base text-gray-500 mb-8"
          >
            Creative Health Platform · Creative Health Partner
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-1 text-gray-600 font-medium mb-10"
          >
            <p>Discover Yourself</p>
            <p>Transform Your Life</p>
            <p>Make the World Beautiful</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <a
              href="#ecosystem"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-xl transition-all hover:scale-105 active:scale-100"
              style={{
                background: `linear-gradient(135deg, ${MIB_COLORS.purple}, ${MIB_COLORS.pink})`,
              }}
            >
              Explore the Ecosystem
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2 — MIB Ecosystem */}
      <section id="ecosystem" className="min-h-screen flex flex-col justify-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
        >
          The MIB Human Development Ecosystem
        </motion.h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1 — What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/60 flex flex-col"
          >
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: MIB_COLORS.purple }}
            >
              WHAT&apos;S NEXT
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-1">
              Self Discovery · Career Intelligence · Psychometric Analysis · Identity Mapping
            </p>
            <Link
              href="/whats-next"
              className="rounded-xl py-3 px-6 text-center font-semibold text-white transition-transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${MIB_COLORS.purple}, ${MIB_COLORS.pink})`,
              }}
            >
              Open Platform
            </Link>
          </motion.div>

          {/* Card 2 — Wholistic Wellness */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/60 flex flex-col opacity-95"
          >
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: MIB_COLORS.teal }}
            >
              WHOLISTIC WELLNESS
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-1">
              Mind Wellness · Body Balance · Lifestyle Programs · Health Workshops
            </p>
            <button
              type="button"
              disabled
              className="rounded-xl py-3 px-6 text-center font-semibold text-gray-400 bg-gray-100 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </motion.div>

          {/* Card 3 — ESDC */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/60 flex flex-col opacity-95"
          >
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: MIB_COLORS.blue }}
            >
              ESDC
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-1">
              Employability Skills · Communication Training · Language Development · Career Readiness
            </p>
            <button
              type="button"
              disabled
              className="rounded-xl py-3 px-6 text-center font-semibold text-gray-400 bg-gray-100 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 3 — Human Development Model */}
      <section className="min-h-screen flex flex-col justify-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16"
        >
          The MIB Human Transformation Model
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto flex flex-col items-center gap-4"
        >
          {[
            "Self Discovery",
            "Wellness",
            "Skill Development",
            "Career Growth",
            "Community Contribution",
          ].map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl px-8 py-4 text-lg font-semibold text-gray-900 border border-white/60 min-w-[240px] text-center"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: [MIB_COLORS.purple, MIB_COLORS.pink, MIB_COLORS.orange, MIB_COLORS.blue, MIB_COLORS.teal][i],
                }}
              >
                {label}
              </div>
              {i < 4 && (
                <span className="text-2xl text-gray-300" aria-hidden>↓</span>
              )}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Section 4 — Community Programs */}
      <section className="min-h-screen flex flex-col justify-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
        >
          Community Programs
        </motion.h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: "Youth Awareness", color: MIB_COLORS.purple },
            { title: "Parenting Workshops", color: MIB_COLORS.pink },
            { title: "Senior Wellness", color: MIB_COLORS.orange },
            { title: "Creative Life Programs", color: MIB_COLORS.teal },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/60"
            >
              <h3
                className="text-xl font-bold text-gray-900"
                style={{ color: item.color }}
              >
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 5 — Vision */}
      <section className="min-h-screen flex flex-col justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Our Vision
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            MIB is a creative human development ecosystem
            <br />
            where psychology, wellness, education and
            <br />
            career transformation come together
            <br />
            to make human life beautiful.
          </p>
        </motion.div>
      </section>

      {/* Section 6 — Final CTA */}
      <section className="min-h-screen flex flex-col justify-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
        >
          Begin Your Journey
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/whats-next"
            className="rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-xl transition-transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${MIB_COLORS.purple}, ${MIB_COLORS.pink})`,
            }}
          >
            Open What&apos;s Next
          </Link>
          <a
            href="#ecosystem"
            className="rounded-2xl px-8 py-4 text-base font-semibold border-2 border-gray-300 text-gray-700 bg-white/80 backdrop-blur-md hover:bg-gray-50 transition-transform hover:scale-105"
          >
            Join the Community
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/40 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-bold text-gray-900">MIB – Make It Beautiful</p>
          <p className="text-sm text-gray-600 mt-1">Creative Health Partner</p>
        </div>
      </footer>
    </main>
  );
}
