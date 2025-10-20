export interface Job {
  title: string;
  company: string;
  service: string;
  location: string;
  postedDate: string;
  salaryRange: string;
  employmentType: string;
  employmentTypeColor: string;
  rating?: number;
  especialidades?: Array<{ id_especialidad: number; nombre: string; fecha_asignacion?: string }>;
  especialidad?: string; // Para búsqueda y display simple
}


