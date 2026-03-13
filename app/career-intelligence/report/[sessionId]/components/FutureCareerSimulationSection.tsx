"use client";

import { motion } from "framer-motion";
import type { RoadmapStep } from "./CareerRoadmapTimeline";

/** Map step index (1–5) to year label. */
const STEP_TO_YEAR: Record<number, string> = {
  1: "Year 1",
  2: "Year 2",
  3: "Year 3",
  4: "Year 4",
  5: "Year 5",
};

interface FutureCareerSimulationSectionProps {
  careerName: string;
  steps: RoadmapStep[];
}

export function FutureCareerSimulationSection({
  careerName,
  steps,
}: FutureCareerSimulationSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 text-center">
        Your future as a {careerName}
      </h3>
      <p className="text-center text-gray-600 text-sm max-w-lg mx-auto">
        A possible timeline to visualize your growth in this career path.
      </p>

      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-300 via-pink-300 to-orange-200 rounded-full" aria-hidden />
        <div className="space-y-0">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.45 }}
              className="flex gap-6 pb-8 last:pb-0"
            >
              <div className="relative flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-bold text-xs shadow-lg ring-4 ring-white z-10">
                  {STEP_TO_YEAR[s.step] ?? `Year ${s.step}`}
                </div>
              </div>
              <div className="flex-1 pt-0.5 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-lg p-5">
                <h4 className="font-bold text-gray-900">{s.title}</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{s.description}</p>
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
    </div>
  );
}
