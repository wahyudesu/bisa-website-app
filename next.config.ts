import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  // serverExternalPackages: ['@lmnr-ai/lmnr'],
  experimental: {
    clientInstrumentationHook: true,
  },
};

export default nextConfig;
