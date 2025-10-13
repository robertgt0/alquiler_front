// Esta función revisa si el correo está bien escrito.
// Devuelve un mensaje si algo está mal o null si está bien.
export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "Por favor, escribe tu correo.";
  }

  // Dividimos el correo en la parte antes y después del @
  const partes = email.split("@");

  if (partes.length !== 2) {
    return "Debe tener solo un '@'.";
  }

  const local = partes[0];
  const dominio = partes[1];

  // Parte local (antes del @)
  if (!/^[a-zA-Z0-9._-]+$/.test(local)) {
    return "La parte antes del '@' tiene caracteres no válidos.";
  }
  if (local.startsWith(".") || local.endsWith(".")) {
    return "No puede empezar o terminar con punto.";
  }
  if (local.includes("..")) {
    return "No puede tener dos puntos seguidos.";
  }

  // Parte del dominio (después del @)
  if (!/^[a-zA-Z0-9.-]+$/.test(dominio)) {
    return "El dominio tiene caracteres no válidos.";
  }
  if (dominio.startsWith(".") || dominio.endsWith(".")) {
    return "El dominio no puede empezar o terminar con punto.";
  }
  if (dominio.includes("..")) {
    return "El dominio no puede tener dos puntos seguidos.";
  }

  // Verificar que tenga un punto y una extensión
  const partesDominio = dominio.split(".");
  if (partesDominio.length < 2) {
    return "El dominio debe tener al menos un punto (gmail.com).";
  }

  const extension = partesDominio[partesDominio.length - 1];
  if (extension.length < 2) {
    return "La extensión debe tener al menos 2 letras (.com, .bo).";
  }

  return null; //  El correo está bien :)
}


