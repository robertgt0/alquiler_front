// frontend: src/.../services/api.ts
import { Job } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

export async function fetchTrabajosProveedor(proveedorId: string): Promise<Job[]> {
  const res = await fetch(
    `http://localhost:5000/api/vengadores/trabajos/proveedor?proveedorId=${proveedorId}`
  );
  if (!res.ok) throw new Error('Error al obtener trabajos');
  const data = await res.json();

  return data.map((t: any) => ({
    id: `${t.proveedor.id}-${t.cliente.id}-${t.fecha}-${t.horaInicio}`,
    clientName: t.cliente.nombre,
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.horaInicio),
    endISO: convertirAISO(t.fecha, t.horaFin),
    status: normalizarEstado(t.estado), // 'Pendiente'->'pending', etc.
    cancelReason: t.cancelReason ?? '',
    description: t.descripcion ?? '',
  }));
}
