import { Trabajo, CancelarTrabajoRequest } from "../interfaces/Trabajo.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/los_vengadores/trabajos';
export const obtenerTrabajo = async (id: string): Promise<Trabajo> => {
    const res = await fetch(`${API_BASE_URL}/detalles/cliente/${id}`);
    if (!res.ok) throw new Error(`Error al obtener trabajo: ${res.status}`);
    const data = await res.json();
    return {
    id: data.Id || id,
    proveedor: data.proveedor,
    fecha: data.fecha,
    horario: data.horario,
    descripcion: data.descripcion,
    costo: data.costo,
    estado: data.estado,
  };

};

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