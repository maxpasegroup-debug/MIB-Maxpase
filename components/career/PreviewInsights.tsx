"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface PreviewInsightsProps {
  topStrength: string;
  topStrengthScore: number;
}

const TEASER =
  "This report contains deeper insights including potential profile, career probabilities, and life path simulations.";

export default function PreviewInsights({ topStrength, topStrengthScore }: PreviewInsightsProps) {
  const barData = [{ name: topStrength, value: Math.min(100, Math.max(0, topStrengthScore)), fill: "#7c3aed" }];

  return (
    <motion.section
      className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-purple-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85, duration: 0.45 }}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-4">Your Top Strength</h2>
      <p className="text-xl font-semibold text-purple-600 mb-3">{topStrength}</p>
      <div className="w-full max-w-xs h-8 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={600}>
              <Cell fill="#7c3aed" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {TEASER}
      </p>
    </motion.section>
  );
}
