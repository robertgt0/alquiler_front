// src/app/mis-trabajos-proveedor/interfaces/types.ts

export type TrabajoStatus = 'Confirmado' | 'Pendiente' | 'Cancelado' | 'Terminado';

export interface ITrabajo {
  proveedor: {
    nombre: string;
    id: string;
  };
  cliente: {
    nombre: string;
    id: string;
  };
  fecha: string;
  horaInicio: string;
  horaFin: string;
  servicio: string;
  estado: TrabajoStatus;
}