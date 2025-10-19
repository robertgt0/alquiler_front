export interface FormErrors {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  contraseña?: string;
  confirmarContraseña?: string;
}

// Validar nombre 
export function validarNombre(nombre: string): string | null {
  if (!nombre || nombre.trim() === '') {
    return 'nombre fuera de rango';
  }
  
  if (nombre.trim().length < 3) {
    return 'nombre fuera de rango';
  }
  
  if (nombre.length > 15) {
    return 'nombre fuera de rango';
  }
  
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombreRegex.test(nombre)) {
    return 'nombre fuera de rango';
  }
  
  return null;
}

// Validar apellido 
export function validarApellido(apellido: string): string | null {
  if (!apellido || apellido.trim() === '') {
    return 'apellido fuera de rango';
  }
  
  if (apellido.trim().length < 5) {
    return 'apellido fuera de rango';
  }
  
  if (apellido.length > 30) {
    return 'apellido fuera de rango';
  }
  
  const apellidoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!apellidoRegex.test(apellido)) {
    return 'apellido fuera de rango';
  }
  
  return null;
}

// Validar todo el formulario - misma lógica
export function validarFormularioCompleto(datos: any): string | null {
  const camposRequeridos = ['nombre', 'apellido', 'telefono', 'email', 'contraseña', 'confirmarContraseña'];
  const camposVacios = camposRequeridos.filter(campo => !datos[campo] || datos[campo].trim() === '');
  
  if (camposVacios.length > 0) {
    return `Faltan campos por completar: ${camposVacios.join(', ')}`;
  }
  
  return null;
}