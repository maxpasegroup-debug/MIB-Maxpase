import { Inter } from "next/font/google";
import MobileHeader from "@/app/components/mobile/MobileHeader";
import BottomNav from "@/app/components/mobile/BottomNav";

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
    <div className={`${inter.variable} font-inter min-h-screen bg-slate-50 pb-[70px]`}>
      <div className="mx-auto max-w-[480px] min-h-screen bg-white shadow-lg">
        <MobileHeader />
        <main className="min-h-[calc(100vh-56px-70px)]">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
