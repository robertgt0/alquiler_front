'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// === Tiempo en milisegundos para cambiar automáticamente la diapositiva (5 segundos) ===
const AUTOPLAY_DELAY = 5000; 

// === Configuración de las imágenes (Solo 3 imágenes, para coincidir con la carpeta public) ===
const images = [
  { src: '/carrusel-img-1.jpg', alt: 'Propiedad 1' },
  { src: '/carrusel-img-2.jpg', alt: 'Propiedad 2' },
  { src: '/carrusel-img-3.jpg', alt: 'Propiedad 3' },
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Usamos useCallback para que la función sea estable
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

  const goToNext = () => {
    nextSlide();
  };

  // === Hook para el Autoplay (ROTACIÓN ESTABLE cada 5 segundos) ===
  useEffect(() => {
    if (images.length < 2) return;

    // Usamos setInterval estable
    const intervalId = setInterval(nextSlide, AUTOPLAY_DELAY);

    // Limpia el temporizador al desmontar el componente
    return () => clearInterval(intervalId);
  }, [nextSlide]); // Dependencia estable

  if (images.length === 0) {
    return <p className="text-center p-8 text-gray-500">No hay imágenes disponibles para el carrusel.</p>;
  }

  const currentImage = images[currentIndex];

  return (
    <div 
      // CLASES CORREGIDAS: Usamos tu clase nativa '.carousel-container' para el ancho y centrado.
      className="carousel-container group"
      onMouseEnter={() => {}} 
      onMouseLeave={() => {}} 
    >
      
      {/* Contenedor de la Imagen: Usamos tu clase nativa para la altura */}
      <div className="carousel-image-wrapper">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          layout="fill"
          objectFit="cover"
          priority={currentIndex === 0}
          className="carousel-image" // Usamos tu clase nativa para la imagen
        />
      </div>

      {/* Botón Izquierda */}
      <button 
        className="carousel-button prev"
        onClick={goToPrevious}
        aria-label="Imagen anterior"
      >
        &lt; {/* Carácter HTML de flecha izquierda */}
      </button>

      {/* Botón Derecha */}
      <button 
        className="carousel-button next"
        onClick={goToNext}
        aria-label="Imagen siguiente"
      >
        &gt; {/* Carácter HTML de flecha derecha */}
      </button>

      {/* Indicadores de Puntos */}
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
  );
};

export default Carousel;

