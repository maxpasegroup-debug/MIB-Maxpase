"use client";

import { motion } from "framer-motion";
import { HiOutlineShare } from "react-icons/hi2";

interface ShareableCardProps {
  topStrengths: string[];
  recommendedCareers: string[];
  onShare?: () => void;
}

export function ShareableCard({
  topStrengths,
  recommendedCareers,
  onShare,
}: ShareableCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 shadow-2xl text-white max-w-lg mx-auto"
    >
      <div className="text-center mb-6">
        <p className="text-white/90 text-sm font-medium uppercase tracking-wide">
          MIB Career Intelligence™
        </p>
        <h3 className="text-2xl font-bold mt-1">My Career Intelligence Profile</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-2">
            Top strengths
          </p>
          <ul className="space-y-1">
            {topStrengths.slice(0, 4).map((s) => (
              <li key={s} className="font-medium">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-2">
            Recommended career
          </p>
          <ul className="space-y-1">
            {recommendedCareers.slice(0, 4).map((c) => (
              <li key={c} className="font-medium">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-white/80 text-xs text-center mb-4">
        Make Your Career Beautiful with AI-Powered Career Intelligence
      </p>
      {onShare && (
        <motion.button
          type="button"
          onClick={onShare}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-xl bg-white text-purple-600 font-semibold py-3 flex items-center justify-center gap-2"
        >
          <HiOutlineShare className="w-5 h-5" />
          Share on WhatsApp or Instagram
        </motion.button>
      )}
    </motion.div>
  );
}
