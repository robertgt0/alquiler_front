// postcss.config.mjs
// (Si tu archivo se llama postcss.config.js, renómbralo a .mjs)

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}

export default config;
