"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    image: "/img1.jpg",
    title: "Servicios de plomería a domicilio",
    description:
      "Profesionales calificados listos para ayudarte con reparaciones y mantenimiento del hogar. Atendemos urgencias y proyectos grandes o pequeños.",
  },
  {
    image: "/img2.jpg",
    title: "Servicios de albañilería y construcción",
    description:
      "Expertos en remodelaciones, ampliaciones y trabajos estructurales con materiales de calidad y acabados profesionales.",
  },
  {
    image: "/img3.jpg",
    title: "Carpinteros especializados en muebles y estructuras",
    description:
      "Diseñamos, reparamos y fabricamos muebles personalizados con precisión y dedicación artesanal.",
  },
];

export default function CarruselInspirador() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [current, isPaused]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Scroll animado manual más lento
  const smoothScrollTo = (targetY: number, duration = 1400) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime: number | null = null;

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      window.scrollTo(0, startY + distance * ease);
      if (progress < 1) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector("#trabajos-recientes");
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - 50;
      smoothScrollTo(y, 1500); // scroll más suave (~1.5s)
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-white border border-blue-100 mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Contenedor deslizante */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center justify-center w-full flex-shrink-0"
          >
            {/* Imagen a la izquierda sin espacio azul */}
            <div className="w-full md:w-1/2 h-[360px] sm:h-[420px] md:h-[460px] relative">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Texto a la derecha */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center items-center md:items-start text-center md:text-left bg-white">
              <h2 className="text-xl sm:text-3xl font-bold mb-3 text-[#2a87ff]">
                {slide.title}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 max-w-[90%] md:max-w-none">
                {slide.description}
              </p>

              <a
                href="#trabajos-recientes"
                onClick={handleScroll}
                className="inline-block px-6 py-3 bg-[#2a87ff] text-white rounded-lg text-sm sm:text-base hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Ver más
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Flechas de navegación */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 text-[#2a87ff] rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-[#2a87ff] hover:text-white"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 text-[#2a87ff] rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-[#2a87ff] hover:text-white"
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
}
