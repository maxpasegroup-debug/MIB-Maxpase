"use client";

import Link from "next/link";

const PRODUCT = [
  { href: "/career-intelligence", label: "Career Intelligence" },
  { href: "/tests", label: "Psychological Tests" },
  { href: "/dashboard/mentor", label: "AI Mentor" },
  { href: "/guidance", label: "Guidance" },
];

const COMPANY = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#result-preview", label: "Report Preview" },
  { href: "/school-dashboard", label: "For Professionals" },
  { href: "/partners/register", label: "Partners" },
];

const RESOURCES = [
  { href: "/dashboard/growth", label: "Growth" },
  { href: "/mobile/tests", label: "Assessments" },
  { href: "/login", label: "Login" },
  { href: "/login?tab=register", label: "Sign Up" },
];

const LEGAL = [
  { href: "/", label: "Privacy" },
  { href: "/", label: "Terms" },
  { href: "/", label: "Contact" },
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
