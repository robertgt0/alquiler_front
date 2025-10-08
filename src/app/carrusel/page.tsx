"use client"; // Necesario para usar useEffect

/* eslint-disable */
// @ts-nocheck

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import Image from 'next/image'; 

export default function Page() {
  
  // Activa el JS de Bootstrap para que el carrusel funcione.
  useEffect(() => {
    // Usamos require() para evitar problemas de tipado con TypeScript.
    require('bootstrap/dist/js/bootstrap.bundle.min.js'); 
  }, []); 

  return (
    // 👈 CONTENEDOR PRINCIPAL:
    // - my-5: Margen vertical (arriba/abajo) para darle espacio al header/footer.
    // - col-md-8 col-lg-6: Limita el ancho a tamaño mediano/pequeño en pantallas grandes.
    // - mx-auto: Centra el bloque horizontalmente en la página.
    <div className="container my-5 col-md-8 col-lg-6 mx-auto">
        
      {/* Componente del Carrusel */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        
        <div className="carousel-inner">
          {/* Ítem 1: ACTIVO */}
          <div className="carousel-item active">
            <Image 
              src="/carrusel_images/img1.jpg" 
              className="d-block w-100" 
              alt="Imagen 1 del Carrusel" 
              width={1200} // Se escalará dentro del contenedor 'col-lg-6'
              height={600} 
              priority
            />
          </div>

          {/* Ítem 2 */}
          <div className="carousel-item">
            <Image 
              src="/carrusel_images/img2.jpg" 
              className="d-block w-100" 
              alt="Imagen 2 del Carrusel" 
              width={1200} 
              height={600} 
            />
          </div>

          {/* Ítem 3 */}
          <div className="carousel-item">
            <Image 
              src="/carrusel_images/img3.jpg" 
              className="d-block w-100" 
              alt="Imagen 3 del Carrusel" 
              width={1200} 
              height={600} 
            />
          </div>
        </div>
        
        {/* Botones de control: Anterior */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>

        {/* Botones de control: Siguiente */}
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div> 
  );
}