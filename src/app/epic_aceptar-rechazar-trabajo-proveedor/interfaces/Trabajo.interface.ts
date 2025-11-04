export type EstadoTrabajo = "Pendiente" | "Confirmado" | "Cancelado" | "Terminado";

export interface SolicitudDetalle {
  id: string;
  cliente: string;
  fechaISO: string;   // "YYYY-MM-DD"
  horaInicio: string; // "HH:MM"
  horaFin: string;    // "HH:MM"
  descripcion: string;
  costo: number;      // en Bs
  estado: EstadoTrabajo;
}
