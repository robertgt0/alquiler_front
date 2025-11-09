import { fetchFromApi } from "@/lib/data-fetcher";

/**
 * Obtiene el número de nuevos servicios creados en los últimos 15 minutos.
 */
export async function getNewServicesCount(): Promise<number> {
  try {
    // 🔹 Consulta la lista completa de servicios desde tu backend
    const servicios = await fetchFromApi<any[]>("/api/devcode/servicios");

    if (!servicios || !Array.isArray(servicios)) return 0;

    // 🔹 Calculamos el umbral de 15 minutos atrás
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // 🔹 MongoDB ObjectId tiene la fecha en sus primeros 8 caracteres (timestamp)
    const nuevosServicios = servicios.filter((s) => {
      if (!s._id) return false;
      const timestamp = new Date(parseInt(s._id.substring(0, 8), 16) * 1000);
      return timestamp >= fifteenMinutesAgo;
    });

    return nuevosServicios.length;
  } catch (err) {
    console.error("❌ Error verificando nuevos servicios:", err);
    return 0;
  }
}
