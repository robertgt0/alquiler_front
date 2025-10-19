//filtroType.ts
export type Ciudad = { id_ciudad: number; nombre: string; codigo_postal?: string };
export type Provincia = { id_provincia: number; nombre: string; id_ciudad: number };

export type Especialidad = { id_especialidad: number; nombre: string };

export type UsuarioResumen = {
  _id: string;
  id_usuario: number;
  nombre: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
  fecha_registro?: string;
  ciudad?: Ciudad;
  rating?: number;
  especialidades?: Array<{ id_especialidad: number; nombre: string; fecha_asignacion?: string }>;
  servicios?: Array<{
    id_servicio: number; nombre: string; precio_personalizado?: number;
    disponible: boolean; fecha_asignacion?: string;
  }>;
};

export type CiudadesResponse = {
  success: boolean;
  total: number;
  page: number;
  pageSize: number;
  data: Ciudad[];
};

export type EspecialidadesResponse = {
  success: boolean;
  total: number;
  data: Especialidad[];
};

export type ProvinciasResponse = {
  success: boolean;
  ciudad: { id_ciudad: number; nombre?: string };
  total: number;
  provincias: Provincia[];
};

export type UsuariosResponse = {
  success: boolean;
  total: number;
  data: UsuarioResumen[];
};
