import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MIB - Thathaastu | Make it Beautiful. Understand Your Mind.",
  description:
    "Scientific psychological tests for children, youth and adults. Make it Beautiful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased font-sans text-gray-800 bg-white">
        {children}
      </body>
    </html>
  );
}
