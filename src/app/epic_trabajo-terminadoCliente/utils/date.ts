export function formatFechaLargaES(dmy: string) {
  // dmy = "25/11/2025"
  const [d, m, y] = dmy.split("/").map(Number);
  const fecha = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(fecha); // ej: "jueves, 25 de noviembre"
}
// Convierte "25/11/2025" → objeto Date
export function parseDMY(dmy: string): Date {
  const [d, m, y] = dmy.split("/").map(Number);
  return new Date(y, m - 1, d);
}