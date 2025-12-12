import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack configuration for molstar (forced via --webpack flag)
  webpack: (config, { isServer }) => {
    // Handle molstar's complex module structure
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // Ignore molstar's node-specific modules in the browser
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'molstar/lib/mol-io/reader/pdb/parser': false,
      };
    }

    return config;
  },
  
  // Handle CSS imports from molstar
  transpilePackages: ['molstar'],
  
  // Output configuration for Docker
  output: 'standalone',
};

export default nextConfig;