import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {},
  env: {
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY ?? "",
  },
};

export default nextConfig;
