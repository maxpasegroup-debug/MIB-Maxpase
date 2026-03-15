"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import {
  HiOutlineHome,
  HiOutlineLightBulb,
  HiOutlineClipboardDocumentList,
  HiOutlineAcademicCap,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineUser,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const NAV = [
  { href: `${WHATS_NEXT_BASE}/dashboard`, label: "Dashboard", icon: HiOutlineHome },
  { href: `${WHATS_NEXT_BASE}/career-intelligence`, label: "Career Intelligence", icon: HiOutlineLightBulb },
  { href: `${WHATS_NEXT_BASE}/tests`, label: "Psychological Tests", icon: HiOutlineClipboardDocumentList },
  { href: `${WHATS_NEXT_BASE}/exam-coaching`, label: "Exam Coaching", icon: HiOutlineAcademicCap },
  { href: `${WHATS_NEXT_BASE}/dashboard/vision-board`, label: "Vision Board", icon: HiOutlineSquares2X2 },
  { href: `${WHATS_NEXT_BASE}/guidance`, label: "Expert Guidance", icon: HiOutlineUserGroup },
  { href: `${WHATS_NEXT_BASE}/dashboard/history`, label: "History", icon: HiOutlineClock },
  { href: `${WHATS_NEXT_BASE}/dashboard/payments`, label: "Payments", icon: HiOutlineCreditCard },
  { href: `${WHATS_NEXT_BASE}/dashboard/profile`, label: "Profile", icon: HiOutlineUser },
];

export default function MainDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push(WHATS_NEXT_BASE);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left sidebar - fixed, full height */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-56"
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {!collapsed && (
            <Link href={`${WHATS_NEXT_BASE}/dashboard`} className="font-bold text-gray-900 truncate">
              Dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <HiOutlineChevronRight className="w-5 h-5" /> : <HiOutlineChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== `${WHATS_NEXT_BASE}/dashboard` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                  isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-50"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-gray-100 space-y-1">
          <Link
            href={WHATS_NEXT_BASE}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 ${collapsed ? "justify-center" : ""}`}
          >
            <HiOutlineHome className="w-5 h-5 shrink-0" />
            {!collapsed && "Back to site"}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 ${collapsed ? "justify-center" : ""}`}
          >
            <HiOutlineUser className="w-5 h-5 shrink-0" />
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-56"}`}>
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
