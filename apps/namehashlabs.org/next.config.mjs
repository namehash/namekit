/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["metadata.ens.domains"],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/ens-referral-program',
        destination: '/ens-v2-referral-programs',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;