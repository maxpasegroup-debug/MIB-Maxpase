"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  HiOutlineBolt,
  HiOutlineHeart,
  HiOutlineBriefcase,
  HiOutlineSparkles,
  HiOutlineDevicePhoneMobile,
  HiOutlineUserGroup,
  HiOutlineFire,
  HiOutlineStar,
} from "react-icons/hi2";

const TESTS = [
  { id: "stress", title: "Stress & Anxiety", desc: "Check your stress levels", icon: HiOutlineBolt, gradient: "from-violet-500 to-purple-600" },
  { id: "relationship", title: "Relationship Problems", desc: "Understand your patterns", icon: HiOutlineHeart, gradient: "from-pink-500 to-rose-600" },
  { id: "career", title: "Career Confusion", desc: "Clarity on your path", icon: HiOutlineBriefcase, gradient: "from-blue-500 to-indigo-600" },
  { id: "confidence", title: "Confidence Issues", desc: "Build self-belief", icon: HiOutlineSparkles, gradient: "from-amber-400 to-orange-500" },
  { id: "phone", title: "Phone Addiction", desc: "Digital wellbeing", icon: HiOutlineDevicePhoneMobile, gradient: "from-cyan-500 to-teal-600" },
  { id: "child", title: "Child Behaviour", desc: "For parents", icon: HiOutlineUserGroup, gradient: "from-emerald-500 to-green-600" },
  { id: "work", title: "Work Stress", desc: "Burnout check", icon: HiOutlineFire, gradient: "from-red-500 to-rose-600" },
  { id: "talent", title: "Discover Your Talent", desc: "Find your strengths", icon: HiOutlineStar, gradient: "from-fuchsia-500 to-purple-600" },
];

export default function MobileTests() {
  return (
    <div className="px-4 py-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-gray-900 mb-1"
      >
        Tests
      </motion.h1>
      <p className="text-gray-500 text-sm mb-6">Choose an assessment to start.</p>

      <div className="grid grid-cols-2 gap-4">
        {TESTS.map((test, i) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/mobile/tests/start?category=${test.id}`}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`rounded-2xl p-4 bg-gradient-to-br ${test.gradient} text-white shadow-lg min-h-[120px] flex flex-col justify-between`}
              >
                <test.icon className="w-8 h-8 opacity-90" />
                <div>
                  <h3 className="font-semibold text-sm mt-2">{test.title}</h3>
                  <p className="text-white/85 text-xs mt-0.5">{test.desc}</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
