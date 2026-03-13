"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function StartContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "stress";

  return (
    <div className="px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Start assessment</h1>
      <p className="text-gray-600 text-sm mb-6">
        You’ll answer a few questions. This usually takes 2–5 minutes.
      </p>
      <Link
        href="/"
        className="block rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-4 text-center text-white font-semibold shadow-lg"
      >
        Start on web (full experience)
      </Link>
      <p className="text-center text-gray-500 text-xs mt-4">
        Full test experience is on the main site. Mobile test flow coming soon.
      </p>
    </div>
  );
}

export default function MobileTestStart() {
  return (
    <Suspense fallback={<div className="p-4">Loading…</div>}>
      <StartContent />
    </Suspense>
  );
}
