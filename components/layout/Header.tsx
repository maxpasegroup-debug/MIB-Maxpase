"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";

import { WHATS_NEXT_BASE as BASE } from "@/lib/basePath";
const NAV_LINKS = [
  { href: `${BASE}/career-intelligence`, label: "Career Intelligence" },
  { href: `${BASE}/tests`, label: "Psychological Tests" },
  { href: `${BASE}/guidance`, label: "Guidance" },
  { href: `${BASE}/dashboard/growth`, label: "Growth" },
  { href: `${BASE}/#how-it-works`, label: "About" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo + brand lockup */}
        <Link href={BASE} className="flex items-center gap-3 shrink-0 hover:opacity-90 transition-opacity">
          <Image
            src="/logo.png"
            alt="What's Next"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <div className="leading-tight">
            <span className="block text-lg font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              What&apos;s Next
            </span>
            <span className="text-xs text-gray-500">by MIB</span>
          </div>
        </Link>

        {/* Desktop nav */}
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

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href={`${BASE}/login`}
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Login
          </Link>
          <Link
            href={`${BASE}/login?tab=register`}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold px-5 py-2 shadow-lg hover:scale-105 transition-transform"
          >
            Sign Up
          </Link>
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
              <Link
                href={`${BASE}/login`}
                className="py-2 text-gray-700 font-medium"
                onClick={() => setMobileOpen(false)}
              >
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
