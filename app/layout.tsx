import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/layout/ConditionalHeader";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MIB – Make It Beautiful | Creative Health Platform",
  description:
    "MIB is a creative human development ecosystem. What's Next platform for self-discovery, career intelligence & mental wellness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased font-sans text-gray-800">
        <ConditionalHeader>{children}</ConditionalHeader>
      </body>
    </html>
  );
}
