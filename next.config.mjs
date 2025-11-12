/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      // ✅ NUEVO: Agregar Flaticon
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      }
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;