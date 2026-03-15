import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "What's Next by MIB | Make it Beautiful. Understand Your Mind.",
  description:
    "Scientific psychological tests for children, youth and adults. Career intelligence & mental wellness. Make it Beautiful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased font-sans text-gray-800">
        <Header />
        {children}
      </body>
    </html>
  );
}
