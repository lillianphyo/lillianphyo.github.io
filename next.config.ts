import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Remove basePath and assetPrefix for Cloudflare Pages deployment
  // basePath: process.env.NODE_ENV === 'production' ? '/portfolio-website' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/portfolio-website/' : '',
};

export default nextConfig;
