import { Trabajo, CancelarTrabajoRequest } from "../interfaces/Trabajo.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/los_vengadores/trabajos';
export const obtenerTrabajo = async (parametro: any): Promise<Trabajo> => {
  // (no se usa)  Si el objeto está vacío o nulo, hacemos fetch con un ID estático
  if (!parametro || Object.keys(parametro).length === 0) {
    const staticId = "6907d2bc6d942a4964cb5b9e"; // ID estático
    const res = await fetch(`${API_BASE_URL}/detalles/cliente/${staticId}`);
    if (!res.ok) throw new Error(`Error al obtener trabajo: ${res.status}`);
    const data = await res.json();

    return {
      id: data.Id || staticId,
      proveedor: data.proveedor,
      fecha: data.fecha,
      horario: data.horario,
      descripcion: data.descripcion,
      costo: data.costo,
      estado: data.estado,
    };
  }
    console.log("ID recibido:", parametro?.id); 
  // Si parametro tiene datos, lo devolvemos formateado
  return {
    id: parametro.id,
    proveedor: parametro.providerName || "Proveedor no especificado",
    fecha: (() => {
      const [año, mes, día] = (parametro.startISO || "2025-11-25").split("-").map(Number);
      const fechaObj = new Date(año, mes - 1, día);
      const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(fechaObj).replace(",", "");
      return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    })(),
    horario: `${parametro.inicio || "10:00"} - ${parametro.fin || "11:00"}`,
    descripcion: parametro.description || "Descripción no disponible",
    costo: parametro.costo ?? 0,
    estado: parametro.estado
  ? parametro.estado.toLowerCase() === "confirmed"
    ? "Confirmado"
    : parametro.estado
    : "Confirmado",
  };
  }

export const cancelarTrabajoAPI = async (
  request: CancelarTrabajoRequest
): Promise<{ mensaje: string }> => {
  const res = await fetch(`${API_BASE_URL}/cancelar/cliente/${request.trabajoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ justificacion: request.justificacion }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al cancelar trabajo: ${res.status} - ${text}`);
  }

  return res.json();
};