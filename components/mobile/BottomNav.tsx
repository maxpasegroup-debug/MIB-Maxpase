"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, MessageCircle, Trophy, User } from "lucide-react";

const items = [
  { href: "/mobile", label: "Home", icon: Home },
  { href: "/mobile/tests", label: "Tests", icon: ClipboardList },
  { href: "/mobile/guidance", label: "Guidance", icon: MessageCircle },
  { href: "/mobile/growth", label: "Growth", icon: Trophy },
  { href: "/mobile/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-[70px] rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-xl border-t border-gray-200/80 z-50"
    >
      <div className="flex items-center justify-around h-full px-2">
        {items.map((item) => {
          const isActive =
            item.href === "/mobile"
              ? pathname === "/mobile"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-colors ${
                isActive
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
