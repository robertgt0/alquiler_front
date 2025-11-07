'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import AccesoRestringido from './accesoRestringido'; 

export default function CarruselOfertas() {
  const servicios = [
    { id: 1, nombre: 'Consultoría Digital', descripcion: 'Soluciones tecnológicas personalizadas para tu negocio', img: '/servicio1.jpg' },
    { id: 2, nombre: 'Desarrollo Web', descripcion: 'Aplicaciones web modernas y escalables', img: '/servicio2.jpg' },
    { id: 3, nombre: 'Diseño UX/UI', descripcion: 'Experiencias de usuario intuitivas y atractivas', img: '/servicio3.jpg' },
    { id: 4, nombre: 'Marketing Digital', descripcion: 'Estrategias de crecimiento online', img: '/servicio4.jpg' },
    { id: 5, nombre: 'Cloud Solutions', descripcion: 'Infraestructura en la nube optimizada', img: '/servicio5.jpg' },
    { id: 6, nombre: 'Analítica Avanzada', descripcion: 'Insights basados en datos para decisiones inteligentes', img: '/servicio6.jpg' },
    { id: 7, nombre: 'Ciberseguridad', descripcion: 'Protección integral de tus activos digitales', img: '/servicio7.jpg' },
    { id: 8, nombre: 'Soporte Técnico', descripcion: 'Asistencia especializada 24/7', img: '/servicio8.jpg' },
    { id: 9, nombre: 'Transformación Digital', descripcion: 'Modernización completa de procesos', img: '/servicio9.jpg' },
    { id: 10, nombre: 'E-commerce', descripcion: 'Plataformas de venta online optimizadas', img: '/servicio10.jpg' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<{id: number, nombre: string} | null>(null);

  // Función para mostrar el modal de acceso restringido
  const handleServiceClick = (servicioId: number, servicioNombre: string) => {
    setSelectedService({ id: servicioId, nombre: servicioNombre });
    setShowModal(true);
    setIsAutoPlaying(false); // Pausar autoplay cuando se muestra el modal
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setIsAutoPlaying(true); // Reanudar autoplay al cerrar el modal
  };

  // Configuración responsive
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);

    return () => {
      window.removeEventListener('resize', updateVisibleCards);
    };
  }, []);

  const maxIndex = 7;

  // ✅ CORRECCIÓN: Lógica para avanzar al siguiente slide (usando useCallback)
  const nextSlide = useCallback(() => {
    setCurrentIndex(current => current >= maxIndex ? 0 : current + 1);
  }, [maxIndex]);

  // Lógica para retroceder al slide anterior
  const prevSlide = () => {
    setCurrentIndex(current => current <= 0 ? maxIndex : current - 1);
  };

  // Lógica para ir a un slide específico
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // ✅ CORRECCIÓN: Funcionalidad de autoplay (con dependencias corregidas)
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]); // ✅ nextSlide ahora es estable por useCallback

  return (
    <>
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluciones integrales diseñadas para impulsar el crecimiento de tu empresa
            </p>
          </div>

          {/* Carousel Container */}
          <div 
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100"
              aria-label="Anterior"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100"
              aria-label="Siguiente"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{transform:`translateX(-${currentIndex * (100 / visibleCards)}%)`}}
              >
                {servicios.map((servicio) => (
                  <div
                    key={servicio.id}
                    className={`shrink-0 px-3 transition-all duration-300 ${
                      visibleCards === 1 ? 'w-full' :
                      visibleCards === 2 ? 'w-1/2' : 'w-1/3'
                    }`}
                  >
                    <div 
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col cursor-pointer"
                      onClick={() => handleServiceClick(servicio.id, servicio.nombre)}
                    >
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={servicio.img}
                          alt={servicio.nombre}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                          {servicio.nombre}
                        </h3>
                        <p className="text-gray-600 flex-1 leading-relaxed">
                          {servicio.descripcion}
                        </p>
                        <button 
                          className="mt-4 text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceClick(servicio.id, servicio.nombre);
                          }}
                        >
                          Más información
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Acceso Restringido */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <AccesoRestringido 
              servicioNombre={selectedService?.nombre}
              servicioId={selectedService?.id?.toString()}
              onClose={closeModal}
              isModal={true}
            />
          </div>
        </div>
      )}
    </>
  );
}