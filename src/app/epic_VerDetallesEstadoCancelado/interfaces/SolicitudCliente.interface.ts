export type EstadoTrabajo = "Pendiente" | "Confirmado" | "Cancelado" | "Terminado";

export interface SolicitudClienteDetalle {
  id: string;
  proveedor: string;
  fechaISO: string;
  horaInicio: string;
  horaFin: string;
  descripcion: string;
  costo: number;
  estado: EstadoTrabajo;
  // Solo estos 2 campos extra para cancelados (opcionales)
  cancelReason?: string;
  cancelledBy?: string;
}
