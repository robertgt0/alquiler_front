import {
  ISolicitud,
  ISolicitudResponse,
  IFranjaDisponible,
} from "../interfaces/Solicitud.interface";
import { isInsideAnyFranja, overlaps } from "../utils/helpers";

/**
 * URL del API (configurable por entorno)
 * Define NEXT_PUBLIC_API_BASE_URL en .env.local para producción/desarrollo:
 *   NEXT_PUBLIC_API_BASE_URL=https://tu-api.com
 *   # en local, por defecto: http://localhost:5000
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:5000";

/** Type guard simple para acceder a campos de objetos desconocidos */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/**
 * Llamado REAL al backend.
 * - Mapea los nombres de campos según lo que espera el backend:
 *   date        -> fecha
 *   horaInicio  -> hora_inicio
 *   horaFin     -> hora_fin
 *
 * Retorna un objeto con { ok, status, message } para mantener coherencia
 * con el flujo de la UI.
 */
export async function enviarSolicitud(
  data: ISolicitud
): Promise<ISolicitudResponse> {
  // (Opcional) Validación rápida: asegurar que date/horaInicio/horaFin existan
  if (!data?.date || !data?.horaInicio || !data?.horaFin) {
    throw new Error("Faltan datos de la solicitud (fecha, horaInicio, horaFin).");
  }

  const url = `${BASE_URL}/api/los_vengadores/trabajo-solicitado`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fecha: data.date,
      hora_inicio: data.horaInicio,
      hora_fin: data.horaFin,
    }),
  });

  // Si la respuesta HTTP no es OK, intentar leer 'message' del body
  if (!res.ok) {
    let msg = "Error al enviar la solicitud";
    try {
      const errorJson = (await res.json()) as unknown;
      if (isRecord(errorJson) && typeof errorJson.message === "string") {
        msg = errorJson.message;
      }
    } catch {
      // ignorar si no hay JSON de error
    }
    return { ok: false, status: "error", message: msg };
  }

  // 2xx => leer body por si trae un mensaje, sino usar el copy por defecto
  let message = "Solicitud enviada con éxito";
  try {
    const okJson = (await res.json()) as unknown;
    if (isRecord(okJson) && typeof okJson.message === "string") {
      message = okJson.message;
    }
  } catch {
    // si no hay body JSON, mantenemos el mensaje por defecto
  }

  return { ok: true, status: "ok", message };
}

/**
 * MOCK: simula validación/guardado en localStorage por (providerId, date).
 * - Rechaza si el rango no está dentro de alguna franja disponible (HU2).
 * - Rechaza si solapa con una “reserva” ya existente.
 * - Guarda la solicitud en localStorage (solo para pruebas locales).
 *
 * ¡Útil para DEV si aún no hay backend o para tests controlados!
 */
export async function enviarSolicitudMock(
  date: string,
  providerId: string,
  data: ISolicitud,
  franjas: IFranjaDisponible[]
): Promise<ISolicitudResponse> {
  // Simulación de latencia de red
  await new Promise((r) => setTimeout(r, 600));

  // 1) Validar contra franjas HU2
  if (!isInsideAnyFranja(data.horaInicio, data.horaFin, franjas)) {
    return { ok: false, status: "unavailable", message: "Horario no disponible" };
  }

  // 2) Revisar “reservas” previas
  const key = `solicitudes:${providerId}:${date}`;
  const prev = JSON.parse(localStorage.getItem(key) || "[]") as ISolicitud[];

  const conflict = prev.some((s) =>
    overlaps(s.horaInicio, s.horaFin, data.horaInicio, data.horaFin)
  );
  if (conflict) {
    return { ok: false, status: "conflict", message: "Horario ya reservado" };
  }

  // 3) Guardar “reserva” nueva
  localStorage.setItem(key, JSON.stringify([...prev, data]));

  return { ok: true, status: "ok", message: "Solicitud enviada con éxito" };
}
