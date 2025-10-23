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
    // Usar variable de entorno para la URL base (permite cambiar entre local y remoto)
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
    const endpoint = `${API_BASE.replace(/\/+$/, '')}/borbotones/usuarios?limit=1000`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      // intentar leer cuerpo para depuración (no lanzar si no es JSON)
      let bodyText = '';
      try {
        bodyText = await response.text();
      } catch (e) {
        bodyText = '<no body>';
      }
      console.error(`getJobs: respuesta no OK (${response.status}) desde ${endpoint}:`, bodyText);
      throw new Error(`Error al obtener los trabajos: ${response.status}`);
    }

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