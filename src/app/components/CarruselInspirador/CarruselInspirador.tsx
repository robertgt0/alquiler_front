"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // <-- Importamos Framer Motion

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
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
    // Añadimos 'current' para que el temporizador se reinicie en cambios manuales
  }, [isPaused, current]);

  const handleVerMas = () => {
    const start = window.scrollY;
    const end = start + 2500;
    const duration = 2500;
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

  const handlePorQueServineo = () => {
    router.push("/porqueservineo");
  };

  // Definimos las variantes de animación para Framer Motion
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <section
      className="
        relative w-full overflow-hidden shadow-lg bg-white flex flex-col md:flex-row
        h-auto md:h-[420px]
        rounded-none md:rounded-2xl
        !mt-0 !pt-0
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Animación de IMAGEN (con 'fade' usando Tailwind, sin cambios) */}
      <div className="relative w-full md:w-1/2 h-[300px] md:h-full !mt-0 !pt-0">
        {slides.map((slide, index) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            fill
            className={`
              object-cover
              transition-opacity duration-1000 ease-in-out 
              ${index === current ? 'opacity-100' : 'opacity-0'}
            `}
            priority={index === 0}
          />
        ))}
      </div>

      {/* 2. Animación de TEXTO (¡Con Framer Motion!) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center px-6 md:px-8 py-6 md:py-0 bg-gradient-to-r from-gray-50 to-white overflow-hidden">
        {/* AnimatePresence permite animar la salida de componentes que se desmontan */}
        <AnimatePresence mode="wait"> {/* 'wait' espera a que la animación de salida termine antes de montar la nueva */}
          {/* Usamos 'motion.div' y le pasamos las variantes y la 'key' del slide actual */}
          <motion.div
            key={current} // La key es crucial para que Framer Motion sepa que es un nuevo componente
            variants={textVariants} // Nuestras reglas de animación
            initial="initial" // Estado inicial
            animate="animate" // Estado al montar
            exit="exit" // Estado al desmontar (cuando cambia el slide)
            className="w-full" // Para que ocupe todo el ancho disponible
          >
            <h2 className="text-xl md:text-3xl font-bold mb-4 text-gray-800">
              {slides[current].title}
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-md">
              {slides[current].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <button
                onClick={handleVerMas}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-full shadow-md w-full sm:w-auto"
              >
                Ver más
              </button>
              <button
                onClick={handlePorQueServineo}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-full shadow-md w-full sm:w-auto"
              >
                ¿Por qué escoger Servineo?
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flechas */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full z-10"
      >
        <ChevronLeft className="text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full z-10"
      >
        <ChevronRight className="text-white" />
      </button>
      
    </section>
  );
};

export default CarruselInspirador;