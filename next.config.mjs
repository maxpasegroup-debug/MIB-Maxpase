/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Unique build ID per deploy so caches don't serve old theme assets
  generateBuildId: async () => {
    return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || `build-${Date.now()}`;
  },
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
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
};

const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
