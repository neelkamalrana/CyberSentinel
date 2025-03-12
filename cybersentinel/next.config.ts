import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GITHUB_ID: process.env.GITHUB_ID as string,
    GITHUB_SECRET: process.env.GITHUB_SECRET as string,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'], // For GitHub avatar images
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;