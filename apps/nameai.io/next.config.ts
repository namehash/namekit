import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PPR (Partial Prerendering) is only available in canary versions
  // Disabled since we're using stable Next.js 15.1.9
  // experimental: {
  //   ppr: true,
  // },
};

export default nextConfig;
