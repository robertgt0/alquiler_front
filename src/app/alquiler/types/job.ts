// /app/alquiler/types/job.ts

export interface Job {
  id: string;          // Identificador único para el trabajo
  title: string;       // Título del trabajo
  company: string;     // Nombre de la empresa
  especialidad?: string; // Especialidad o subtipo del servicio (opcional)
  date: string;        // Fecha de publicación del trabajo
  rating: number;      // Calificación del trabajo
  service: string;     // Servicio relacionado con el trabajo
  location: string;    // Ubicación del trabajo
  postedDate: string;  // Fecha en que el trabajo fue publicado
  salaryRange: string; // Rango salarial para el trabajo
}
