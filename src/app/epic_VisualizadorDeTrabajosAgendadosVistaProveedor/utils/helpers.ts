// src/app/epic-VisualizadorDeTrabajosAgendadosVistaProveedor/utils/helpers.ts
import { JobStatus } from '../interfaces/types';

export const fmt = (iso: string) => {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric', // Usamos 'numeric' para el año completo
  });
  const hora = d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Usamos formato 24h para consistencia
  });
  return { fecha, hora };
};

// --- FUNCIÓN CORREGIDA ---
export const convertirAISO = (fecha: string, hora: string): string => {
  // 'fecha' viene como "2025-10-31" (de la BD)
  // 'hora' viene como "06:00" (de la BD)
  // El formato ISO que necesitamos es "2025-10-31T06:00:00"
  // ¡Simplemente los unimos!
  return `${fecha}T${hora}:00`;
};
// ------------------------

export const normalizarEstado = (estado: string): JobStatus => {
  // Convertimos a minúsculas para ser seguros
  const estadoLimpio = estado.toLowerCase();
  
  // Mapeo desde los estados de la BD a los estados del frontend
  const map: Record<string, JobStatus> = {
    confirmado: 'confirmed',
    pendiente: 'pending',
    cancelado: 'cancelled',
    terminado: 'done',
    completado: 'done', // Añadimos 'completado' por si acaso
  };
  return map[estadoLimpio] ?? 'pending';
};

export const STATUS_META = {
  confirmed: { label: 'Confirmado', color: '#155EEF', bg: '#E5F0FF' },
  pending: { label: 'Pendiente', color: '#B58500', bg: '#FFF6CC' },
  cancelled: { label: 'Cancelado', color: '#B42318', bg: '#FFE4E2' },
  done: { label: 'Terminado', color: '#067647', bg: '#DFF5E9' },
};