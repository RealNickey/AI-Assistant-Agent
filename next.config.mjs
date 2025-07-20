/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for better hydration handling
  experimental: {
    // Reduce hydration mismatches caused by browser extensions
    optimizePackageImports: ['@ai-sdk/openai', '@ai-sdk/google'],
  },
  // Custom webpack configuration
  webpack: (config, { isServer }) => {
    // Client-side only optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Suppress hydration warnings in development for known issues
  reactStrictMode: true,
  // Custom headers to help with browser extension compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
