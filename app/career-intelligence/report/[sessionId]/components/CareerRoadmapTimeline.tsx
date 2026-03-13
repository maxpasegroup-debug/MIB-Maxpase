"use client";

import { motion } from "framer-motion";

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  skills?: string[];
}

interface CareerRoadmapTimelineProps {
  steps: RoadmapStep[];
  clusterName?: string;
}

export function CareerRoadmapTimeline({ steps, clusterName }: CareerRoadmapTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      className="max-w-2xl mx-auto"
    >
      {clusterName && (
        <p className="text-center text-gray-500 text-sm mb-8">
          Based on your top match: <span className="font-semibold text-gray-700">{clusterName}</span>
        </p>
      )}
      <div className="relative">
        {/* vertical line */}
        <div
          className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-300 via-pink-300 to-orange-200 rounded-full"
          aria-hidden
        />
        <div className="space-y-0">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex gap-6 pb-10 last:pb-0"
            >
              <div className="relative flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-4 ring-white z-10">
                  {s.step}
                </div>
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="font-bold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {s.description}
                </p>
                {s.skills?.length ? (
                  <p className="text-xs text-purple-600 mt-2">
                    Skills: {s.skills.join(", ")}
                  </p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
