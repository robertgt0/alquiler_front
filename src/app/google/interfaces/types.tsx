export interface DatosFormularioGoogle {
  nombreGoogle: string;
  apellido: string;
  email: string;
  contraseña: string;
  confirmarContraseña: string;
  telefono: string;
}

export interface UsuarioDocumentGoogle {
  nombre: string;
  apellido?: string;
  telefono: string;
  correoElectronico: string;
  password: string;
  fotoPerfil?: Buffer; // Binario (imagen)
  ubicacion?: {
    type: 'Point';
    coordinates: [number, number]; // [longitud, latitud]
  };
  terminosYCondiciones: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErroresFormularioGoogle {
  nombre?: string;
  apellido?: string;
  email?: string;
  contraseña?: string;
  confirmarContraseña?: string;
  telefono?: string;
}
export interface UsuarioDocumentGoogle {
  nombre: string;
  apellido?: string;
  telefono: string;
  correoElectronico: string;
  password: string;
  fotoPerfil?: Buffer; // Binario (imagen)
  ubicacion?: {
    type: 'Point';
    coordinates: [number, number]; // [longitud, latitud]
  };
  terminosYCondiciones: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}