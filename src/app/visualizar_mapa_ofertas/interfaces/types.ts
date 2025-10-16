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
}

// Tipo para configuración del mapa
export interface MapConfig {
  center: Location;
  zoom: number;
}