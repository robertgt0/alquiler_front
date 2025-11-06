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

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para permitir que Next.js compile paquetes que usan sintaxis moderna
  transpilePackages: ['react-map-gl'],
  
  // Modificación de la configuración de Webpack
  webpack: (config, { isServer }) => {
    // Asegurarse de que module.rules existe
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Agregar la regla para archivos .mjs dentro de node_modules
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    
    // El return es necesario para devolver la configuración modificada
    return config;
  },
};

// Se mantiene la exportación predeterminada (default export)
module.exports = nextConfig;