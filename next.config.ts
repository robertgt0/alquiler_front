import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Especificar el directorio raíz para evitar el warning
    root: process.cwd()
  },
}

export default nextConfig;
