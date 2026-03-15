"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/psychologists", label: "Psychologists" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-transparent flex">
      <aside className="w-56 bg-white/80 backdrop-blur-md shadow-xl flex-shrink-0 flex flex-col border-r border-white/60">
        <div className="p-4 border-b border-white/60">
          <Link href="/admin/dashboard" className="font-bold text-gray-900">
            MIB Admin
          </Link>
        </div>
        <nav className="p-2 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                pathname === item.href
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-white/60">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
