import {
  ISolicitud,
  ISolicitudResponse,
  IFranjaDisponible,
} from "../interfaces/Solicitud.interface";
import { isInsideAnyFranja, overlaps } from "../utils/helpers";

export async function enviarSolicitud(data: ISolicitud) {
  console.log("Enviando solicitud al backend...", data);
  // Aquí luego se hará la llamada real a la API (fetch o axios)
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

/**
 * MOCK: simula validación/guardado en localStorage por (providerId, date).
 * - Rechaza si el rango no está dentro de alguna franja disponible (HU2).
 * - Rechaza si solapa con una “reserva” ya existente.
 * - Guarda la solicitud en localStorage (solo para pruebas locales).
 */
export async function enviarSolicitudMock(
  date: string,
  providerId: string,
  data: ISolicitud,
  franjas: IFranjaDisponible[]
): Promise<ISolicitudResponse> {
  // Simulación de latencia de red
  await new Promise((r) => setTimeout(r, 800));

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

  return { ok: true, status: "ok", message: "Solicitud enviada" };
}
