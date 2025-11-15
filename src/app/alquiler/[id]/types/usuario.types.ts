export interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  precio_personalizado?: number;
  disponible: boolean;
}

export interface Calificacion {
  estrellas: number;
  comentario?: string;
  fecha: Date;
  usuario_id: string;
}

export interface Ciudad {
  id_ciudad: number;
  nombre: string;
  zona?: string;
  direccion_detallada?: string;
}

export interface Portfolio {
  id: number;
  imagen: string;
  titulo: string;
  descripcion: string;
}

export interface Usuario {
  _id: string;
  id_usuario: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  fecha_registro: string;
  area_principal: string;
  especialidades: Array<{
    id_especialidad: number;
    nombre: string;
    descripcion?: string;
  }>;
  servicios: Servicio[];
  ciudad: Ciudad;
  portfolio?: Portfolio[];
  calificaciones?: Calificacion[];
  descripcion?: string;
}