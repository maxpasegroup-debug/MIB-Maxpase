"use client";

import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

const PRODUCT = [
  { href: `${WHATS_NEXT_BASE}/career-intelligence`, label: "Career Intelligence" },
  { href: `${WHATS_NEXT_BASE}/tests`, label: "Psychological Tests" },
  { href: `${WHATS_NEXT_BASE}/dashboard/mentor`, label: "AI Mentor" },
  { href: `${WHATS_NEXT_BASE}/guidance`, label: "Guidance" },
];

const COMPANY = [
  { href: `${WHATS_NEXT_BASE}/#how-it-works`, label: "How It Works" },
  { href: `${WHATS_NEXT_BASE}/#result-preview`, label: "Report Preview" },
  { href: `${WHATS_NEXT_BASE}/school-dashboard`, label: "For Professionals" },
  { href: `${WHATS_NEXT_BASE}/partners/register`, label: "Partners" },
];

const RESOURCES = [
  { href: `${WHATS_NEXT_BASE}/dashboard/growth`, label: "Growth" },
  { href: `${WHATS_NEXT_BASE}/mobile/tests`, label: "Assessments" },
  { href: `${WHATS_NEXT_BASE}/login`, label: "Login" },
  { href: `${WHATS_NEXT_BASE}/login?tab=register`, label: "Sign Up" },
];

const LEGAL = [
  { href: WHATS_NEXT_BASE, label: "Privacy" },
  { href: WHATS_NEXT_BASE, label: "Terms" },
  { href: WHATS_NEXT_BASE, label: "Contact" },
];

const COLUMNS = [
  { title: "Product", links: PRODUCT },
  { title: "Company", links: COMPANY },
  { title: "Resources", links: RESOURCES },
  { title: "Legal", links: LEGAL },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-slate-700 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} What&apos;s Next by MIB. Make it Beautiful.
          </p>
        </div>
      </div>
    </footer>
  );
}
