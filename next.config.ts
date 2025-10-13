import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // Especificar el directorio raíz para evitar el warning
      root: process.cwd(),
    },
  },
}

export default nextConfig;
