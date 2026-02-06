import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('pg-native');
    }
    return config;
  },
  
};

export default nextConfig;
