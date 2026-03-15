"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineBars3, HiOutlineXMark, HiOutlineBell, HiOutlineUser } from "react-icons/hi2";

import { WHATS_NEXT_BASE as BASE } from "@/lib/basePath";

const NAV_LINKS = [
  { href: `${BASE}/career-intelligence`, label: "Career Intelligence" },
  { href: `${BASE}/tests`, label: "Psychological Tests" },
  { href: `${BASE}/guidance`, label: "Expert Guidance" },
  { href: `${BASE}/exam-coaching`, label: "Exam Coaching" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setProfileOpen(false);
    router.push(BASE);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Home + Brand */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href={BASE}
            className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
          >
            What&apos;s Next
          </Link>
        </div>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Auth or User menu */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <HiOutlineBell className="w-5 h-5" />
                </button>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 mt-1 w-64 rounded-xl bg-white shadow-lg border border-gray-200 py-2 z-20">
                      <p className="px-4 py-2 text-sm text-gray-500">No new notifications</p>
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200"
                  aria-label="Profile menu"
                >
                  <HiOutlineUser className="w-5 h-5" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white shadow-lg border border-gray-200 py-1 z-20">
                      <Link href={`${BASE}/dashboard/profile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>Profile</Link>
                      <Link href={`${BASE}/dashboard`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>Dashboard</Link>
                      <Link href={`${BASE}/dashboard/results`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>My Reports</Link>
                      <Link href={`${BASE}/dashboard/payments`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>Payments</Link>
                      <button type="button" onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href={`${BASE}/login`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Login</Link>
              <Link href={`${BASE}/login?tab=register`} className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold px-5 py-2 shadow-lg hover:scale-105 transition-transform">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            <Link href="/" className="py-2 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-gray-700 font-medium hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-gray-200">
              <Link href={`${BASE}/login`} className="py-2 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link
                href={`${BASE}/login?tab=register`}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold px-5 py-3 shadow-lg"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
