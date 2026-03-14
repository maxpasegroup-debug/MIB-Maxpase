/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**", pathname: "/**" },
      { protocol: "http", hostname: "**", pathname: "/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["react-icons", "recharts", "framer-motion"],
  },
};

const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
