export const contarPalabras = (texto: string): number => {
  return texto.trim().split(/\s+/).filter(palabra => palabra.length > 0).length;
};

export const validarJustificacion = (justificacion: string): { valido: boolean; error: string } => {
  if (justificacion.trim() === "") {
    return { valido: false, error: "Debe ingresar una justificación antes de cancelar." };
  }

  const numPalabras = contarPalabras(justificacion);
  
  if (numPalabras < 10) {
    return { valido: false, error: "La justificación debe tener al menos 10 palabras." };
  }

  if (numPalabras > 100) {
    return { valido: false, error: "La justificación no puede exceder las 100 palabras." };
  }

  return { valido: true, error: "" };
};