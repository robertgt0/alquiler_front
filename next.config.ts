<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    
    ignoreDuringBuilds: true,
  },
  typescript: {
    
    ignoreBuildErrors: true,
  },
=======
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // (Opcional) No frena el build por errores de TypeScript
  typescript: { ignoreBuildErrors: true },
>>>>>>> dev/bitcrew-sprint2
};

export default nextConfig;