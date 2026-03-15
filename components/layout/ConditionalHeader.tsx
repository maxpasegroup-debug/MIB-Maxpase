"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMIBLanding = pathname === "/";

  if (isMIBLanding) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
