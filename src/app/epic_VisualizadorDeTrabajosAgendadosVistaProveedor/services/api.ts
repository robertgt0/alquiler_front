// frontend: src/app/epic-VisualizadorDeTrabajosAgendadosVistaProveedor/services/api.ts
import { Job, JobStatus } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

// Definimos la URL base de nuestro backend real
const API_URL = 'http://localhost:5000/api/los_vengadores/trabajos';

// --- FUNCIÓN PARA LA VISTA DEL PROVEEDOR (HU 1.7) ---
// Esta función se conecta al backend real
export async function fetchTrabajosProveedor(): Promise<Job[]> {
  const res = await fetch(`${API_URL}/proveedor`, { cache: 'no-store' });

  if (!res.ok) throw new Error('Error al obtener trabajos del proveedor');
  const data = await res.json();

  // Mapeamos la respuesta de la BD (con _id) al formato del frontend (con id)
  return data.map((t: any) => ({
    id: t._id, // Usamos el _id que viene de MongoDB
    clientName: t.id_cliente.nombre, // Usamos el nombre del cliente "populado"
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.hora_inicio),
    endISO: convertirAISO(t.fecha, t.hora_fin),
    status: normalizarEstado(t.estado),
  }));
}

// --- FUNCIÓN PARA LA VISTA DEL CLIENTE (HU 1.8) ---
// Esta función también se conecta al backend real
export async function fetchTrabajosCliente(clienteId: string): Promise<Job[]> {
  const res = await fetch(`${API_URL}/cliente/${clienteId}`, { cache: 'no-store' });

  if (!res.ok) throw new Error('Error al obtener trabajos del cliente');
  const data = await res.json();

  // Mapeamos la respuesta de la BD al formato del frontend
  return data.map((t: any) => ({
    id: t._id,
    providerName: t.id_proveedor.nombre, // Usamos el nombre del proveedor "populado"
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.hora_inicio),
    endISO: convertirAISO(t.fecha, t.hora_fin),
    status: normalizarEstado(t.estado),
  }));
}
