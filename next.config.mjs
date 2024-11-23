/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // development
      {
        protocol: 'https',
        hostname: 'next-horse-726.convex.cloud',
        pathname: '/api/storage/**',
      },
      // production
      {
        protocol: 'https',
        hostname: 'disciplined-iguana-528.convex.cloud',
        pathname: '/api/storage/**',
      },
    ],
  },
};

export default nextConfig;
