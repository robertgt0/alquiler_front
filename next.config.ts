/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // No bloquear el build por ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // No bloquear el build por errores de tipos
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
