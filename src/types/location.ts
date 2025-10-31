// src/types/location.ts

/**
 * Interfaz para los datos de ubicación de un spot de windsurf
 */
export interface LocationData {
  name: string; // Nombre del spot
  address: string; // Dirección completa del autocompletado
  latitude: number | null; // Coordenada Latitud
  longitude: number | null; // Coordenada Longitud
  notes: string; // Notas adicionales
  // Campos específicos de Windsurf
  bestWindDirections: ('N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW')[]; // Multi-select
  idealSeason: string; // Texto libre o futuro select
  amenities: { // Checkboxes
    parking: boolean;
    rescueService: boolean;
    food: boolean;
  };
}

/**
 * Valores por defecto para el formulario
 */
export const defaultLocationData: LocationData = {
  name: '',
  address: '',
  latitude: null,
  longitude: null,
  notes: '',
  bestWindDirections: [],
  idealSeason: '',
  amenities: {
    parking: false,
    rescueService: false,
    food: false,
  },
};
