

import { UsuarioDocument } from "../../registro/interfaces/types";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL??"http://localhost:5000 " ;

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
}


export async function solicitarEnlaceAcceso(email: string) {
  const res = await fetch(`${API_URL}/api/teamsys/magic-link/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  // Si el correo no está registrado:
  if (res.status === 404) {
    return {
      ok: false,
      notFoundEmail: true,
      message:
        "No existe este correo en nuestro sistema. Por favor, ingresa un correo electrónico registrado",
    };
  }

  // Intentamos parsear JSON
  let data: any = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status}: ${data?.message || "No se pudo enviar el enlace"}`
    );
  }

  return {
    ok: true,
    message:
      data?.message ||
      "Te enviamos un enlace de acceso a tu correo electrónico. Válido solo por 5 minutos.",
    data, // puede incluir { magicLink } para pruebas
  };
}
/** 
 * Obtiene el perfil del usuario autenticado (usa Bearer accessToken).
 * Se usa después del verify para extraer correo y authProvider desde /me.
 */
export async function obtenerPerfilActual(accessToken: string) {
  const res = await fetch(`${API_URL}/api/teamsys/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || `Error /me (${res.status})`);
  }

  return json as {
    success: true;
    data: {
      correo: string;
      authProvider?: string;
      password?: string; // ⚠️ si el back la manda, no la guardes ni muestres
      [k: string]: any;
    };
  };
}

