export type EstadoTrabajo = "Terminado" | "Pendiente" | "Cancelado" | "Comfirmado" ;

export interface TrabajoTerminado {
  id: string;
  cliente: string;
  proveedor: string;
  fecha: string;       // formato dd/mm/yyyy
  horario: string;     // "10:00 - 11:00"
  descripcion: string;
  costo: number;       // en Bs
  estado: EstadoTrabajo;
  calificacion?: number; // 1..5
}
