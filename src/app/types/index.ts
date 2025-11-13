export interface UbicacionFromAPI {
  _id: string;
  nombre: string;
  posicion: {
    lat: number;
    lng: number;
  };
  direccion?: string;
  tipo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ubicacion {
  id: number;
  nombre: string;
  posicion: [number, number];
  description?: string;
}

export interface Fixer {
  imagenPerfil: string;
  _id: string;
  nombre: string;
  posicion: {
    lat: number;
    lng: number;
  };
  especialidad: string;
  descripcion?: string;
  rating?: number;
  whatsapp?: string;
  verified?: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}