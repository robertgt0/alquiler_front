import { Job } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

/** HU 1.7 – Trabajos por PROVEEDOR */
export async function fetchTrabajosProveedor(proveedorId: string, estado?: string): Promise<Job[]> {
  const url = new URL(`http://localhost:5000/api/vengadores/trabajos/proveedor`);
  url.searchParams.set('proveedorId', proveedorId);
  if (estado) url.searchParams.set('estado', estado); // ← opcional

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Error al obtener trabajos del proveedor');
  const data = await res.json();

  // 👇 En Vista Proveedor mostramos al CLIENTE en el “card header”
  return data.map((t: any) => ({
    id: `${t.proveedor?.id}-${t.cliente?.id}-${t.fecha}-${t.horaInicio}`,
    clientName: t.cliente?.nombre ?? '—', // ← CLIENTE
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.horaInicio),
    endISO: convertirAISO(t.fecha, t.horaFin),
    status: normalizarEstado(t.estado),
    cancelReason: t.cancelReason ?? '',
    description: t.descripcion ?? '',
  }));
}
