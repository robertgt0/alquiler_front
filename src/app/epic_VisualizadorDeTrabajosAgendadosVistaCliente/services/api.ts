// src/app/epic-VisualizadorDeTrabajosAgendadosVistaCliente/services/api.ts
import { Job } from './interfaces/types'; // 1. Importa el types.ts local

// 2. Importamos los 'helpers' desde la carpeta del PROVEEDOR (para reutilizar)
import { convertirAISO, normalizarEstado } from '../../epic-VisualizadorDeTrabajosAgendadosVistaProveedor/utils/helpers';

// 3. Definimos la URL del backend real
const API_URL = 'http://localhost:5000/api/los_vengadores/trabajos';

// --- FUNCIÓN PARA LA VISTA DEL CLIENTE (HU 1.8) ---
// Esta función SÍ se conecta al backend real
export async function fetchTrabajosCliente(clienteId: string): Promise<Job[]> {
  const res = await fetch(`${API_URL}/cliente/${clienteId}`, { cache: 'no-store' });

  if (!res.ok) throw new Error('Error al obtener trabajos del cliente');
  const data = await res.json();

  // 4. Mapeamos la respuesta de la BD (con _id) al formato del frontend (con id)
  return data.map((t: any) => ({
    id: t._id,
    providerName: t.id_proveedor.nombre, // Usamos el nombre del proveedor "populado"
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.hora_inicio),
    endISO: convertirAISO(t.fecha, t.hora_fin),
    status: normalizarEstado(t.estado),
  }));
}