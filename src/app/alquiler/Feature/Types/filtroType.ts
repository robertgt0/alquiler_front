//filtroType.ts
export interface Ciudad {
  id_ciudad: number;
  nombre: string;
  codigo_postal?: string;
}

export interface Provincia {
  id_provincia: number;
  nombre: string;
  id_ciudad: number;
}

export interface Especialidad {
  id_especialidad: number;
  nombre: string;
  descripcion?: string;
}

export interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
}

export interface UsuarioBase {
  _id: string;
  id_usuario: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  fecha_registro: Date;
  especialidades?: Especialidad[];
  servicios?: Servicio[];
  ciudad?: Ciudad;
}

export interface UsuarioResumen extends UsuarioBase {
  // Los campos base son suficientes para el resumen
  calificacion?: number; // Calificación promedio del usuario (1-5 estrellas)
  totalCalificaciones?: number; // Número total de calificaciones recibidas
}

// Respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  data: T;
}

export interface CiudadesResponse extends ApiResponse<Ciudad[]> {
  total: number;
  page: number;
  pageSize: number;
}

export interface EspecialidadesResponse extends ApiResponse<Especialidad[]> {
  total: number;
}

export interface ProvinciasResponse extends Omit<ApiResponse<Provincia[]>, 'data'> {
  ciudad: { id_ciudad: number; nombre?: string };
  provincias: Provincia[];
}

export interface UsuariosResponse extends ApiResponse<UsuarioResumen[]> {
  total: number;
}

// Tipos de filtro
export interface FiltroUsuario {
  ciudad?: string;
  especialidad?: string;
  disponibilidad?: 'true' | 'false';
  busqueda?: string;
}

// Tipos de ordenamiento
export type OpcionOrdenamiento = 
  | "Nombre A-Z"
  | "Nombre Z-A"
  | "Mayor Calificación (⭐)"
  | "Fecha (Reciente)";
