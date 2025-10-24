export interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
}

export interface Calificacion {
  estrellas: number;
  comentario?: string;
  fecha: Date;
  usuario_id: string;
}

export interface Especialidad {
  id_especialidad: number;
  nombre: string;
  descripcion?: string;
}

export interface Ciudad {
  id_ciudad: number;
  nombre: string;
  zona?: string;
  direccion_detallada?: string;
}

export interface Disponibilidad {
  estado: "Disponible" | "No Disponible" | "Ocupado";
  horario?: {
    lunes_viernes?: string;
    sabados?: string;
    domingos?: string;
  };
}

export interface MediosContacto {
  whatsapp: boolean;
  videoconsulta: boolean;
  presencial: boolean;
}

export interface Certificacion {
  nombre: string;
  institucion: string;
  fecha: Date;
}

export interface Usuario {
  _id: string;
  id_usuario: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  fecha_registro: Date;
  
  // Campos de perfil profesional
  area_principal: string;
  especialidades: Especialidad[];
  
  // Servicios y precios
  servicios: Servicio[];
  
  // Ubicación
  ciudad: Ciudad;
  
  // Disponibilidad
  disponibilidad: Disponibilidad;
  
  // Calificaciones y reseñas
  calificaciones: Calificacion[];
  calificacion_promedio: number;
  
  // Medios de contacto
  medios_contacto: MediosContacto;
  
  // Certificaciones
  certificaciones: Certificacion[];
  
  // Metadata
  ultima_actualizacion: Date;
}