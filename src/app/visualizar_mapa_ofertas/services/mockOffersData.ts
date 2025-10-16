import { Offer } from '../interfaces/types';

// Mock data de ofertas en Cochabamba, Bolivia
export const mockOffers: Offer[] = [
  {
    id: '1',
    fixerName: 'Juan Pérez',
    category: 'Plomería',
    description: 'Reparación de tuberías y grifos. 10 años de experiencia.',
    location: { lat: -17.3935, lng: -66.1570 },
    whatsapp: '+59170123456',
    images: ['https://via.placeholder.com/300x200?text=Plomeria'],
    rating: 4.5,
    price: 150,
    status: 'active',
    isActive: true
  },
  {
    id: '2',
    fixerName: 'María Gonzales',
    category: 'Electricidad',
    description: 'Instalaciones eléctricas y mantenimiento.',
    location: { lat: -17.3895, lng: -66.1520 },
    whatsapp: '+59170234567',
    images: ['https://via.placeholder.com/300x200?text=Electricidad'],
    rating: 4.8,
    price: 200,
    status: 'active',
    isActive: true
  },
  {
    id: '3',
    fixerName: 'Carlos Mamani',
    category: 'Carpintería',
    description: 'Muebles a medida y reparaciones en madera.',
    location: { lat: -17.3985, lng: -66.1620 },
    whatsapp: '+59170345678',
    images: ['https://via.placeholder.com/300x200?text=Carpinteria'],
    rating: 4.2,
    price: 180,
    status: 'active',
    isActive: true
  },
  {
    id: '4',
    fixerName: 'Ana Quispe',
    category: 'Limpieza',
    description: 'Limpieza profunda de hogares y oficinas.',
    location: { lat: -17.3850, lng: -66.1480 },
    whatsapp: '+59170456789',
    images: ['https://via.placeholder.com/300x200?text=Limpieza'],
    rating: 4.9,
    price: 120,
    status: 'active',
    isActive: true
  },
  {
    id: '5',
    fixerName: 'Pedro Rojas',
    category: 'Pintura',
    description: 'Pintura de interiores y exteriores. Presupuesto gratis.',
    location: { lat: -17.3965, lng: -66.1590 },
    whatsapp: '+59170567890',
    images: ['https://via.placeholder.com/300x200?text=Pintura'],
    rating: 4.3,
    price: 160,
    status: 'active',
    isActive: true
  },
  {
    id: '6',
    fixerName: 'Lucía Flores',
    category: 'Jardinería',
    description: 'Diseño y mantenimiento de jardines.',
    location: { lat: -17.3920, lng: -66.1545 },
    whatsapp: '+59170678901',
    images: ['https://via.placeholder.com/300x200?text=Jardineria'],
    rating: 4.6,
    price: 140,
    status: 'active',
    isActive: true
  },
  {
    id: '7',
    fixerName: 'Roberto Torrez',
    category: 'Electricidad',
    description: 'Instalaciones eléctricas residenciales.',
    location: { lat: -17.3910, lng: -66.1550 },
    whatsapp: '+59170789012',
    images: ['https://via.placeholder.com/300x200?text=Electricidad'],
    rating: 4.7,
    price: 190,
    status: 'inactive',
    isActive: false
  }
];

// Filtrar solo ofertas activas
export const getActiveOffers = (): Offer[] => {
  return mockOffers.filter(offer => offer.isActive === true);
};