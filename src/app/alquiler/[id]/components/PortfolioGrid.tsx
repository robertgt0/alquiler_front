import React from 'react';

const resolveImage = (url: string | undefined, serverOrigin: string) => {
  if (!url) return '/images/portfolio/placeholder.jpg';
  // si es URL absoluta
  if (/^https?:\/\//i.test(url)) return url;
  // si es relativa (empieza con /), unir con el origen del servidor (sin /api)
  if (url.startsWith('/')) return `${serverOrigin}${url}`;
  // por defecto devolver placeholder
  return url;
};

import Image from 'next/image';

const defaultImages = [
  {
    url: '/portfolio-boda.jpg',
    titulo: 'Decoración con flores y luces LED',
    descripcion: 'Ideal para bodas, quinceañeros o aniversarios'
  },
  {
    url: '/portfolio-babyshower.jpg',
    titulo: 'Decoración temática para baby shower',
    descripcion: 'Incluye fondo decorativo, guirnaldas y carteles personalizados'
  },
  {
    url: '/portfolio-basico.jpg',
    titulo: 'Decoración básica de evento pequeño',
    descripcion: 'Incluye mantel, centro de mesa y algunos globos'
  },
  {
    url: '/portfolio-premium.jpg',
    titulo: 'Decoración completa premium',
    descripcion: 'Incluye todo: fondo temático, iluminación, mesa decorada, flores y cartel personalizado'
  }
];

const PortfolioGrid = ({ portfolio, serverOrigin }: { portfolio?: any[]; serverOrigin: string }) => {
  // Usar las imágenes proporcionadas o las predeterminadas
  const items = portfolio?.length ? portfolio : defaultImages;
  
  return (
    <div className="mt-6 bg-white rounded-xl shadow p-6 border" style={{ borderColor: '#1769ff' }}>
      <h3 className="text-blue-600 font-semibold mb-4">Portafolio y Proyectos Anteriores</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {items.map((p, idx) => (
          <div key={idx} className="group relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 aspect-video hover:shadow-xl transition-all duration-300">
            <div className="relative w-full h-full">
              <Image 
                src={p.url}
                alt={p.titulo || `Proyecto de decoración ${idx + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={idx < 2}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h4 className="text-lg font-semibold mb-1">{p.titulo}</h4>
                <p className="text-sm opacity-90">{p.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGrid;