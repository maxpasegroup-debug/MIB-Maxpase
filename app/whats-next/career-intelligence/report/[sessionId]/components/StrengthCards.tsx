"use client";

import { motion } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineLightBulb,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineCpuChip,
} from "react-icons/hi2";

export interface StrengthItem {
  key: string;
  label: string;
  score: number;
  explanation: string;
}

const STRENGTH_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  creativity: HiOutlineSparkles,
  leadership: HiOutlineUserGroup,
  cognitive: HiOutlineAcademicCap,
  personality: HiOutlineUserGroup,
  motivation: HiOutlineLightBulb,
  emotional: HiOutlineUserGroup,
  skills: HiOutlineChartBar,
  technology: HiOutlineCpuChip,
  work_environment: HiOutlineLightBulb,
  life_values: HiOutlineSparkles,
};

const GRADIENT_BORDERS = [
  "border-l-4 border-l-violet-500",
  "border-l-4 border-l-pink-500",
  "border-l-4 border-l-amber-500",
];

interface StrengthCardsProps {
  strengths: StrengthItem[];
}

export function StrengthCards({ strengths }: StrengthCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {strengths.map((s, i) => {
        const Icon = STRENGTH_ICONS[s.key] ?? HiOutlineSparkles;
        const borderClass = GRADIENT_BORDERS[i % GRADIENT_BORDERS.length];
        return (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl p-6 ${borderClass} hover:shadow-2xl transition-shadow`}
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 shrink-0">
                <Icon className="w-7 h-7 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{s.label}</h3>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mt-1">
                  {s.score}
                </p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {s.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
