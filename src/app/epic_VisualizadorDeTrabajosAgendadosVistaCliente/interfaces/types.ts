// src/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/interfaces/types.ts

export type JobStatus = 'confirmed' | 'pending' | 'cancelled' | 'done';

export interface Job {
  id: string;
  clientName?: string;   // Opcional: para la vista del proveedor
  providerName?: string; // ✅ Añadido como opcional para la vista del cliente
  service: string;
  startISO: string;
  endISO: string;
  status: JobStatus;
  cancelReason?: string;
  description?: string;
}