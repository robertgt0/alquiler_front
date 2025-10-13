// src/app/mis-trabajos-proveedor/services/trabajosApi.ts
import { ITrabajo, TrabajoStatus } from '../interfaces/types';

// La URL base de tu backend
const API_URL = 'http://localhost:5000/api/vengadores/trabajos';

export const fetchTrabajosProveedor = async (estado?: TrabajoStatus): Promise<ITrabajo[]> => {
  let url = `${API_URL}/proveedor`;

  // Si se proporciona un estado, lo añadimos como un query param
  if (estado) {
    url += `?estado=${estado}`;
  }

  // Hacemos la llamada al backend
  const response = await fetch(url, { cache: 'no-store' }); // 'no-store' es para desarrollo, para ver siempre los datos frescos

  if (!response.ok) {
    // Si la respuesta no es exitosa, lanzamos un error
    throw new Error('Error al obtener los trabajos del proveedor');
  }

  const data: ITrabajo[] = await response.json();
  return data;
};