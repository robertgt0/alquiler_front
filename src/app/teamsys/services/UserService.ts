

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
 * 🎯 Comparar correos para activar Google Auth
 * Envía ambos correos al backend para validación y activación
 */
export async function compararCorreosYActivarGoogle(
  userId: string, 
  correoLocal: string, 
  correoGoogle: string
) {
  const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      provider: 'google',
      email: correoGoogle
    })
  });
  
  console.log("Status de respuesta:", res.status);
  console.log("Endpoint llamado: POST /api/teamsys/auth-Method/" + userId);

  const data = await res.json();
  console.log("Datos de respuesta:", data);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${data.message || 'Error al activar Google Auth'}`);
  }
  
  return data;
}

/**
 * 🎯 Agregar método de autenticación local (correo/contraseña)
 */
export async function agregarMetodoLocal(userId: string, password: string) {
  const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      provider: 'local',
      password: password
    })
  });
  
  console.log("Status de respuesta:", res.status);
  console.log("Endpoint llamado: POST /api/teamsys/auth-Method/" + userId);

  const data = await res.json();
  console.log("Datos de respuesta:", data);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${data.message || 'Error al agregar método local'}`);
  }
  
  return data;
}


export async function cambiarTelefono(telefono:string, id:string) {
        const res= await fetch(`${API_URL}/api/teamsys/usuario/telefono/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: `{"telefono":"${telefono}"}`
        });
        return res.json();
      }
