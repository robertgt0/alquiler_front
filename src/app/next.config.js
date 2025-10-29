/** @type {import('next').NextConfig} */
const isCI =
  process.env.RAILWAY === 'true' ||
  process.env.CI === 'true' ||
  process.env.NEXT_CI_RELAX === '1';

const nextConfig = {
  eslint: { ignoreDuringBuilds: isCI },
  typescript: { ignoreBuildErrors: isCI },
};

module.exports = nextConfig;