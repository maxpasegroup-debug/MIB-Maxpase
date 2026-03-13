"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MOCK_PSYCHOLOGISTS } from "@/lib/mock-psychologists";

export default function MobileGuidance() {
  return (
    <div className="px-4 py-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-gray-900 mb-1"
      >
        Guidance
      </motion.h1>
      <p className="text-gray-500 text-sm mb-6">
        Book a session with a psychologist for online counselling.
      </p>

      <div className="space-y-4">
        {MOCK_PSYCHOLOGISTS.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/mobile/psychologist/${doc.id}`}>
              <motion.div
                whileTap={{ scale: 0.99 }}
                className="rounded-2xl bg-white p-4 shadow-lg border border-gray-100 flex gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-2xl text-white shrink-0">
                  {doc.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-600">{doc.specialization}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {doc.experienceYears} years experience
                  </p>
                  <p className="text-sm text-amber-600 mt-1">⭐ {doc.rating}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-2">
                    Fee: ₹{doc.consultationFee}
                  </p>
                  <span className="inline-block mt-2 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-medium text-white">
                    Book Consultation
                  </span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
