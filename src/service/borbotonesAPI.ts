// src/services/borbotonesAPI.ts
const API_BASE_URL = 'http://localhost:5000/api';

export const ordenarBorbotones = async (criterio: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/borbotones/order?orden=${criterio}`);
    
    if (!response.ok) {
      throw new Error('Error al ordenar borbotones');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};