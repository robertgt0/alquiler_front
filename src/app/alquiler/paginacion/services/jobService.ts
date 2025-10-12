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
    const response = await fetch("http://localhost:5000/api/borbotones/usuarios");
    if (!response.ok) throw new Error("Error al obtener los trabajos");

    // json.data 
    const json = await response.json();

    // Mapear datos de la API al formato Job
    const mappedJobs: Job[] = (json.data || []).map((user: UserFromAPI) => ({
      title: user.servicios[0]?.nombre || "Sin servicio",                  // título del primer servicio
      company: user.nombre,                                                // nombre del usuario
      service: user.servicios.map(s => s.nombre).join(", "),               // todos los servicios
      location: user.ciudad?.nombre || "Sin ciudad",                       //ciudad
      postedDate: new Date(user.fecha_registro).toLocaleDateString(),      //fecha
      salaryRange: user.servicios[0]
        ? `$${user.servicios[0].precio_personalizado}`
        : "N/A",
      employmentType: user.activo ? "Activo" : "Inactivo",
      employmentTypeColor: user.activo
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800",
    }));

    return mappedJobs;
    

  } catch (error) {
    console.error(error);
    return [];
  }
};

