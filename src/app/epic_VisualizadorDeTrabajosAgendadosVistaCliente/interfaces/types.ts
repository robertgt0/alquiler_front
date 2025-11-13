// src/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/interfaces/types.ts

export type JobStatus = 'confirmed' | 'pending' | 'cancelled' | 'done';

export interface Job {
  id: string;
  clientName?: string;   // Opcional: para vista del proveedor
  providerName?: string; // ✅ Usado en vista del cliente
  service: string;
  startISO: string;      // ISO de inicio
  endISO: string;        // ISO de fin
  status: JobStatus;
  cancelReason?: string;
  description?: string;
  cost?: number;         // ✅ Añadido para pasar a HU10
}
