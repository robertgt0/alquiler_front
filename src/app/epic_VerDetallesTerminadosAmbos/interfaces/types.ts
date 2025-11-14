export type JobStatus = 'confirmed' | 'pending' | 'cancelled' | 'done';

export type Job = {
  id: string;
  clientName: string;
  service: string;
  startISO: string;
  endISO: string;
  status: JobStatus;
  cancelReason?: string;
  description?: string;
  
};
