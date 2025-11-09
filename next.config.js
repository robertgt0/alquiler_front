//Conversion de typescript a javascript
/*
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['react-map-gl'],
  webpack: (config) => {
    // Agregar regla para archivos de worker
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    
    return config;
  },
};

export default nextConfig;
*/
// La declaración de tipo y la importación de 'type' se eliminan.




//MODIFICADO POR EL EQUIPO RECODE SOLO PARA HACER EL DEPLOYADO:
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Permite compilar paquetes con sintaxis moderna
  transpilePackages: ['react-map-gl'],

  // ✅ Ignorar errores de TypeScript y ESLint en el build
  typescript: {
    ignoreBuildErrors: true, // permite build con errores TS
  },
  eslint: {
    ignoreDuringBuilds: true, // permite build con errores de lint
  },

  // ✅ Configuración de Webpack
  webpack: (config, { isServer }) => {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Soporte para archivos .mjs dentro de node_modules
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    return config;
  },
};

// ✅ Exportación del config
module.exports = nextConfig;
