// src/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/services/api.ts
import { Job } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

/** HU 1.8 – Trabajos por CLIENTE */
export async function fetchTrabajosCliente(clienteId: string, estado?: string) {
  const url = new URL(`http://localhost:5000/api/vengadores/trabajos/cliente/${clienteId}`); // ← usa param
  if (estado) url.searchParams.set('estado', estado); // (opcional)

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Error al obtener trabajos del cliente');
  const data = await res.json();

  // 👇 En Vista Cliente mostramos al PROVEEDOR en el “card header”
  return data.map((t: any) => ({
    id: `${t.proveedor?.id}-${t.cliente?.id}-${t.fecha}-${t.horaInicio}`,
    clientName: t.proveedor?.nombre ?? '—', // ← PROVEEDOR
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.horaInicio),
    endISO: convertirAISO(t.fecha, t.horaFin),
    status: normalizarEstado(t.estado),     // 'Pendiente' -> 'pending'
    cancelReason: t.cancelReason ?? '',
    description: t.descripcion ?? '',
  }));
}
