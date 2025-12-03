import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["noonchi-bucket.s3.ap-northeast-2.amazonaws.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  generateBuildId: async () => {
    return "build-" + Date.now();
  },
};

export default nextConfig;
