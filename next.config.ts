import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["noonchi-bucket.s3.ap-northeast-2.amazonaws.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
