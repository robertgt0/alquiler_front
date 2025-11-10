import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
        heading: ['Roboto', 'Inter', 'sans-serif'],
      },
      colors: {
        servineo: {
          DEFAULT: '#11255a',
          light: '#d8ecff',
          accent: '#52abff',
        },
      },
    },
  },
  plugins: [],
};

export default config;
