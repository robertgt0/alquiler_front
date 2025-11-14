// app/epic_VerDetallesAmbos/services/api.ts
import { fetchTrabajosCliente } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/services/api';
import { fetchTrabajosProveedor } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaProveedor/services/api';
import type { Job } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/interfaces/types';

export type Role = 'cliente' | 'proveedor';

// IDs reales del backend
const CLIENTE_ID = '6902c31538df4e88b6680634';

// 🔹 TEMPORAL: Deja vacío si no tienes el ID del proveedor aún
// const PROVEEDOR_ID = ''; // Actualiza con el ID real cuando lo tengas

/** Devuelve un trabajo por ID usando el rol para decidir qué servicio llamar */
export async function fetchJobByIdRole(id: string, role: Role): Promise<Job | null> {
  try {
    let list: Job[];
    
    if (role === 'cliente') {
      list = await fetchTrabajosCliente(CLIENTE_ID);
    } else {
      // Para proveedor: usa fetchTrabajosProveedor() sin parámetros (según tu API)
      list = await fetchTrabajosProveedor();
    }

    return list.find(j => j.id === id) ?? null;
  } catch (error) {
    console.error(`Error al obtener trabajo por ID (${role}):`, error);
    return null;
  }
}