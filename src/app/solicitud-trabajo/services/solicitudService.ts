const BASE_URL = "http://localhost:5000";

/**
 * URL del API (configurable por entorno)
 * Define NEXT_PUBLIC_API_BASE_URL en .env.local para producción/desarrollo:
 *   NEXT_PUBLIC_API_BASE_URL=https://tu-api.com
 *   # en local, por defecto: http://localhost:5000
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:5000";

/**
 * Llamado REAL al backend.
 * - Mapea los nombres de campos según lo que espera el backend:
 *   date        -> fecha
 *   horaInicio  -> hora_inicio
 *   horaFin     -> hora_fin
 *
 * Retorna un objeto con al menos { ok, status, message } para mantener
 * coherencia con el flujo de la UI. Incluye el payload crudo en `raw` por si
 * hace falta debugear.
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

  if (!res.ok) {
    // Intentar leer un mensaje de error del backend
    const error = await res.json().catch(() => ({}));
    const msg = (error as any)?.message || "Error al enviar la solicitud";
    return { ok: false, status: "error", message: msg, raw: error };
  }

  const result = await res.json().catch(() => ({}));
  const message =
    (result as any)?.message || "Solicitud enviada con éxito";

  return { ok: true, status: "ok", message, raw: result };
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

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Error al enviar la solicitud");
  }

  const result = await res.json();
  console.log("✅ Respuesta del backend:", result);
  return result;
}
