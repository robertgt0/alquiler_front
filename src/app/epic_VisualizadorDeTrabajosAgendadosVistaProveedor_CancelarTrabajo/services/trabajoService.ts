import { Trabajo, CancelarTrabajoRequest } from "../interfaces/Trabajo.interface";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/los_vengadores/trabajos';
export const obtenerTrabajo = async (parametro: any): Promise<Trabajo> => {


  //Solo se usara si los datos que obtuvimos de la anterior hu no funciona
    const staticId = "6907d2bc6d942a4964cb5b9e"; // ID estático
    const res = await fetch(`${API_BASE_URL}/detalles/cliente/${staticId}`);
    if (!res.ok) throw new Error(`Error al obtener trabajo: ${res.status}`);
    const data = await res.json();

    return {
      id: data.Id || staticId,
      cliente: data.cliente,
      fecha: data.fecha,
      horario: data.horario,
      descripcion: data.descripcion,
      costo: data.costo,
      estado:"Confirmado",
    };
  }

export const cancelarTrabajoAPI = async (
  request: CancelarTrabajoRequest
): Promise<{ mensaje: string }> => {
  const res = await fetch(`${API_BASE_URL}/cancelar/proveedor/${request.trabajoId}`, {
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