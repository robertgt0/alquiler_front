// Tipos de horario y zona
export type HorarioTrabajo = 'mañana' | 'tarde' | 'noche' | 'flexible';
export type ZonaServicio = 'norte' | 'sur' | 'este' | 'oeste' | 'centro';

// Shared Job type used across the app to avoid duplicate declarations
export interface Job {
  id: string;
  title: string;
  company: string;
  service: string;
  especialidad?: string;
  location: string;
  postedDate: string;
  date: string;
  salaryRange: string;
  employmentType: string;
  employmentTypeColor: string;
  rating?: number;
  horario?: HorarioTrabajo[];
  zona?: ZonaServicio[];
  experiencia?: number;
  imageUrl?: string;
}
