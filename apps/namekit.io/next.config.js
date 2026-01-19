/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Disable static optimization for pages that use browser APIs
  // This ensures pages are rendered at request time, avoiding SSR issues
  experimental: {
    // This helps with libraries that use document/window during module initialization
  },
};

module.exports = nextConfig;
