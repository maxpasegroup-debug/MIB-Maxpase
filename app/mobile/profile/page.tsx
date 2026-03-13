"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiOutlineDocumentText, HiOutlineCalendar, HiOutlineCog } from "react-icons/hi2";

export default function MobileProfile() {
  return (
    <div className="px-4 py-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-gray-900 mb-6"
      >
        Profile
      </motion.h1>

      {/* User info card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl bg-white p-4 shadow-lg border border-gray-100 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xl font-bold text-white">
            U
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">User</h2>
            <p className="text-sm text-gray-500">Member</p>
          </div>
        </div>
      </motion.section>

      {/* Previous test reports */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white p-4 shadow-lg border border-gray-100 mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <HiOutlineDocumentText className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Previous test reports</h3>
        </div>
        <p className="text-sm text-gray-500">No reports yet. Complete an assessment to see your results.</p>
        <Link
          href="/mobile/tests"
          className="inline-block mt-3 text-sm font-medium text-purple-600"
        >
          Take a test →
        </Link>
      </motion.section>

      {/* Booked consultations */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white p-4 shadow-lg border border-gray-100 mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <HiOutlineCalendar className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Booked consultations</h3>
        </div>
        <p className="text-sm text-gray-500">No upcoming sessions.</p>
        <Link
          href="/mobile/guidance"
          className="inline-block mt-3 text-sm font-medium text-purple-600"
        >
          Book a session →
        </Link>
      </motion.section>

      {/* Settings */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white p-4 shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-3">
          <HiOutlineCog className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Settings</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">Notifications, language, privacy.</p>
      </motion.section>
    </div>
  );
}
