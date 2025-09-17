/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,   // 🚨 disables strict mode

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
}

export default nextConfig
