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

export default function MobileTestsPage() {
  return (
    <div className="mx-auto max-w-md p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-semibold text-gray-900">Tests</h1>
        <p className="text-gray-500 text-sm mt-0.5">Choose a category to start.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link href={`/mobile/tests/start?category=${cat.id}`}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`rounded-xl shadow-md p-4 min-h-[100px] flex flex-col justify-end bg-gradient-to-br ${cat.gradient} text-white`}
              >
                <h3 className="font-semibold text-sm">{cat.title}</h3>
                <span className="text-white/90 text-xs mt-1 inline-block">Start test →</span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
