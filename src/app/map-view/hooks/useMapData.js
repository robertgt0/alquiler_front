import { useState, useEffect } from 'react';

export default function useMapData() {
  const [fixers, setFixers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFixer, setSelectedFixer] = useState(null);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const mockFixers = [
        {
          id: 1,
          name: 'Juan Pérez',
          description: 'Plomero con 10 años de experiencia. Especializado en instalaciones y reparaciones de cañerías, grifos y sistemas de agua.',
          whatsapp: '59171234567',
          lat: -17.3895,
          lng: -66.1568,
          category: 'plomeria',
          rating: 4.5,
          photos: [
            'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500',
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'
          ]
        },
        {
          id: 2,
          name: 'María García',
          description: 'Electricista certificada. Instalaciones eléctricas residenciales y comerciales. Trabajos garantizados.',
          whatsapp: '59172345678',
          lat: -17.3945,
          lng: -66.1620,
          category: 'electricidad',
          rating: 4.8,
          photos: [
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500'
          ]
        },
        {
          id: 3,
          name: 'Carlos Rodríguez',
          description: 'Carpintero especializado en muebles a medida, puertas y ventanas. Trabajo de calidad y buen precio.',
          whatsapp: '59173456789',
          lat: -17.3915,
          lng: -66.1500,
          category: 'carpinteria',
          rating: 4.7,
          photos: [
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500',
            'https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=500'
          ]
        },
        {
          id: 4,
          name: 'Ana López',
          description: 'Pintora profesional. Pintura de interiores y exteriores. Acabados de alta calidad.',
          whatsapp: '59174567890',
          lat: -17.3875,
          lng: -66.1590,
          category: 'pintura',
          rating: 4.6,
          photos: [
            'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500'
          ]
        },
        {
          id: 5,
          name: 'Pedro Sánchez',
          description: 'Plomero y gasista. Instalación y mantenimiento de sistemas de gas y agua. Disponible 24/7.',
          whatsapp: '59175678901',
          lat: -17.3960,
          lng: -66.1545,
          category: 'plomeria',
          rating: 4.9,
          photos: [
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'
          ]
        }
      ];

      setFixers(mockFixers);
      setLoading(false);
    }, 1000);
  }, []);

  return {
    fixers,
    loading,
    selectedFixer,
    setSelectedFixer
  };
}