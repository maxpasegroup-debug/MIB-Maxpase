import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import BottomNav from "@/components/mobile/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} font-inter min-h-screen bg-transparent pb-[70px]`}>
      <div className="mx-auto max-w-md min-h-screen bg-white/80 backdrop-blur-md shadow-xl border-x border-white/60">
        <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-white/60 backdrop-blur-lg border-b border-white/50 shadow-sm">
          <Link href={`${WHATS_NEXT_BASE}/mobile`} className="flex items-center gap-2">
            <Image src="/logo.png" alt="MIB" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-lg text-gray-900">MIB</span>
          </Link>
          <span className="text-xs text-gray-500 italic">Make it Beautiful</span>
        </header>
        <main className="min-h-[calc(100vh-56px-70px)]">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
