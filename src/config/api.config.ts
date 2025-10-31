// Configuración centralizada de las URLs de la API
const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  ENDPOINTS: {
    USUARIOS: '/borbotones/usuarios',
    BUSQUEDA: '/borbotones/search',
    HISTORIAL: '/borbotones/search/history',
    DEPARTAMENTOS: '/borbotones/departamentos',
    ESPECIALIDADES: '/borbotones/especialidades',
    FILTROS: '/borbotones/filtros',
    ORDEN: '/borbotones/order'
  }
};

export const getApiUrl = (endpoint: keyof typeof API.ENDPOINTS) => {
  return `${API.BASE_URL}${API.ENDPOINTS[endpoint]}`;
};

// Función helper para hacer fetch con manejo de errores consistente
export async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Error en fetchApi:', error);
    throw error;
  }
}

export default API;