'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// === Tiempo en milisegundos para cambiar automáticamente la diapositiva (5 segundos) ===
const AUTOPLAY_DELAY = 5000; 

// ESTRUCTURA DE DATOS ACTUALIZADA con Título y Descripción
const images = [
  { 
    src: '/carrusel-img-1.jpg', 
    alt: 'Propiedad 1', 
    title: 'Acogedor Apartamento en el Centro',
    description: 'Perfecto para familias. Cuenta con 3 dormitorios, piscina comunitaria y un balcón con vistas a la ciudad. Disfrute de la vida urbana con todas las comodidades.'
  },
  { 
    src: '/carrusel-img-2.jpg', 
    alt: 'Propiedad 2', 
    title: 'Lujosa Residencia con Jardín',
    description: 'Una oportunidad única. Diseño moderno, acabados de mármol y un amplio jardín privado, ideal para mascotas. La ubicación es privilegiada.'
  },
  { 
    src: '/carrusel-img-3.jpg', 
    alt: 'Propiedad 3', 
    title: 'Estudio Económico Cerca de la Universidad',
    description: 'Ideal para estudiantes o profesionales solteros. Incluye todos los servicios básicos y está a 5 minutos caminando de la facultad, en una zona tranquila.'
  },
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Hook para el Autoplay
  useEffect(() => {
    if (images.length < 2) return;
    const intervalId = setInterval(nextSlide, AUTOPLAY_DELAY);
    return () => clearInterval(intervalId);
  }, [nextSlide]); 

  if (images.length === 0) {
    return <p className="text-center p-8 text-gray-500">No hay imágenes disponibles para el carrusel.</p>;
  }

  const currentImage = images[currentIndex];

  return (
    // CONTENEDOR PRINCIPAL: Usa Tailwind para centrar y limitar el ancho.
    <div 
      className="max-w-6xl mx-auto rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800"
      // Eliminamos el .carousel-container y lo reemplazamos con clases de Tailwind
    >
      
      {/* CONTENEDOR FLEXBOX: Coloca la imagen (60%) y la descripción (40%) lado a lado */}
      <div className="flex items-start w-full">
        
        {/* LADO IZQUIERDO: IMAGEN Y BOTONES (60% del ancho) */}
        <div className="relative w-3/5 carousel-image-wrapper group">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill 
            sizes="60vw"
            className="carousel-image transition-opacity duration-700 ease-in-out"
            priority={currentIndex === 0}
          />

          {/* Botones de Navegación (Superpuestos en la Imagen) */}
          <button 
            className="carousel-button prev opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-xl font-bold"
            onClick={goToPrevious}
            aria-label="Imagen anterior"
          >
            &lt;
          </button>

          <button 
            className="carousel-button next opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-xl font-bold"
            onClick={nextSlide} // Usamos nextSlide para mantener la lógica de autoplay limpia
            aria-label="Imagen siguiente"
          >
            &gt;
          </button>

          {/* Indicadores de Puntos (Superpuestos en la Imagen) */}
          <div className="carousel-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>

        </div>

        {/* LADO DERECHO: CUADRO DE DESCRIPCIÓN (40% del ancho) */}
        <div className="w-2/5 p-6 border-l border-gray-200 dark:border-gray-700 h-full">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase">
            Propiedad Destacada
          </h4>
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">
            {currentImage.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {currentImage.description}
          </p>
          <div className="mt-6">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Carousel;