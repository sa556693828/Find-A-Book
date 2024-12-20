import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 添加 assetPrefix 配置
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.taaze.tw",
      },
    ],
  },
};

export default nextConfig;
