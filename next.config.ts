// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No frena el build por ESLint
  eslint: { ignoreDuringBuilds: true },

  // (Opcional) No frena el build por errores de TypeScript
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;