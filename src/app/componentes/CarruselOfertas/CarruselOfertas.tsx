'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function  CarruselOfertas() {
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

  const maxIndex = Math.ceil(servicios.length / visibleCards) - 1;

  const nextSlide = () => {
    setCurrentIndex(current => current >= maxIndex ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(current => current <= 0 ? maxIndex : current - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, maxIndex, nextSlide]);

  return (
    <div id="ofertas" className="text-center py-10 bg-gray-50">
      <h2 className="text-3xl font-bold text-[#2a87ff] mb-3">
        Carrusel de Ofertas
      </h2>
      <p className="text-gray-600">
        (Aquí puedes poner otro carrusel con ofertas de trabajo)
      </p>
    </div>
  );
}