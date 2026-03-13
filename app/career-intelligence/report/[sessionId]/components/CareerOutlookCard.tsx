"use client";

import { motion } from "framer-motion";
import { HiOutlineTrendingUp, HiOutlineCurrencyRupee, HiOutlineChartBar } from "react-icons/hi2";

interface CareerOutlookCardProps {
  careerName: string;
  demand: string;
  salaryRange: string;
  industryGrowth: string;
}

export function CareerOutlookCard({
  careerName,
  demand,
  salaryRange,
  industryGrowth,
}: CareerOutlookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-orange-500/10 border border-purple-200/60 p-6 shadow-xl"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Career Outlook</h3>
      <p className="text-sm text-gray-600 mb-4">{careerName}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white/80 p-2">
            <HiOutlineTrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Demand</p>
            <p className="font-semibold text-gray-900">{demand}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white/80 p-2">
            <HiOutlineCurrencyRupee className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Average salary</p>
            <p className="font-semibold text-gray-900">{salaryRange}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white/80 p-2">
            <HiOutlineChartBar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Industry growth</p>
            <p className="font-semibold text-gray-900">{industryGrowth}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
