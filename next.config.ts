/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- De la rama HEAD ---
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

  // --- De la rama b5bd7fd... ---
  eslint: {
    // Deshabilita ESLint durante el 'build'
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Deshabilita la comprobación de errores de TS durante el 'build'
    ignoreBuildErrors: true,
  },
};

export default nextConfig;