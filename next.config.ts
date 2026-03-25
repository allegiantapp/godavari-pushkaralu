import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // API proxy for development (backend on port 3000)
  // Note: rewrites don't work with static export, we'll use env vars for API URL
};

export default nextConfig;
