

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
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: `{"provider":"${provider}"}`
  });
  //console.log("Respuesta del servidor:", res.body);
  return res.json();
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
  const data = await res.json();
  
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

  return json /*as {
    success: true;
    data: {
      correo: string;
      authProvider?: string;
      password?: string; // ⚠️ si el back la manda, no la guardes ni muestres
      [k: string]: any;
    };
  };*/
}

export async function obtenerMetodoAutenticacion(usuario: string) {
    const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
    method: "GET",
  });
  console.log("Respuesta del servidor:", res.body);
  if (!res.ok) throw new Error("datos Incorrectos");
  return res.json();
}
export async function setupTwoFactor(token: string) {
  const res = await fetch(`${API_URL}/api/teamsys/2fa/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // token del usuario logueado
    },
    body: JSON.stringify({}) 
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Error al generar configuración 2FA');
  }

  return data.data; // contiene { secret, qrCode, backupCodes }
}
export async function verifyTwoFactor(token: string, secret: string, code: string) {
  const res = await fetch(`${API_URL}/api/teamsys/2fa/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ secret, token: code }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Error al verificar el código 2FA');
  }

  return data;
}

export async function verifyTwoFactorLogin(userId: string, code: string) {
  const res = await fetch(`${API_URL}/api/teamsys/2fa/verify-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, token: code }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Error al verificar código en login');
  }

  return data;
}
export async function desactivar2FA(codigo: string, userToken: string) {
  try {
    const response = await fetch("/api/2fa/disable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}` // Token en cabecera
      },
      body: JSON.stringify({ token: codigo }) // Código 2FA en body
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ 2FA deshabilitado:", data.message);
    } else {
      console.error("❌ Error:", data.message);
    }
  } catch (error) {
    console.error("🚨 Error de red:", error);
  }
}
