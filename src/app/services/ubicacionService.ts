const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface UbicacionFromAPI {
  _id: string;
  nombre: string;
  posicion: {
    lat: number;
    lng: number;
  };
  direccion?: string;
  tipo?: string;
}

export const obtenerUbicacionesFromAPI = async (): Promise<UbicacionFromAPI[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ubicaciones`);
    
    if (!response.ok) {
      throw new Error('Error al obtener ubicaciones');
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error fetching ubicaciones:', error);
    throw error;
  }
};