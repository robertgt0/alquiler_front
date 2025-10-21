"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/img1.jpg",
    title: "Servicios de plomería a domicilio",
    description:
      "Profesionales calificados listos para ayudarte con reparaciones y mantenimiento del hogar.",
  },
  {
    image: "/img2.jpg",
    title: "Electricistas confiables y rápidos",
    description:
      "Soluciones seguras para instalaciones, mantenimiento y emergencias eléctricas.",
  },
  {
    image: "/img3.jpg",
    title: "Expertos en pintura y remodelación",
    description: "Transforma tus espacios con calidad y acabados profesionales.",
  },
];

import Image from 'next/image';

export default function CarruselInspirador() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-blue-50 to-white border border-blue-100 mx-auto max-w-[95%] md:max-w-[90%]">
      {/* Contenedor deslizante */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center justify-center w-full flex-shrink-0 p-4 md:p-0"
          >
            {/* Imagen */}
            <div className="w-full md:w-1/2 flex justify-center items-center bg-blue-100 rounded-2xl md:rounded-none md:rounded-l-2xl">
              <Image
                src={slide.image}
                alt={slide.title}
                width={800}
                height={600}
                className="w-3/4 sm:w-2/3 md:w-full h-auto max-h-64 sm:max-h-80 md:max-h-[420px] object-contain rounded-2xl md:rounded-none md:rounded-l-2xl shadow-md bg-white"
              />
            </div>

            {/* Texto */}
            <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col justify-center items-center md:items-start text-center md:text-left">
              {/* En celular el título va arriba de la descripción */}
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-3 text-[#2a87ff]">
                {slide.title}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 max-w-[85%] md:max-w-none">
                {slide.description}
              </p>

              {/* Botón centrado en móvil */}
              <Link href="/no-encontrado">
                <button className="bg-[#2a87ff] text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-blue-600 transition">
                  Ver más
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2a87ff] rounded-full p-2 shadow-md transition"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2a87ff] rounded-full p-2 shadow-md transition"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current ? "bg-[#2a87ff] scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};


