"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const slides = [
  {
    image: "/img1.jpg",
    title: "Servicios de plomería a domicilio",
    description:
      "Contamos con profesionales calificados para atender cualquier emergencia en tu hogar.",
  },
  {
    image: "/img2.jpg",
    title: "Electricistas certificados",
    description:
      "Encuentra electricistas con experiencia y garantía de servicio.",
  },
  {
    image: "/img3.jpg",
    title: "Limpieza profesional",
    description:
      "Servicios de limpieza para hogares, oficinas y negocios con los mejores precios.",
  },
];

const CarruselInspirador: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  // --- 🔹 Efecto scroll suave (más lento y 2500px hacia abajo) ---
  const handleVerMas = () => {
    const start = window.scrollY;
    const end = start + 2500; // distancia más grande hacia abajo
    const duration = 2500; // duración más larga = animación más visible
    let startTime: number | null = null;

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const scroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      window.scrollTo(0, start + (end - start) * ease);

      if (elapsed < duration) requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  };
  // --- 🔹 Fin del efecto scroll ---

  // --- 🔹 Redirección corregida ---
  const handlePorQueServineo = () => {
    router.push("/porqueservineo"); // ✅ coincide con tu carpeta src/app/porqueservineo/page.tsx
  };

  return (
    <section className="relative w-full h-[420px] overflow-hidden rounded-2xl shadow-lg bg-white flex">
      {/* Imagen a la izquierda */}
      <div className="relative w-1/2 h-full">
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          fill
          className="object-cover object-center transition-transform duration-[2000ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        />
      </div>

      {/* Contenido a la derecha */}
      <div className="w-1/2 flex flex-col justify-center items-center text-center px-8 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
          {slides[current].title}
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md">
          {slides[current].description}
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleVerMas}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-full shadow-md"
          >
            Ver más
          </button>
          <button
            onClick={handlePorQueServineo}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-full shadow-md"
          >
            ¿Por qué elegir Servineo?
          </button>
        </div>
      </div>

      {/* Flechas de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full"
      >
        <ChevronLeft className="text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full"
      >
        <ChevronRight className="text-white" />
      </button>
    </section>
  );
};

export default CarruselInspirador;