/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ✅ ELIMINADO: domains está deprecado
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      }
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  // ✅ ELIMINADO: optimizeFonts ya no es necesario (viene activado por defecto)
};

export default nextConfig;