export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FormErrors {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  contraseña?: string;
  confirmarContraseña?: string;
}

export const validators = {
  // Validar nombre
  nombre: (nombre: string): ValidationResult => {
    if (!nombre || nombre.trim() === '') {
      return { isValid: false, message: 'El nombre es requerido' };
    }
    
    if (nombre.trim().length < 2) {
      return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
    }
    
    if (nombre.length > 50) {
      return { isValid: false, message: 'El nombre es demasiado largo' };
    }
    
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(nombre)) {
      return { isValid: false, message: 'El nombre solo puede contener letras y espacios' };
    }
    
    return { isValid: true };
  },

  // Validar apellido
  apellido: (apellido: string): ValidationResult => {
    if (!apellido || apellido.trim() === '') {
      return { isValid: false, message: 'El apellido es requerido' };
    }
    
    if (apellido.trim().length < 2) {
      return { isValid: false, message: 'El apellido debe tener al menos 2 caracteres' };
    }
    
    if (apellido.length > 50) {
      return { isValid: false, message: 'El apellido es demasiado largo' };
    }
    
    const apellidoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!apellidoRegex.test(apellido)) {
      return { isValid: false, message: 'El apellido solo puede contener letras y espacios' };
    }
    
    return { isValid: true };
  },

  // Validar teléfono
  telefono: (telefono: string): ValidationResult => {
    if (!telefono || telefono.trim() === '') {
      return { isValid: false, message: 'El teléfono es requerido' };
    }
    
    // Limpiar el teléfono (quitar espacios, guiones, etc.)
    const telefonoLimpio = telefono.replace(/\D/g, '');
    
    if (telefonoLimpio.length < 10) {
      return { isValid: false, message: 'El teléfono debe tener al menos 10 dígitos' };
    }
    
    if (telefonoLimpio.length > 15) {
      return { isValid: false, message: 'El teléfono es demasiado largo' };
    }
    
    const telefonoRegex = /^[0-9+\-\s()]+$/;
    if (!telefonoRegex.test(telefono)) {
      return { isValid: false, message: 'El teléfono solo puede contener números y caracteres especiales' };
    }
    
    return { isValid: true };
  },

  // Validar email
  email: (email: string): ValidationResult => {
    if (!email || email.trim() === '') {
      return { isValid: false, message: 'El email es requerido' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'El formato del email no es válido' };
    }
    
    return { isValid: true };
  },

  // Validar contraseña
  contraseña: (contraseña: string): ValidationResult => {
    if (!contraseña) {
      return { isValid: false, message: 'La contraseña es requerida' };
    }
    
    if (contraseña.length < 6) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    
    if (contraseña.length > 50) {
      return { isValid: false, message: 'La contraseña es demasiado larga' };
    }
    
    // Opcional: agregar más validaciones de seguridad
    const tieneMayuscula = /[A-Z]/.test(contraseña);
    const tieneMinuscula = /[a-z]/.test(contraseña);
    const tieneNumero = /[0-9]/.test(contraseña);
    
    if (!tieneMayuscula || !tieneMinuscula || !tieneNumero) {
      return { 
        isValid: false, 
        message: 'La contraseña debe contener mayúsculas, minúsculas y números' 
      };
    }
    
    return { isValid: true };
  },

  // Validar confirmación de contraseña
  confirmarContraseña: (confirmarContraseña: string, contraseña: string): ValidationResult => {
    if (!confirmarContraseña) {
      return { isValid: false, message: 'Debes confirmar tu contraseña' };
    }
    
    if (confirmarContraseña !== contraseña) {
      return { isValid: false, message: 'Las contraseñas no coinciden' };
    }
    
    return { isValid: true };
  },

  // Validar todo el formulario
  formularioCompleto: (datos: any): ValidationResult => {
    const camposRequeridos = ['nombre', 'apellido', 'telefono', 'email', 'contraseña', 'confirmarContraseña'];
    const camposVacios = camposRequeridos.filter(campo => !datos[campo] || datos[campo].trim() === '');
    
    if (camposVacios.length > 0) {
      return { 
        isValid: false, 
        message: `Faltan campos por completar: ${camposVacios.join(', ')}` 
      };
    }
    
    return { isValid: true };
  }
};