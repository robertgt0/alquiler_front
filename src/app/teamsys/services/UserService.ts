

import { UsuarioDocument } from "../../registro/interfaces/types";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function crearUsuario(usuario: UsuarioDocument) {
  const res = await fetch(`${API_URL}/api/teamsys/usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  });
  console.log("Respuesta del servidor:", res.body);
  if (!res.ok) throw new Error("datos Incorrectos");
  return res.json();
}



export async function loginUsuario(correoElectronico: string, password: string) {
  const res = await fetch(`${API_URL}/api/teamsys/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correoElectronico, password })
  });
  
  console.log("Status de respuesta:", res.status);
  console.log("Respuesta del servidor:", res);

  const data = await res.json();
  console.log("Datos de respuesta:", data);

  if (!res.ok) {
    // Pasar el status code y mensaje específico del backend
    throw new Error(`HTTP ${res.status}: ${data.message || 'Error en login'}`);
  }
  
  return data;
}

/**
 * Solicita al backend que verifique el correo en BD y envíe el enlace mágico.
 * Respuestas esperadas:
 *  - 200 -> éxito (correo enviado)
 *  - 404 -> correo NO registrado (mostrar mensaje debajo del input)
 *  - otros -> error (banner rojo)
 */
export async function solicitarEnlaceAcceso(email: string) {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${API_URL}/api/teamsys/magic-link/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (res.status === 404) {
    return { ok:false, notFoundEmail:true,
      message:"No existe este correo en nuestro sistema. Por favor, ingresa un correo electrónico registrado" };
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "No se pudo enviar el enlace");

  return { ok:true,
    message: data?.message || "Te enviamos un enlace de acceso a tu correo electrónico. Válido solo por 5 minutos.",
    data // puede traer magicLink para debug
  };
}
