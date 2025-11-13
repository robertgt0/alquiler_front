// src/app/epic_VisualizadorDeTrabajosAgendadosVistaProveedor/interfaces/types.ts

export type JobStatus = 'confirmed' | 'pending' | 'cancelled' | 'done';

export interface Job {
  id: string;
  clientName?: string;
  providerName?: string;
  service: string;
  startISO: string;   // "2025-11-02T09:00:00"
  endISO: string;     // "2025-11-02T10:00:00"
  fechaISO?: string;  // "2025-11-02"  <-- útil para enviar a HU1 como date
  status: JobStatus;
  cancelReason?: string;
  description?: string; // texto descriptivo del trabajo
  costo?: number;       // costo en Bs (si existe)
}
