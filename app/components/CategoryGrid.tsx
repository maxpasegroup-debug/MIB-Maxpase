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

const categories = [
  { icon: HiOutlineBolt, title: "Stress & Anxiety", subtitle: "Feeling overwhelmed?", gradient: "from-violet-500 to-purple-600" },
  { icon: HiOutlineHeart, title: "Relationship Problems", subtitle: "Struggling with people?", gradient: "from-pink-500 to-rose-600" },
  { icon: HiOutlineBriefcase, title: "Career Confusion", subtitle: "Not sure about your future?", gradient: "from-blue-500 to-indigo-600" },
  { icon: HiOutlineSparkles, title: "Confidence Issues", subtitle: "Low self belief?", gradient: "from-amber-400 to-orange-500" },
  { icon: HiOutlineDevicePhoneMobile, title: "Phone Addiction", subtitle: "Too much screen time?", gradient: "from-cyan-500 to-teal-600" },
  { icon: HiOutlineUserGroup, title: "Child Behaviour", subtitle: "Understanding your child", gradient: "from-emerald-500 to-green-600" },
  { icon: HiOutlineFire, title: "Work Stress", subtitle: "Burnout and pressure", gradient: "from-red-500 to-rose-600" },
  { icon: HiOutlineStar, title: "Discover Your Talent", subtitle: "Find your strengths", gradient: "from-fuchsia-500 to-purple-600" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function CategoryGrid() {
  return (
    <section id="categories" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-3"
        >
          Life problem categories
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 max-w-2xl mx-auto mb-14"
        >
          Choose the area you want to understand better.
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.title} variants={item}>
              <Link href="/#how-it-works">
                <motion.div
                  className={`rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${cat.gradient} text-white shadow-xl border border-white/20`}
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <cat.icon className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-95" />
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{cat.title}</h3>
                  <p className="text-white/90 text-sm sm:text-base">{cat.subtitle}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
