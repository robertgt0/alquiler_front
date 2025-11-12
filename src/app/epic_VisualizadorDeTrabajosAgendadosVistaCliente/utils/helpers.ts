import { JobStatus } from '../interfaces/types';

/** 
 * Formatea fecha y hora legible (ej: 01/11/25 08:00)
 */
export const fmt = (iso: string) => {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const hora = d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return { fecha, hora };
};

/**
 * Convierte fecha "DD/MM/YY" + hora "HH:MM" → ISO local sin desfase UTC.
 * Evita que la fecha retroceda un día por diferencia horaria.
 */
export const convertirAISO = (fecha: string, hora: string): string => {
  if (!fecha || !hora) {
    console.warn("⚠️ convertirAISO recibió valores vacíos:", { fecha, hora });
    return new Date().toISOString();
  }

  const partesFecha = fecha.split('/');
  if (partesFecha.length !== 3) {
    console.warn("⚠️ formato de fecha inesperado en convertirAISO:", fecha);
    return new Date().toISOString();
  }

  const [d, m, y] = partesFecha.map((v) => parseInt(v, 10));
  const [hh, mm] = hora.split(':').map((v) => parseInt(v, 10));

  // ✅ Construimos fecha local correctamente
  const localDate = new Date(2000 + y, m - 1, d, hh, mm);
  if (isNaN(localDate.getTime())) {
    console.warn("⚠️ Fecha final inválida al convertir:", fecha, hora);
    return new Date().toISOString();
  }

  // ✅ Generamos ISO manual en zona local (sin UTC)
  const yyyy = localDate.getFullYear();
  const MM = String(localDate.getMonth() + 1).padStart(2, '0');
  const dd = String(localDate.getDate()).padStart(2, '0');
  const HH = String(localDate.getHours()).padStart(2, '0');
  const MMm = String(localDate.getMinutes()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd}T${HH}:${MMm}:00`;
};

/**
 * ✅ Normaliza estado del backend a los valores del frontend.
 */
export const normalizarEstado = (estado: string): JobStatus => {
  const map: Record<string, JobStatus> = {
    Confirmado: 'confirmed',
    Pendiente: 'pending',
    Cancelado: 'cancelled',
    Terminado: 'done',
  };
  return map[estado] ?? 'pending';
};

/**
 * 🎨 Metadatos visuales para etiquetas de estado
 */
export const STATUS_META = {
  confirmed: { label: 'Confirmado', color: '#155EEF', bg: '#E5F0FF' },
  pending:   { label: 'Pendiente',  color: '#B58500', bg: '#FFF6CC' },
  cancelled: { label: 'Cancelado',  color: '#B42318', bg: '#FFE4E2' },
  done:      { label: 'Terminado',  color: '#067647', bg: '#DFF5E9' },
};
