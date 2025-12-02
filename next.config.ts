// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // THIS LINE FIXES THE TURBOPACK CRASH WITH bcryptjs
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs"],
  },
};

module.exports = nextConfig;