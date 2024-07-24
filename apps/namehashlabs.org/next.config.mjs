/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["metadata.ens.domains"],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig;