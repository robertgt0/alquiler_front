// src/app/components/Carousel/Carousel.tsx

'use client'; // ¡IMPORTANTE! Marca este componente como Cliente en Next.js

import React, { useState } from 'react';

// === PASO 1.2: DEFINIR LAS RUTAS DE LAS IMÁGENES ===
const images = [
  '/carrusel-img-1.jpg', // ASUME que esta imagen está en la carpeta /public
  '/carrusel-img-2.jpg',
  '/carrusel-img-3.jpg',
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    // Va a la anterior o salta a la última si es la primera
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    // Va a la siguiente o salta a la primera si es la última
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (images.length === 0) {
    return null; // No muestra nada si no hay imágenes
  }

  return (
    <div className="carousel-container">
      {/* Botón Izquierda */}
      <button className="carousel-button prev" onClick={goToPrevious} title="Anterior">
        &lt;
      </button>

      {/* Imagen Actual */}
      <div className="carousel-image-wrapper">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="carousel-image"
        />
      </div>

      {/* Botón Derecha */}
      <button className="carousel-button next" onClick={goToNext} title="Siguiente">
        &gt;
      </button>
      
      {/* Indicadores (Dots) */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;