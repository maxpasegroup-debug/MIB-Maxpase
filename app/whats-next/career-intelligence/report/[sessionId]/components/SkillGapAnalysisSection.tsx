"use client";

import { motion } from "framer-motion";
import type { SkillStatus } from "@/lib/career-comparison";

const STATUS_STYLES: Record<SkillStatus, string> = {
  Strong: "bg-emerald-100 text-emerald-800 font-medium",
  Moderate: "bg-amber-100 text-amber-800 font-medium",
  Beginner: "bg-blue-100 text-blue-800",
  Needed: "bg-gray-100 text-gray-700",
};

interface SkillGapRow {
  skill: string;
  status: SkillStatus;
}

interface SkillGapAnalysisSectionProps {
  careerName: string;
  rows: SkillGapRow[];
}

export function SkillGapAnalysisSection({ careerName, rows }: SkillGapAnalysisSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">
        Your skill gap for {careerName}
      </h3>
      <p className="text-sm text-gray-600">
        Skills to develop or strengthen for this career path.
      </p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Skill
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 w-28">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.skill} className="border-t border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">{row.skill}</td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs ${STATUS_STYLES[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
