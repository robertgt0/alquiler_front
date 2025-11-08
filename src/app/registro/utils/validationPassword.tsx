// src/app/utils/passwordValidation.ts

/**
 * Valida la fortaleza de una contraseña según varias reglas.
 * Devuelve un mensaje de error si algo no cumple o `null` si está todo bien.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "La contraseña debe tener 8 caracteres";
  }
    if (/\s/.test(password)) {
    return "La contraseña no puede contener espacios en blanco";
  }
    if (password.length > 16) {
    return 'La contraseña debe tener 8 caracteres';
  }
  if (!/[A-Z]/.test(password)) {
    return "Debe contener al menos una letra mayúscula.";
  }
  if (!/[a-z]/.test(password)) {
    return "Debe contener al menos una letra minúscula.";
  }
  if (!/[0-9]/.test(password)) {
    return "Debe contener al menos un número.";
  }
  if (!/[@$!%*?&]/.test(password)) {
    return "Debe incluir al menos un carácter especial (@, $, !, %, *, ?, &).";
  }
  return null; 
}

/**
 * Valida que las contraseñas coincidan.
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): string | null {
  if (password !== confirmPassword) {
    return "contraseña diferente";
  }
  return null;
}