import { Offer } from '../interfaces/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface BackendOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  fixerName: string;
  fixerId: string;
  whatsapp: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  images: string[];
  isActive: boolean;
  createdAt: string;
}

interface ApiResponse {
  total: number;
  offers: BackendOffer[];
}

/**
 * Transforma los datos del backend al formato que usa el frontend
 */
function transformBackendOffer(backendOffer: BackendOffer): Offer {
  return {
    id: backendOffer.id,
    fixerName: backendOffer.fixerName,
    category: backendOffer.category,
    description: backendOffer.description,
    location: {
      lat: backendOffer.location.lat,
      lng: backendOffer.location.lng,
    },
    whatsapp: backendOffer.whatsapp,
    images: backendOffer.images.length > 0 
      ? backendOffer.images 
      : ['https://via.placeholder.com/300x200?text=Sin+Imagen'],
    rating: backendOffer.rating,
    price: backendOffer.price,
    status: backendOffer.isActive ? 'active' : 'inactive',
    isActive: backendOffer.isActive,
  };
}

/**
 * Obtiene todas las ofertas con datos de fixers desde el backend
 */
export async function fetchOffersWithFixers(): Promise<Offer[]> {
  try {
    const response = await fetch(`${API_URL}/api/offers/map-data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // No cachear para obtener datos frescos
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    // Transformar los datos del backend al formato del frontend
    return data.offers.map(transformBackendOffer);
  } catch (error) {
    console.error('Error al obtener ofertas del backend:', error);
    
    // Si falla, devolver array vacío (puedes cambiar esto por mockOffers si prefieres)
    return [];
  }
}

/**
 * Obtiene solo las ofertas activas
 */
export async function fetchActiveOffers(): Promise<Offer[]> {
  const allOffers = await fetchOffersWithFixers();
  return allOffers.filter(offer => offer.isActive === true);
}