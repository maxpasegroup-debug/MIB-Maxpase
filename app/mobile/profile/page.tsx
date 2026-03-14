"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, LogOut, LogIn, UserPlus } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function MobileProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) return null;
        if (!r.ok) return null;
        return r.json();
      })
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    window.location.href = "/mobile";
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md p-4 space-y-6">
        <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-4 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-gray-900"
      >
        Profile
      </motion.h1>

      {user ? (
        <>
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl shadow-md bg-white p-4 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xl font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900 truncate">{user.name}</h2>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-3"
          >
            <Link href="/dashboard">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="rounded-xl shadow-md bg-white p-4 flex items-center gap-3 border border-gray-100"
              >
                <LayoutDashboard className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Dashboard</span>
              </motion.div>
            </Link>
            <Link href="/dashboard/results">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="rounded-xl shadow-md bg-white p-4 flex items-center gap-3 border border-gray-100"
              >
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Results</span>
              </motion.div>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl shadow-md bg-white p-4 flex items-center gap-3 border border-gray-100 text-left"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Logout</span>
            </button>
          </motion.section>
        </>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl shadow-md bg-white p-6 border border-gray-100 space-y-4"
        >
          <p className="text-gray-600 text-sm">Sign in to access your dashboard and results.</p>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 text-white py-3 font-medium"
          >
            <LogIn className="w-5 h-5" />
            Login
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 text-gray-700 py-3 font-medium"
          >
            <UserPlus className="w-5 h-5" />
            Register
          </Link>
        </motion.section>
      )}
    </div>
  );
}
