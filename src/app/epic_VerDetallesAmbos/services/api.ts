// app/epic_VerDetallesAmbos/services/api.ts
import type { Job } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

export type Role = 'cliente' | 'proveedor';

// ===============================
// URL del backend (igual que trabajosTerminados)
// ===============================
const BACKEND_URL =
  'http://localhost:5000/api/los_vengadores/trabajo-cancelado';

// ===============================
// Adaptador Mongo → Job (usado por DetallesAmbos)
// ===============================
function mapMongoToJob(m: any): Job {
  // En la BD viene "fecha" como YYYY-MM-DD
  const [y, mm, dd] = String(m?.fecha || '').split('-');
  // Para convertir a ISO usamos formato dd/mm/aa (como espera convertirAISO)
  const fechaDMY =
    y && mm && dd ? `${dd}/${mm}/${String(y).slice(-2)}` : '';

  const inicio = m?.hora_inicio ?? '';
  const fin = m?.hora_fin ?? '';

  // startISO y endISO son los que usa DetallesAmbos (vía formatFechaLarga/formatHora)
  const startISO =
    fechaDMY && inicio
      ? convertirAISO(fechaDMY, String(inicio).slice(0, 5))
      : '';
  const endISO =
    fechaDMY && fin
      ? convertirAISO(fechaDMY, String(fin).slice(0, 5))
      : startISO;

  // Normalizamos el estado usando tu helper (confirmed, pending, cancelled, done)
  const estadoMongo = String(m?.estado ?? '');
  const status = normalizarEstado(estadoMongo);

  return {
    id: String(m?._id ?? ''),
    clientName: m?.cliente_nombre ?? m?.cliente ?? '',
    service:
      m?.servicio_nombre ??
      m?.servicio ??
      m?.descripcion_trabajo ??
      'Trabajo agendado',
    startISO,
    endISO,
    status,
    cancelReason:
      m?.motivo_cancelacion ?? m?.motivo ?? m?.razon_cancelado ?? '',
    description: m?.descripcion_trabajo ?? m?.descripcion ?? '',
  };
}

// ===============================
// FETCH POR ID (para ambos roles)
// ===============================
/**
 * Devuelve un trabajo por ID usando el rol para decidir el contexto
 * (cliente o proveedor). Para el backend actual, el detalle cancelado
 * es el mismo para ambos, así que el rol no cambia la llamada.
 */
export async function fetchJobByIdRole(
  id: string,
  _role: Role,
): Promise<Job | null> {
  if (!id) return null;

  const url = `${BACKEND_URL}/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // para ver siempre lo más reciente al hacer npm run dev
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      console.error(
        '[fetchJobByIdRole] HTTP',
        res.status,
        res.statusText,
        msg,
      );
      return null;
    }

    const mongoDoc = await res.json();
    return mapMongoToJob(mongoDoc);
  } catch (error: any) {
    console.error(
      '[fetchJobByIdRole] connection error:',
      error?.message ?? error,
    );
    return null;
  }
}
