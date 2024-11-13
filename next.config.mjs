/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'next-horse-726.convex.cloud',
        pathname: '/api/storage/**',
      },
    ],
  },
};

export default nextConfig;
