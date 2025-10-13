export interface DatosFormulario {
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  confirmarContraseña: string;
  telefono: string;
}

export interface Usuario {
  nombre: string;
  apellido?: string;
  telefono?: string;
  correoElectronico: string;
  password?: string;
  fotoPerfil: Buffer; // Binario (imagen)
  ubicacion: {
    type: 'Point';
    coordinates: [number, number]; // [longitud, latitud]
  };
  terminosYCondiciones: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErroresFormulario {
  nombre?: string;
  apellido?: string;
  email?: string;
  contraseña?: string;
  confirmarContraseña?: string;
  telefono?: string;
}