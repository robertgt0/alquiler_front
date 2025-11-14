import type { TrabajoTerminado } from "../interfaces/Trabajo.interface";

// =======================================
// URL del backend (igual que los demás módulos)
// =======================================
// Tu backend corre en el puerto 5000 según tu .env del back
const BACKEND_URL = "http://localhost:5000/api/los_vengadores/trabajo-cancelado";

// =======================================
// Adaptador Mongo → Front
// =======================================
function mapMongoToTrabajoTerminado(m: any): TrabajoTerminado {
  const [y, mm, dd] = String(m?.fecha || "").split("-");
  const fechaDMY = y && mm && dd ? `${dd}/${mm}/${y}` : "";

  const inicio = m?.hora_inicio ?? "";
  const fin = m?.hora_fin ?? "";
  const horario = (inicio || fin) ? `${inicio} - ${fin}` : "";

  const estadoMongo = String(m?.estado || "").toLowerCase();
  const estado =
    estadoMongo === "terminado" || estadoMongo === "completado" ? "Terminado" :
    estadoMongo === "cancelado" ? "Cancelado" : "Pendiente";

  return {
    id: String(m?._id || ""),
    cliente: m?.cliente_nombre ?? "",
    proveedor: m?.proveedor_nombre ?? "",
    fecha: fechaDMY,
    horario,
    descripcion: m?.descripcion_trabajo ?? "",
    costo: Number(m?.costo ?? 0),
    estado,
    calificacion: m?.numero_estrellas != null ? Number(m.numero_estrellas) : undefined,
  };
}

// =======================================
// FETCH POR ID (llama directo al backend)
// =======================================
export async function fetchTrabajoById(id: string): Promise<TrabajoTerminado | null> {
  const url = `${BACKEND_URL}/${encodeURIComponent(id)}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      console.error("HTTP", res.status, res.statusText, msg);
      return null;
    }

    const mongoDoc = await res.json();
    return mapMongoToTrabajoTerminado(mongoDoc);
  } catch (e: any) {
    console.error("fetchTrabajoById connection error:", e?.message || e);
    return null;
  }
}
