// app/epic_VerDetallesAmbos/api.ts
import { fetchTrabajosCliente } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/services/api';
import { fetchTrabajosProveedor } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaProveedor/services/api';
import type { Job } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/interfaces/types';



export type Role = 'cliente' | 'proveedor';

/** Devuelve un trabajo por ID usando el rol para decidir qué servicio llamar */
export async function fetchJobByIdRole(id: string, role: Role): Promise<Job | null> {
  const list = role === 'cliente'
    ? await fetchTrabajosCliente('cliente_abc')
    : await fetchTrabajosProveedor('proveedor_123');

  return list.find(j => j.id === id) ?? null;
}
