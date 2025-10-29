import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // El bloque 'experimental' puede borrarse si queda vacío
  
  // La configuración de 'turbo' ahora se llama 'turbopack'
  // y va en el nivel superior, fuera de 'experimental'.
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig;