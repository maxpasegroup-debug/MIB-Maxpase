"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

const NAV = [
  { href: `${WHATS_NEXT_BASE}/dashboard`, label: "Dashboard" },
  { href: `${WHATS_NEXT_BASE}/dashboard/growth`, label: "Growth" },
  { href: `${WHATS_NEXT_BASE}/dashboard/mentor`, label: "AI Mentor" },
  { href: `${WHATS_NEXT_BASE}/dashboard/results`, label: "Results" },
  { href: `${WHATS_NEXT_BASE}/dashboard/profile`, label: "Profile" },
  { href: `${WHATS_NEXT_BASE}/career-intelligence/start`, label: "Career Test" },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push(WHATS_NEXT_BASE);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col sm:flex-row">
      <aside className="w-full sm:w-56 bg-white/80 backdrop-blur-md shadow-xl flex-shrink-0 border-b sm:border-b-0 sm:border-r border-white/60">
        <div className="p-4 border-b border-white/60">
          <Link href={`${WHATS_NEXT_BASE}/dashboard`} className="font-bold text-gray-900">
            Career Dashboard
          </Link>
        </div>
        <nav className="p-2 flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                pathname === item.href
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/60 hidden sm:block space-y-2">
          <Link href={WHATS_NEXT_BASE} className="block text-sm text-gray-500 hover:text-gray-700">
            ← Back to site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block text-sm text-gray-500 hover:text-gray-700"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
