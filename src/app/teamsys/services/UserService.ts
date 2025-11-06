

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

export async function cambiarTelefono(telefono:string, id:string) {
        const res= await fetch(`${API_URL}/api/teamsys/usuario/telefono/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: `{"telefono":"${telefono}"}`
        });
        return res.json();
      }
export async function agregarAutenticacion(usuario:string,provider:string,password:string) {
  const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: `{"provider":"${provider}","password":"${password}"}`
  });
  //console.log("Respuesta del servidor:", res.body);
  return res.json();
}

export async function eliminarAutenticacion(usuario:string,provider:string) {
  const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: `{"provider":"${provider}"}`
  });
  //console.log("Respuesta del servidor:", res.body);
  return res.json();
}
export async function obtenerMetodoAutenticacion(usuario: string) {
    const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
    method: "GET"
  });
  console.log("Respuesta del servidor:", res.body);
  if (!res.ok) throw new Error("datos Incorrectos");
  return res.json();
}
