
export interface DatosFormulario {
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  confirmarContraseña: string;
  telefono: string;
}

export interface ErroresFormulario {
  nombre?: string;
  apellido?: string;
  email?: string;
  contraseña?: string;
  confirmarContraseña?: string;
  telefono?: string;
}
export interface UsuarioDocument {
  nombre: string;
  apellido?: string;
  telefono: string;
  correo: string;
  password: string;
  fotoPerfil?: string; 
  ubicacion?: {
    type: 'Point';
    coordinates: [number, number]; // [longitud, latitud]
  };
  terminosYCondiciones: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}