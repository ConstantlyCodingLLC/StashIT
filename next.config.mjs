/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable type checking during build to speed up deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optimize build output
  output: 'standalone',
  // Disable image optimization to reduce build complexity
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.v0.dev',
      },
    ],
  },
  // Increase build memory limit
  experimental: {
    memoryBasedWorkersCount: true,
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable React strict mode temporarily to identify issues
  reactStrictMode: false,
  // Increase timeout for static generation
  staticPageGenerationTimeout: 120,
  // Disable compression to speed up build
  compress: false,
  // Disable webpack5 for now to troubleshoot
  webpack5: false,
}

export default nextConfig
