import { JobStatus } from '../interfaces/types';

// 👇 Zona horaria destino (evita el desfase por el "Z" en los ISO mocks)
const TZ = 'America/La_Paz'; // 👈 NUEVO

export const fmt = (iso: string) => {
  const d = new Date(iso);
  // 👇 Forzamos locale y zona para la FECHA
  const fecha = d.toLocaleDateString('es-BO', {          // 👈 es-BO para formato local
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: TZ,                                        // 👈 fija zona
  });
  // 👇 Forzamos 24h y misma zona para la HORA
  const hora = d.toLocaleTimeString('es-BO', {           // 👈 es-BO
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,                                       // 👈 24 horas
    timeZone: TZ,                                        // 👈 fija zona
  });
  return { fecha, hora };
};

export const convertirAISO = (fecha: string, hora: string): string => {
  const [d, m, y] = fecha.split('/');
  return `20${y.padStart(2, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${hora}:00`;
};

export const normalizarEstado = (estado: string): 'confirmed' | 'pending' | 'cancelled' | 'done' => {
  const map: Record<string, JobStatus> = {
    Confirmado: 'confirmed',
    Pendiente: 'pending',
    Cancelado: 'cancelled',
    Terminado: 'done',
  };
  return map[estado] ?? 'pending';
};

export const STATUS_META = {
  confirmed: { label: 'Confirmado', color: '#155EEF', bg: '#E5F0FF' },
  pending:   { label: 'Pendiente',  color: '#B58500', bg: '#FFF6CC' },
  cancelled: { label: 'Cancelado',  color: '#B42318', bg: '#FFE4E2' },
  done:      { label: 'Terminado',  color: '#067647', bg: '#DFF5E9' },
};
