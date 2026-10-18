import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.PHODAR_STATIC_EXPORT === '1'
    ? { output: 'export' as const, distDir: 'out' }
    : {}),
  images: { unoptimized: true },
};

export default nextConfig;
