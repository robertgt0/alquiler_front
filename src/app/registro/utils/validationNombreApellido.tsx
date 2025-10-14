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
    return 'El nombre es requerido';
  }
  
  if (nombre.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  
  if (nombre.length > 50) {
    return 'nombre fuera de rango';
  }
  
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombreRegex.test(nombre)) {
    return 'El nombre solo puede contener letras y espacios';
  }
  
  return null;
}

// Validar apellido 
export function validarApellido(apellido: string): string | null {
  if (!apellido || apellido.trim() === '') {
    return 'El apellido es requerido';
  }
  
  if (apellido.trim().length < 2) {
    return 'El apellido debe tener al menos 2 caracteres';
  }
  
  if (apellido.length > 50) {
    return 'apellido fuera de rango';
  }
  
  const apellidoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!apellidoRegex.test(apellido)) {
    return 'El apellido solo puede contener letras y espacios';
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