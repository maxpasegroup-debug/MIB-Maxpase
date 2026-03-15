"use client";

import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <Link href={`${WHATS_NEXT_BASE}/mobile`} className="font-bold text-lg text-gray-900">
        MIB
      </Link>
      <span className="text-xs text-gray-500 italic">Make it Beautiful</span>
    </header>
  );
}
