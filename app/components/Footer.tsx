"use client";

import Link from "next/link";

const links = [
  { href: "/", label: "About" },
  { href: "/#categories", label: "Assessments" },
  { href: "/mobile", label: "App" },
  { href: "/", label: "For Professionals" },
  { href: "/", label: "Privacy" },
  { href: "/", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-300">
      <div className="container mx-auto max-w-4xl">
        <nav className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} MIB - Thathaastu. Make it Beautiful.
        </p>
      </div>
    </footer>
  );
}
