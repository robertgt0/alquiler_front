export interface Trabajo {
  id?: string;
  cliente: string;
  fecha: string;
  horario: string;
  descripcion: string;
  costo: number;
  estado: "Confirmado" | "Cancelado";
}

export interface CancelarTrabajoRequest {
  trabajoId: string;
  justificacion: string;
}