export type EstadoTrabajo = "Pendiente" | "Confirmado" | "Cancelado" | "Terminado";

export interface SolicitudClienteDetalle {
  id: string;
  proveedor: string;
  cliente: string; // ✅ CAMBIO: Añadimos este campo para mostrar ambos nombres
  fechaISO: string;
  horaInicio: string;
  horaFin: string;
  descripcion: string;
  costo: number;
  estado: EstadoTrabajo;
  
  // Campos opcionales para cancelados
  cancelReason?: string;
  cancelledBy?: string;
}