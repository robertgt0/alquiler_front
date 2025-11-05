export type LocationDTO = { lat: number; lng: number; address?: string };

// ⬇️ NUEVO: Tipo para trabajos del fixer con descripción personalizada
export type FixerJob = {
  jobId: string;
  jobName: string;
  customDescription?: string;  // ← Descripción personalizada del fixer (opcional)
  generalDescription: string;  // Descripción general del catálogo
};

export type UpsertFixerDTO = { 
  userId: string; 
  location: LocationDTO; 
  categories?: string[];
  fixerJobs?: FixerJob[];  // ⬇️ NUEVO
};

export type Category = { 
  id: string; 
  name: string; 
  slug: string; 
  createdAt: string;
  description?: string;  // ⬇️ NUEVO: Descripción general del catálogo
};