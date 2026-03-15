"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/institutes/dashboard", label: "Dashboard" },
  { href: "/institutes/dashboard#students", label: "Students" },
  { href: "/institutes/results", label: "Results" },
  { href: "/institutes/dashboard#students", label: "Start Test" },
];

export default function InstitutePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/institutes/dashboard", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) setAllowed(false);
        else setAllowed(r.ok);
      })
      .catch(() => setAllowed(false));
  }, []);

  if (allowed === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (allowed === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center px-4">
        <p className="text-gray-600 mb-4">Please register or sign in as an institute.</p>
        <Link
          href="/institutes/register"
          className="rounded-lg bg-purple-600 text-white px-4 py-2 font-medium hover:bg-purple-700"
        >
          Register Institute
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">
      <aside className="w-56 bg-white/80 backdrop-blur-md border-r border-white/60 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/60">
          <Link href="/institutes/dashboard" className="font-semibold text-gray-900">
            Institute
          </Link>
        </div>
        <nav className="p-2 flex-1">
          {NAV.map((item) => {
            const isActive =
              item.href === pathname ||
              (item.href === "/institutes/dashboard" && pathname?.startsWith("/institutes/dashboard"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
