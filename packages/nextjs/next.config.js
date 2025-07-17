/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add webpack aliases to match tsconfig paths
    config.resolve.alias = {
      ...config.resolve.alias,
      '~~': __dirname,
    };
    return config;
  },
  transpilePackages: ["@privy-io/react-auth", "@privy-io/wagmi"],
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

module.exports = nextConfig; 