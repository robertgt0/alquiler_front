import { Job } from "../types/job";



interface UserFromAPI {
  _id: string;
  nombre: string;
  fecha_registro: string;
  activo: boolean;
  ciudad: { nombre: string };
  servicios: { nombre: string; precio_personalizado: number }[];
}


export const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch("http://localhost:5000/api/borbotones/usuarios?limit=1000");
    if (!response.ok) throw new Error("Error al obtener los trabajos");

    // json.data 
    const json = await response.json();

    // Mapear datos de la API al formato Job
    const mappedJobs: Job[] = (json.data || []).map((user: any) => {
      // Construir location de forma robusta: puede venir como string o como objeto
      let location = "Sin ciudad";
      if (typeof user.ciudad === 'string') location = user.ciudad;
      else if (user.ciudad && typeof user.ciudad === 'object') {
        // Preferir nombre + provincia/departamento si está disponible
        const nombre = user.ciudad.nombre || user.ciudad.ciudad || '';
        const dept = user.ciudad.departamento || user.ciudad.provincia || user.ciudad.zona || '';
        location = dept ? `${nombre}, ${dept}` : nombre || "Sin ciudad";
      }

      const firstService = (user.servicios && user.servicios[0]) || null;

      // asignar calificación aleatoria si la API no la proporciona
      const apiRating = user.calificacion_promedio ?? user.calificacion ?? null;
      const randomRating = () => {
        // devuelve 1.0 .. 5.0 con pasos de 0.5
        const steps = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
        return steps[Math.floor(Math.random() * steps.length)];
      };

      return {
        title: firstService?.nombre || "Sin servicio",
        company: user.nombre,
        service: (user.servicios || []).map((s: any) => s.nombre).join(", "),
        location,
        postedDate: user.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString() : '—',
        salaryRange: firstService && (firstService.precio_personalizado ?? firstService.precio)
          ? `Bs ${Number(firstService.precio_personalizado ?? firstService.precio).toLocaleString('es-BO')}`
          : undefined,
        employmentType: user.activo ? "Disponible" : "No disponible",
        employmentTypeColor: user.activo
          ? "bg-green-50 text-green-600"
          : "bg-red-50 text-red-600",
        rating: apiRating ? Number(apiRating) : randomRating(),
      } as Job;
    });

    return mappedJobs;


  } catch (error) {
    console.error(error);
    return [];
  }
};