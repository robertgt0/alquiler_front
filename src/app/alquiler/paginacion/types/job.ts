export interface Job {
  id: string;
  titulo: string;
  empresa: string;
  servicio: string;
  ubicacion: string;
  fechaPublicacion: string;
  rangoSalarial: string;
  tipoEmpleo: string;
  colorTipoEmpleo: string;
  descripcion?: string;
  requisitos?: string[];
  beneficios?: string[];
}

// Para compatibilidad con componentes existentes
export interface JobFrontend {
  id: string;
  title: string;
  company: string;
  service: string;
  location: string;
  postedDate: string;
  salaryRange: string;
  employmentType: string;
  employmentTypeColor: string;
}

// Función para convertir de backend a frontend
export const convertirJobABackend = (job: JobFrontend): Job => ({
  id: job.id,
  titulo: job.title,
  empresa: job.company,
  servicio: job.service,
  ubicacion: job.location,
  fechaPublicacion: job.postedDate,
  rangoSalarial: job.salaryRange,
  tipoEmpleo: job.employmentType,
  colorTipoEmpleo: job.employmentTypeColor
});

// Función para convertir de frontend a backend
export const convertirJobAFrontend = (job: Job): JobFrontend => ({
  id: job.id,
  title: job.titulo,
  company: job.empresa,
  service: job.servicio,
  location: job.ubicacion,
  postedDate: job.fechaPublicacion,
  salaryRange: job.rangoSalarial,
  employmentType: job.tipoEmpleo,
  employmentTypeColor: job.colorTipoEmpleo
});