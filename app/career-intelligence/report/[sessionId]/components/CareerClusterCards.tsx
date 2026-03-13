"use client";

import { motion } from "framer-motion";
import { HiOutlineBriefcase } from "react-icons/hi2";

export interface CareerClusterItem {
  id: string;
  name: string;
  description: string;
  exampleRoles: string[];
  growthOutlook?: string;
}

interface CareerClusterCardsProps {
  clusters: CareerClusterItem[];
}

export function CareerClusterCards({ clusters }: CareerClusterCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {clusters.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
          className="rounded-2xl bg-white/90 backdrop-blur border border-white/60 shadow-xl p-6 transition-all duration-300 hover:border-purple-200"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-500/15 p-3 shrink-0">
              <HiOutlineBriefcase className="w-6 h-6 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {c.description}
              </p>
              {c.exampleRoles?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Example roles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.exampleRoles.slice(0, 4).map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-purple-50 text-purple-700 px-3 py-1 text-xs font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {c.growthOutlook && (
                <p className="text-xs font-medium text-pink-600 mt-3">
                  Growth potential: {c.growthOutlook}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
