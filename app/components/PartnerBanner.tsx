"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiOutlineUserGroup } from "react-icons/hi2";

export default function PartnerBanner() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl shadow-lg border border-gray-100 bg-gradient-to-br from-emerald-700 to-teal-800 p-8 sm:p-12 text-white transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-white/10 mb-6">
                <HiOutlineUserGroup className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Become a Career Intelligence Partner
              </h2>
              <p className="text-white/85 text-lg max-w-xl">
                Help students discover their career direction and earn referral income.
              </p>
            </div>
            <Link href="/partners/register">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block rounded-2xl bg-white text-emerald-800 px-6 py-3 font-semibold shadow-lg"
              >
                Become a Partner
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
