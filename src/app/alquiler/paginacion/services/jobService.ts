import { Job } from "../../../../types/job";

// Funciones de utilidad para generar datos consistentes
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const getConsistentItem = <T>(array: T[], seed: number): T => {
  return array[Math.floor(seededRandom(seed) * array.length)];
};

// Baraja un arreglo de forma determinista usando una semilla
const seededShuffle = <T>(array: T[], seed: number): T[] => {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
};

// Tipos y interfaces
interface UserFromAPI {
  _id: string;
  nombre: string;
  fecha_registro: string;
  activo: boolean;
  ciudad: string | {
    nombre?: string;
    ciudad?: string;
    departamento?: string;
    provincia?: string;
    zona?: string;
  };
  servicios?: Array<{
    nombre: string;
    precio_personalizado?: number;
    precio?: number;
  }>;
  calificacion_promedio?: number;
  calificacion?: number;
}

// Datos constantes
const SERVICIOS = [
  {
    nombre: "Gestión de redes sociales con IA",
    descripcion: "Manejo profesional de cuentas usando IA para programar y generar contenido",
    precio_base: 500
  },
  {
    nombre: "Diseño y optimización web",
    descripcion: "Mejora de velocidad, SEO y experiencia de usuario",
    precio_base: 800
  },
  {
    nombre: "Asistente virtual",
    descripcion: "Atención de clientes, gestión de correos y agenda",
    precio_base: 400
  },
  {
    nombre: "Creación de contenido digital",
    descripcion: "Videos cortos con storytelling para marcas personales",
    precio_base: 600
  },
  {
    nombre: "Consultoría en productividad",
    descripcion: "Implementación de herramientas digitales de productividad",
    precio_base: 450
  },
  {
    nombre: "Diseño de interiores virtual",
    descripcion: "Renders y diseños con IA para espacios",
    precio_base: 700
  },
  {
    nombre: "Servicios ecológicos",
    descripcion: "Asesoría en sostenibilidad y eficiencia energética",
    precio_base: 550
  },
  {
    nombre: "Soporte técnico remoto",
    descripcion: "Resolución de problemas informáticos a distancia",
    precio_base: 300
  },
  {
    nombre: "Análisis de datos",
    descripcion: "Análisis de métricas para pequeños negocios",
    precio_base: 650
  },
  {
    nombre: "Gestión de viajes",
    descripcion: "Planificación personalizada de viajes y experiencias",
    precio_base: 400
  }
];

const NOMBRES_COMPLETOS = [
  "Doryan Patzi",
  "Ana María López", "Carlos Martínez", "Diana Rodríguez", 
  "Eduardo Sánchez", "Fernanda García", "Gabriel Torres",
  "Helena Vargas", "Ignacio Morales", "Julia Castro", 
  "Luis Rivera", "María Mendoza", "Nelson Silva",
  "Olivia Cruz", "Pablo Rojas", "Renata Flores"
];

const CIUDADES = ["La Paz", "Cochabamba", "Santa Cruz", "Oruro"];

// Función para generar ratings aleatorios
const generateRandomRating = (seed: number) => {
  const steps = [3, 3.5, 4, 4.5, 5];
  return getConsistentItem(steps, seed);
};

// Función para obtener un trabajo de ejemplo específico
export const getExampleJob = (index: number, nombreOverride?: string): Job => {
  const currentDate = new Date();
  const dayOffset = Math.floor(seededRandom(index * 7) * 30);
  const jobDate = new Date(currentDate.getTime() - dayOffset * 24 * 60 * 60 * 1000);
  
  const servicio = getConsistentItem(SERVICIOS, index * 13);
  const nombreCompleto = nombreOverride ?? getConsistentItem(NOMBRES_COMPLETOS, index * 17);
  const ciudad = getConsistentItem(CIUDADES, index * 23);
  
  const precioBase = servicio.precio_base;
  const variacionPrecio = Math.floor(seededRandom(index * 31) * (precioBase * 0.4) - (precioBase * 0.2));
  // Generamos un ID más realista similar a MongoDB
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Math.floor(seededRandom(index * 97) * 16777215).toString(16).padStart(6, '0');
  const counter = String(index + 1).padStart(6, '0');
  const jobId = `${timestamp}${random}${counter}`;
  const isDisponible = seededRandom(index * 41) > 0.2;

  return {
    id: jobId,
    title: servicio.nombre,
    company: nombreCompleto,
    service: servicio.descripcion,
    location: ciudad,
    postedDate: jobDate.toLocaleDateString(),
    date: jobDate.toISOString(),
    salaryRange: `Bs ${precioBase + variacionPrecio}`,
    employmentType: isDisponible ? "Disponible" : "No disponible",
    employmentTypeColor: isDisponible ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600",
    rating: generateRandomRating(index * 47)
  };
};

// Función para generar múltiples trabajos de ejemplo
const generateExampleJobs = (count: number): Job[] => {
  // Generamos una lista de nombres únicos/barajados para evitar repeticiones en la misma página
  const baseSeed = 12345;
  const shuffled = seededShuffle(NOMBRES_COMPLETOS, baseSeed);
  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i < shuffled.length) {
      names.push(shuffled[i]);
    } else {
      // Si necesitamos más nombres que los disponibles, reutilizamos con sufijos para mantener variedad
      const base = shuffled[i % shuffled.length];
      const suffix = Math.floor(i / shuffled.length) + 1;
      names.push(`${base} ${suffix}`);
    }
  }

  const jobs = Array.from({ length: count }, (_, index) => getExampleJob(index, names[index]));

  // Garantizar que la primera tarjeta (exclusiva) tenga siempre el nombre "Doryan Patzi"
  if (jobs.length > 0) {
    jobs[0].company = "Doryan Patzi";
  }

  // Asegurar que ningún otro trabajo en la lista tenga exactamente el mismo nombre
  const used = new Set<string>();
  if (jobs[0]) used.add(jobs[0].company);

  for (let i = 1; i < jobs.length; i++) {
    if (!jobs[i].company) {
      jobs[i].company = `Usuario ${i + 1}`;
    }
    if (used.has(jobs[i].company)) {
      // Reemplazar por una variante distinta usando nombres base disponibles
      const alt = NOMBRES_COMPLETOS.find(n => n !== "Doryan Patzi" && !used.has(n));
      if (alt) {
        jobs[i].company = alt;
      } else {
        jobs[i].company = `${jobs[i].company} ${i}`;
      }
    }
    used.add(jobs[i].company);
  }

  return jobs;
};

// Función para obtener el índice de un trabajo a partir de su ID
export const getJobIndex = (id: string): number | null => {
  try {
    // Extraemos el contador del final del ID (últimos 6 caracteres)
    const counter = parseInt(id.slice(-6), 10);
    return counter - 1;
  } catch {
    return null;
  }
};

// Función principal para obtener trabajos

// Función para obtener un trabajo específico por ID
export const getJobById = async (id: string): Promise<Job | null> => {
  // Primero intentamos obtener el índice del trabajo de ejemplo
  const index = getJobIndex(id);
  if (index !== null) {
    return getExampleJob(index);
  }

  // Si no es un trabajo de ejemplo, intentamos obtenerlo de la API
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const endpoint = `${API_BASE}/borbotones/usuarios/${id}`;
    
    const response = await fetch(endpoint, {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    const user: UserFromAPI = json.data;

    let location = "Sin ciudad";
    if (typeof user.ciudad === "string") {
      location = user.ciudad;
    } else if (user.ciudad && typeof user.ciudad === "object") {
      const nombre = user.ciudad.nombre || user.ciudad.ciudad || "";
      const dept = user.ciudad.departamento || user.ciudad.provincia || user.ciudad.zona || "";
      location = dept ? `${nombre}, ${dept}` : nombre || "Sin ciudad";
    }

    const firstService = (user.servicios && user.servicios[0]) || null;
    const registerDate = new Date(user.fecha_registro);
    
    return {
      id: user._id,
      title: firstService?.nombre || "Sin servicio",
      company: user.nombre,
      service: (user.servicios || []).map(s => s.nombre).join(", "),
      location,
      postedDate: registerDate.toLocaleDateString(),
      date: registerDate.toISOString(),
      salaryRange: firstService && (firstService.precio_personalizado ?? firstService.precio)
        ? `Bs ${Number(firstService.precio_personalizado ?? firstService.precio).toLocaleString("es-BO")}`
        : "Precio a convenir",
      employmentType: user.activo ? "Disponible" : "No disponible",
      employmentTypeColor: user.activo 
        ? "bg-green-50 text-green-600" 
        : "bg-red-50 text-red-600",
      rating: user.calificacion_promedio ?? user.calificacion ?? generateRandomRating(Math.floor(Math.random() * 1000))
    };

  } catch (error) {
    console.error("Error al obtener detalles del trabajo:", error);
    return null;
  }
};

// Función principal para obtener trabajos
export const getJobs = async (): Promise<Job[]> => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const endpoint = `${API_BASE}/borbotones/usuarios?limit=30`;
    
    console.log("Intentando obtener usuarios desde:", endpoint);

    const response = await fetch(endpoint, {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      let bodyText = "";
      try {
        bodyText = await response.text();
      } catch (e) {
        bodyText = "<no body>";
      }
      console.error(`Error en respuesta (${response.status}) desde ${endpoint}:`, bodyText);
      throw new Error(`Error al obtener los trabajos: ${response.status}`);
    }

    const json: { data?: UserFromAPI[] } = await response.json();

    let mappedJobs: Job[] = (json.data || []).map((user: UserFromAPI) => {
      let location = "Sin ciudad";
      if (typeof user.ciudad === "string") {
        location = user.ciudad;
      } else if (user.ciudad && typeof user.ciudad === "object") {
        const nombre = user.ciudad.nombre || user.ciudad.ciudad || "";
        const dept = user.ciudad.departamento || user.ciudad.provincia || user.ciudad.zona || "";
        location = dept ? `${nombre}, ${dept}` : nombre || "Sin ciudad";
      }

      const firstService = (user.servicios && user.servicios[0]) || null;
      const registerDate = new Date(user.fecha_registro);
      const apiRating = user.calificacion_promedio ?? user.calificacion ?? null;
      const preferredId = (user as any).id_usuario ?? (user as any).id ?? user._id;
      
      return {
        id: preferredId ? String(preferredId) : `api-${Math.random()}`,
        title: firstService?.nombre || "Sin servicio",
        company: user.nombre,
        service: (user.servicios || []).map(s => s.nombre).join(", "),
        location,
        postedDate: registerDate.toLocaleDateString(),
        date: registerDate.toISOString(),
        salaryRange: firstService && (firstService.precio_personalizado ?? firstService.precio)
          ? `Bs ${Number(firstService.precio_personalizado ?? firstService.precio).toLocaleString("es-BO")}`
          : "Precio a convenir",
        employmentType: user.activo ? "Disponible" : "No disponible",
        employmentTypeColor: user.activo 
          ? "bg-green-50 text-green-600" 
          : "bg-red-50 text-red-600",
        rating: apiRating ? Number(apiRating) : generateRandomRating(Math.floor(Math.random() * 1000))
      };
    });

    if (mappedJobs.length < 30) {
      const exampleJobsNeeded = 30 - mappedJobs.length;
      const exampleJobs = generateExampleJobs(exampleJobsNeeded);
      mappedJobs = [...mappedJobs, ...exampleJobs];
    }

    console.log(`Total de trabajos disponibles: ${mappedJobs.length}`);
    return mappedJobs;

  } catch (error) {
    console.error("Error al obtener trabajos:", error);
    return generateExampleJobs(30);
  }
};
