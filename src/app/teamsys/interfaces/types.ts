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