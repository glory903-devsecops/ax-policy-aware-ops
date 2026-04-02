/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/ax-policy-aware-ops',
  assetPrefix: '/ax-policy-aware-ops/',
};

export default nextConfig;
