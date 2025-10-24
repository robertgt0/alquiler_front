/**
 * Funciones auxiliares reutilizables:
 *  - formatearHora: normaliza una cadena HH:mm
 *  - validarRango: valida que fin > inicio (para copy genérico)
 *  - formatEsDateTitle: “Jueves 10 de Mayo” desde YYYY-MM-DD
 *  - toMinutes / isRangeInside / isInsideAnyFranja / overlaps:
 *    validaciones HU2→HU3
 */

import { IFranjaDisponible } from "../interfaces/Solicitud.interface";

export const formatearHora = (hora: string): string => {
  if (!hora) return "";
  const [h = "", m = ""] = hora.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
};

export function validarRango(horaInicio: string, horaFin: string): string | null {
  if (!horaInicio || !horaFin) return "Selecciona hora inicio y fin.";
  if (horaFin <= horaInicio) return "La hora fin debe ser mayor a la hora inicio.";
  return null;
}

/**
 * Convierte una fecha ISO (YYYY-MM-DD) a título legible en español
 * (p. ej., "Martes 22 de Octubre") PARSEÁNDOLA EN HORA LOCAL.
 * Evita el desfase de 1 día que ocurre cuando "YYYY-MM-DD" se interpreta como UTC.
 */
export function formatEsDateTitle(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  // Constructor local: año, mesIndex (0-based), día
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);

  const fmt = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const text = fmt.format(date); // p.ej. "martes, 22 de octubre"
  // Capitalizamos como venías haciendo:
  return text.replace(",", "").replace(/(^\w|[\s]\w)/g, (m) => m.toUpperCase());
}

/* ===== Helpers para HU2 → HU3 ===== */

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const isRangeInside = (
  inicio: string,
  fin: string,
  franja: IFranjaDisponible
) => {
  const a = toMinutes(inicio);
  const b = toMinutes(fin);
  const s = toMinutes(franja.inicio);
  const e = toMinutes(franja.fin);
  // [a,b] contenido en [s,e]
  return a >= s && b <= e;
};

export const isInsideAnyFranja = (
  inicio: string,
  fin: string,
  franjas: IFranjaDisponible[]
) => franjas.some((f) => isRangeInside(inicio, fin, f));

/** NUEVA: valida si una hora puntual (HH:mm) cae en alguna franja */
export const isTimeInsideAnyFranja = (
  time: string,
  franjas: IFranjaDisponible[]
): boolean => {
  const t = toMinutes(time);
  return franjas.some((f) => {
    const s = toMinutes(f.inicio);
    const e = toMinutes(f.fin);
    return t >= s && t <= e;
  });
};

export const overlaps = (
  aInicio: string,
  aFin: string,
  bInicio: string,
  bFin: string
) => {
  const a1 = toMinutes(aInicio), a2 = toMinutes(aFin);
  const b1 = toMinutes(bInicio), b2 = toMinutes(bFin);
  return a1 < b2 && b1 < a2; // intersección abierta
};
