// src/app/epic_VerDetallesEstadoCancelado/services/api.ts
import { SolicitudClienteDetalle } from '../interfaces/SolicitudCliente.interface';

const API_URL = 'http://localhost:5000/api/los_vengadores/trabajos';

export const fetchTrabajoDetalleReal = async (id: string): Promise<SolicitudClienteDetalle | null> => {
  // Usamos el endpoint que creamos en el backend que trae todo
  const res = await fetch(`${API_URL}/detalles/proveedor/${id}`, { cache: 'no-store' });

  if (!res.ok) return null;

  const t = await res.json();

  return {
    id: t.Id,
    // ✅ AQUÍ ESTÁ EL CAMBIO: Mapeamos ambos nombres
    proveedor: t.proveedor || 'No especificado', 
    cliente: t.cliente || 'No especificado', // <--- NUEVA LÍNEA AGREGADA
    
    fechaISO: t.fecha, 
    horaInicio: t.horario.split(' - ')[0] || '',
    horaFin: t.horario.split(' - ')[1] || '',
    descripcion: t.descripcion,
    costo: t.costo,
    // Nota: Si quieres que el estado sea dinámico (no siempre cancelado), usa: t.estado
    estado: 'Cancelado', 
    cancelReason: t.justificacion_cancelacion || 'Sin justificación',
    cancelledBy: t.cancelado_por || 'Desconocido'
  };
};