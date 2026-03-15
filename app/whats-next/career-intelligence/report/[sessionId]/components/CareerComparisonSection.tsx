"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineCheck } from "react-icons/hi2";
import type { CareerComparisonMeta } from "@/lib/career-comparison";

const COMPARISON_FIELDS: { key: keyof CareerComparisonMeta; label: string }[] = [
  { key: "growthPotential", label: "Growth Potential" },
  { key: "skillDifficulty", label: "Skill Difficulty" },
  { key: "futureDemand", label: "Future Demand" },
  { key: "salaryRange", label: "Average Salary" },
  { key: "aiImpact", label: "AI Impact" },
];

interface CareerComparisonSectionProps {
  careers: CareerComparisonMeta[];
}

export function CareerComparisonSection({ careers }: CareerComparisonSectionProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(careers.slice(0, 3).map((c) => c.id))
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  };

  const selectedCareers = careers.filter((c) => selected.has(c.id));

  return (
    <div className="space-y-8">
      <p className="text-center text-gray-600 max-w-xl mx-auto">
        Select up to 3 careers to compare key factors side by side.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {careers.map((c, i) => {
          const isSelected = selected.has(c.id);
          return (
            <motion.button
              key={c.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => toggle(c.id)}
              className={`rounded-2xl border-2 p-5 text-left transition-all ${
                isSelected
                  ? "border-purple-500 bg-purple-50/80 shadow-lg"
                  : "border-gray-200 bg-white/80 hover:border-purple-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{c.description}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-purple-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {isSelected && <HiOutlineCheck className="w-4 h-4" />}
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs text-gray-600">
                <li><span className="text-gray-400">Growth:</span> {c.growthPotential}</li>
                <li><span className="text-gray-400">Demand:</span> {c.futureDemand}</li>
                <li><span className="text-gray-400">Salary:</span> {c.salaryRange}</li>
                <li><span className="text-gray-400">AI impact:</span> {c.aiImpact}</li>
              </ul>
            </motion.button>
          );
        })}
      </div>

      {selectedCareers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl overflow-hidden"
        >
          <h3 className="text-lg font-bold text-gray-900 p-4 border-b border-gray-100 text-center">
            Comparison at a glance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 w-40">
                    Factor
                  </th>
                  {selectedCareers.map((c) => (
                    <th key={c.id} className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FIELDS.map(({ key, label }) => (
                  <tr key={key} className="border-t border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-600 font-medium">{label}</td>
                    {selectedCareers.map((c) => (
                      <td key={c.id} className="py-3 px-4 text-sm text-gray-800">
                        {String(c[key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
