/**
 * Funciones auxiliares reutilizables:
   - formatearHora: normaliza una cadena HH:mm
   - validarRango: valida que fin > inicio
   - formatEsDateTitle: “Jueves 10 de Mayo” desde YYYY-MM-DD
*/

/**
 * Normaliza una hora tipo "HH:mm".
 * Mantiene los minutos y quita segundos si llegaran.
 */
export const formatearHora = (hora: string): string => {
  if (!hora) return "";
  const [h = "", m = ""] = hora.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
};

/**
 * Valida que existan ambas horas y que fin > inicio.
 * @returns string con el mensaje de error, o null si es válido.
 */
export function validarRango(horaInicio: string, horaFin: string): string | null {
  if (!horaInicio || !horaFin) return "Selecciona hora inicio y fin.";
  // Comparación lexicográfica funciona en formato HH:mm
  if (horaFin <= horaInicio) return "La hora fin debe ser mayor a la hora inicio.";
  return null;
}

/**
 * Convierte una fecha ISO (YYYY-MM-DD) a título legible en español,
 * ej. "Jueves 10 de Mayo".
 */
export function formatEsDateTitle(iso: string): string {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  const text = fmt.format(d);           // "jueves, 10 de mayo"
  return text.replace(",", "").replace(/(^\w|[\s]\w)/g, (m) => m.toUpperCase());
}
