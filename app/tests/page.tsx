"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CATEGORIES = [
  { id: "child-development", title: "Child Development", gradient: "from-emerald-500 to-teal-600" },
  { id: "teen-growth", title: "Teen Growth", gradient: "from-violet-500 to-purple-600" },
  { id: "career-direction", title: "Career Direction", gradient: "from-blue-500 to-indigo-600" },
  { id: "personality-discovery", title: "Personality Discovery", gradient: "from-fuchsia-500 to-pink-600" },
  { id: "emotional-health", title: "Emotional Health", gradient: "from-rose-500 to-red-500" },
  { id: "relationships", title: "Relationships", gradient: "from-pink-500 to-rose-600" },
  { id: "learning-ability", title: "Learning Ability", gradient: "from-amber-400 to-orange-500" },
  { id: "leadership", title: "Leadership", gradient: "from-slate-600 to-slate-800" },
  { id: "stress-management", title: "Stress Management", gradient: "from-cyan-500 to-teal-600" },
  { id: "life-purpose", title: "Life Purpose", gradient: "from-purple-600 to-violet-700" },
];

export default function DesktopTestsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900">Test categories</h1>
          <p className="mt-2 text-gray-500">Choose a category to start your assessment.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link href={`/mobile/tests/start?category=${cat.id}`}>
                <div
                  className={`rounded-2xl shadow-lg border border-gray-100 p-6 bg-gradient-to-br ${cat.gradient} text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
                >
                  <h3 className="font-semibold text-lg">{cat.title}</h3>
                  <span className="text-white/90 text-sm mt-2 inline-block">Start test →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center text-sm text-gray-500"
        >
          <Link href="/" className="text-purple-600 font-medium hover:underline">
            ← Back to home
          </Link>
        </motion.p>
      </div>
    </main>
  );
}
