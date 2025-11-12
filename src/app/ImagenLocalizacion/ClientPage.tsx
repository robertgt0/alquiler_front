'use client';

import dynamic from 'next/dynamic';

// 👇 importantísimo: NO importes tu componente aquí de forma estática.
// Esto garantiza que el módulo real NUNCA se cargue en el server/build.
const RegistroImagen = dynamic(
  () => import('./components/RegistroImagen'),
  { ssr: false } // ← evita SSR por completo para ese módulo
);

export default function ImagenLocalizacionClient() {
  return <RegistroImagen />;
}
