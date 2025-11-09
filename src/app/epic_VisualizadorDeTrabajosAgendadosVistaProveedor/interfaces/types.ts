// src/app/epic-VisualizadorDeTrabajosAgendadosVistaProveedor/interfaces/types.ts

// ✅ ¡AQUÍ! Asegúrate de que "export" esté en esta línea
export type JobStatus = 'confirmed' | 'pending' | 'cancelled' | 'done';

// ✅ Y TAMBIÉN AQUÍ
export interface Job {
  id: string;
  clientName?: string;
  providerName?: string;
  service: string;
  startISO: string;
  endISO: string;
  status: JobStatus;
  cancelReason?: string;
  description?: string;
}