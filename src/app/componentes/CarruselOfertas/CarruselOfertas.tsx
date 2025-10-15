

'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function  CarruselOfertas() {
  const servicios = [
    { id: 1, nombre: 'Consultoría Digital', descripcion: 'Soluciones tecnológicas personalizadas para tu negocio', img: '/servicios/servicio1.jpg' },
    { id: 2, nombre: 'Desarrollo Web', descripcion: 'Aplicaciones web modernas y escalables', img: '/servicios/servicio2.jpg' },
    { id: 3, nombre: 'Diseño UX/UI', descripcion: 'Experiencias de usuario intuitivas y atractivas', img: '/servicios/servicio3.jpg' },
    { id: 4, nombre: 'Marketing Digital', descripcion: 'Estrategias de crecimiento online', img: '/servicios/servicio4.jpg' },
    { id: 5, nombre: 'Cloud Solutions', descripcion: 'Infraestructura en la nube optimizada', img: '/servicios/servicio5.jpg' },
    { id: 6, nombre: 'Analítica Avanzada', descripcion: 'Insights basados en datos para decisiones inteligentes', img: '/servicios/servicio6.jpg' },
    { id: 7, nombre: 'Ciberseguridad', descripcion: 'Protección integral de tus activos digitales', img: '/servicios/servicio7.jpg' },
    { id: 8, nombre: 'Soporte Técnico', descripcion: 'Asistencia especializada 24/7', img: '/servicios/servicio8.jpg' },
    { id: 9, nombre: 'Transformación Digital', descripcion: 'Modernización completa de procesos', img: '/servicios/servicio9.jpg' },
    { id: 10, nombre: 'E-commerce', descripcion: 'Plataformas de venta online optimizadas', img: '/servicios/servicio10.jpg' },
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














  
}