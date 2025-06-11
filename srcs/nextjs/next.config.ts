import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for Docker containers
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
    
  // Server components external packages
  serverExternalPackages: ['ethers'],

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image optimization
  images: {
    unoptimized: true, // Disable for container deployment
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add any custom webpack configuration here
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },

  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },

  // Health check endpoint
  async rewrites() {
    return [
      {
        source: '/health.json',
        destination: '/api/health',
      },
    ];
  },
}

export default nextConfig
