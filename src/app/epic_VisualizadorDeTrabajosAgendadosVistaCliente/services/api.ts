import { Job } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

// URL real del backend
const API_URL = 'http://localhost:5000/api/los_vengadores/trabajos';

// 🔹 Tipo que representa el objeto que devuelve el backend
interface BackendTrabajo {
  _id: string;
  id_cliente?: { nombre: string };
  id_proveedor?: { nombre: string };
  servicio: string;
  fecha: string;        // formato DD/MM/YY
  hora_inicio: string;  // formato HH:mm
  hora_fin: string;     // formato HH:mm
  estado: string;       // "Pendiente", "Confirmado", etc.
  descripcion?: string;
  costo?: number; //costo
}

// 🔹 Obtener trabajos del cliente desde el backend real
export async function fetchTrabajosCliente(clienteId: string): Promise<Job[]> {
  const res = await fetch(`${API_URL}/cliente/${clienteId}`, { cache: 'no-store' });

  if (!res.ok) throw new Error('Error al obtener trabajos del cliente');
  const data: BackendTrabajo[] = await res.json();

  return data.map((t) => ({
    id: t._id,
    providerName: t.id_proveedor?.nombre || 'Proveedor desconocido',
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.hora_inicio),
    endISO: convertirAISO(t.fecha, t.hora_fin),
    status: normalizarEstado(t.estado),
    description: t.descripcion || 'Sin descripción',
    cost: t.costo || 0,
  }));
}
