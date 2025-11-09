// Tipos para ubicación geográfica
export interface Location {
  lat: number;
  lng: number;
}

// Tipo para ofertas de trabajo
export interface Offer {
  id: string;
  fixerName: string;
  category: string;
  description: string;
  location: Location;
  whatsapp: string;
  images: string[];
  rating: number;
  price: number;
  status: 'active' | 'inactive';
  isActive?: boolean; // Para HU12: filtrar ofertas activas
}

// Tipo para configuración del mapa
export interface MapConfig {
  center: Location;
  zoom: number;
}

// Tipo para marcadores personalizados (HU12)
export interface MarkerConfig {
  category: string;
  color: string;
  icon: string;
}