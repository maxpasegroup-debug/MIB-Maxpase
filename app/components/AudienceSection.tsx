"use client";

import { motion } from "framer-motion";
import {
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineHome,
  HiOutlineHeart,
} from "react-icons/hi2";

const audiences = [
  { icon: HiOutlineUser, label: "Children" },
  { icon: HiOutlineAcademicCap, label: "Students" },
  { icon: HiOutlineBriefcase, label: "Professionals" },
  { icon: HiOutlineHome, label: "Parents" },
  { icon: HiOutlineHeart, label: "Counselors" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function AudienceSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          Who Is This For
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-12"
        >
          Designed for everyone who wants to understand their mind.
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10"
        >
          {audiences.map((a) => (
            <motion.div
              key={a.label}
              variants={item}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-pink-400 to-purple-500 flex items-center justify-center text-white shadow-lg mb-3"
              >
                <a.icon className="w-10 h-10 sm:w-12 sm:h-12" />
              </motion.div>
              <span className="text-sm sm:text-base font-semibold text-gray-700">{a.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
