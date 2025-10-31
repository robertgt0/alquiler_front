import React from 'react';

const resolveImage = (imagen: string | undefined) => {
  if (!imagen) return '/images/portfolio/placeholder.jpg';
  // Si la imagen ya comienza con http o https, usarla directamente
  if (imagen.startsWith('http')) return imagen;
  // Si la imagen comienza con / es una ruta desde public
  if (imagen.startsWith('/')) return imagen;
  // Si no, asumimos que está en la carpeta de carpinteria
  return `/images/portfolio/carpinteria/${imagen}`;
};

import Image from 'next/image';

const defaultImages = [
  {
    id: 1,
    imagen: '/images/portfolio/carpinteria/restauracion-silla.jpg',
    titulo: 'Restauración de Silla Clásica',
    descripcion: 'Trabajo detallado de restauración completa, incluyendo lijado, refuerzo de estructura y acabado barnizado.'
  },
  {
    id: 2,
    imagen: '/images/portfolio/carpinteria/mueble-modular.jpg',
    titulo: 'Mueble Modular en Proceso',
    descripcion: 'Construcción de mueble modular personalizado mostrando la calidad del trabajo interno y estructural.'
  },
  {
    id: 3,
    imagen: '/images/portfolio/carpinteria/mesa-comedor.jpg',
    titulo: 'Mesa de Comedor de Madera Maciza',
    descripcion: 'Fabricación de mesa robusta en madera noble con acabado premium y barniz protector.'
  },
  {
    id: 4,
    imagen: '/images/portfolio/carpinteria/set-sillas.jpg',
    titulo: 'Set de Sillas de Madera',
    descripcion: 'Conjunto de sillas a medida con diseño elegante y acabado en barniz brillante.'
  }
];

import { Portfolio } from '../types/usuario.types';

const PortfolioGrid = ({ portfolio, serverOrigin }: { portfolio?: Portfolio[]; serverOrigin: string }) => {
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
                src={resolveImage(p.imagen)}
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