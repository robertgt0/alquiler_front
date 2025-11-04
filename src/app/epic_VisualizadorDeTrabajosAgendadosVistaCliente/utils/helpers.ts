import { JobStatus } from '../interfaces/types';


export const fmt = (iso: string) => {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' });
  const hora = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
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
