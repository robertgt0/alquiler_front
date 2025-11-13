import { Job } from "../../../../types/job";

export interface FiltrosJob {
  ciudad?: string;
  disponibilidad?: string; // "true" | "false"
  tipoEspecialidad?: string;
  horario?: string;
  zona?: string;
}

/**
 * Filtra un array de trabajos según los criterios proporcionados
 * @param jobs Array de trabajos a filtrar
 * @param filtros Objeto con los criterios de filtrado
 * @returns Array filtrado
 */
export const filtrarTrabajosAvanzado = (jobs: Job[], filtros: FiltrosJob): Job[] => {
  if (!jobs || jobs.length === 0) return [];
  if (!filtros || Object.values(filtros).every(v => !v)) return jobs;

  return jobs.filter((job) => {
    let cumple = true;

    // Filtro por ciudad/ubicación
    if (filtros.ciudad && filtros.ciudad.trim()) {
      cumple &&= job.location?.toLowerCase().includes(filtros.ciudad.toLowerCase());
    }

    // Filtro por disponibilidad (mapear "true"/"false" a "Disponible"/"No disponible")
    if (filtros.disponibilidad !== undefined && filtros.disponibilidad !== "") {
      const disponible = filtros.disponibilidad === "true";
      const statusEsperado = disponible ? "disponible" : "no disponible";
      cumple &&= job.employmentType?.toLowerCase().includes(statusEsperado);
    }

    // Filtro por tipo de especialidad/servicio
    if (filtros.tipoEspecialidad && filtros.tipoEspecialidad.trim()) {
      cumple &&=
        job.title?.toLowerCase().includes(filtros.tipoEspecialidad.toLowerCase()) ||
        job.service?.toLowerCase().includes(filtros.tipoEspecialidad.toLowerCase());
    }

    // Filtro por horario (si el trabajo tiene horarios disponibles)
    if (filtros.horario && filtros.horario.trim()) {
      cumple &&= job.horario?.some(
        (h) => h.toLowerCase() === filtros.horario?.toLowerCase()
      );
    }

    // Filtro por zona (si el trabajo tiene zonas disponibles)
    if (filtros.zona && filtros.zona.trim()) {
      cumple &&= job.zona?.some(
        (z) => z.toLowerCase() === filtros.zona?.toLowerCase()
      );
    }

    return cumple;
  });
};

/**
 * Valida si hay al menos un filtro activo
 */
export const tieneFiltrActivo = (filtros: FiltrosJob): boolean => {
  return Object.values(filtros).some((v) => v && String(v).trim() !== "");
};
