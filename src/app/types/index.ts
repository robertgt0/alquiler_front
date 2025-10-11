export interface Ubicacion {
  id: number;
  nombre: string;
  posicion: [number, number];
  description?: string;
}

export interface Fixer {
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