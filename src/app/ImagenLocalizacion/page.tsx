import ImagenLocalizacionClient from './ClientPage';

// Fuerza que la ruta no se prerenderice ni se cachee
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ImagenLocalizacionPage() {
  return <ImagenLocalizacionClient />;
}
