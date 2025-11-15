

import { Delete } from "lucide-react";
import { UsuarioDocument } from "../../registro/interfaces/types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL??"http://localhost:5000 " ;

export function cerrarSesion(){
    localStorage.removeItem("authToken");
  sessionStorage.clear();

  const eventLogout = new CustomEvent("logout-exitoso");
  window.dispatchEvent(eventLogout);

  // Mensaje específico
  alert(
    "Algún usuario cerró tu sesión en otros dispositivos. " +
    "Por eso no se pudo realizar la acción que estabas intentando. " +
    "Vuelve a iniciar sesión."
  );

  // Redirigir al login
  window.location.href = "/login";
}
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

  // ⬇⬇⬇ AGREGADO: guarda el token para que getAccessToken() lo encuentre
  if (typeof window !== "undefined" && data?.data?.accessToken) {
    localStorage.setItem("accessToken", data.data.accessToken);
  }
  // (opcional) si quieres también refresco
  // if (data?.data?.refreshToken) localStorage.setItem("refreshToken", data.data.refreshToken);
  // ⬆⬆⬆ FIN AGREGADO

  return data;
}

export async function cambiarTelefono(telefono: string, id: string) {
  const token = sessionStorage.getItem("authToken") || '';
  const res = await fetch(`${API_URL}/api/teamsys/usuario/telefono/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: `{"telefono":"${telefono}"}`
  });
  if (res.status === 401) {
    cerrarSesion();
    return; // Evita continuar si no está autorizado
  }
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

export async function obtenerMetodoAutenticacion(usuario: string) {
  const token = sessionStorage.getItem("authToken") || '';
  const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (res.status === 401) {
    cerrarSesion()
    return;
  }
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
  if (res.status === 401) {
    cerrarSesion();
    return;
  }
  const data = await res.json();

  return data.data; // contiene { secret, qrCode, backupCodes }
}
export async function verifyTwoFactor(token: string, secret: string, code: string) {
  const res = await fetch(`${API_URL}/api/teamsys/2fa/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ token: code,secret }),
  });
  if (res.status === 401) {
    cerrarSesion();
    return;
  }
  const data = await res.json();


  return data;
}

export async function verifyTwoFactorLogin(userId: string, code: string) {
  const res = await fetch(`${API_URL}/api/teamsys/2fa/verify-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, token: code }),
  });

  const data = await res.json();

 // if (!res.ok) {
  //  throw new Error(data.message || 'Error al verificar código en login');
  //}

  return data;
}

export async function desactivar2FA(codigo: string, userToken: string) {
  
    const response = await fetch(`${API_URL}/api/teamsys/2fa/disable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}` // Token en cabecera
      },
      body: JSON.stringify({ token: codigo }) // Código 2FA en body
    });
    if (response.status === 401) {
    cerrarSesion();
    return;
  }
   return response.json()
}
      
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const keys = ["accessToken", "authToken", "token", "jwt"];
  for (const k of keys) {
    const v = localStorage.getItem(k) || sessionStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

async function safeJson(res: Response) {
  try { return await res.json(); } catch { return null; }
}
export async function agregarAutenticacion(usuario: string, provider: string, password: string) {
  const token = sessionStorage.getItem("authToken") || '';
  if (provider == 'local') {
    const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: `{"provider":"${provider}","password":"${password}"}`
    });
    //console.log("Respuesta del servidor:", res.body);
    if (res.status === 401) {
    cerrarSesion();
    return;
  }
    return res.json();
  } else {
    const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: `{"provider":"${provider}","email":"${password}"}`
    });
    //console.log("Respuesta del servidor:", res.body);
    if (res.status === 401) {
      cerrarSesion()
      return;
    }
    return res.json();
  }
}

export async function eliminarAutenticacion(usuario: string, provider: string) {
  const token = sessionStorage.getItem("authToken") || '';
  const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: `{"provider":"${provider}"}`
  });
  //console.log("Respuesta del servidor:", res.body);
  if (res.status === 401) {
    cerrarSesion()
    return;
  }
  return res.json();
}
/* ============================
   CAMBIAR CONTRASEÑA (HU3)
   ============================ */
export async function cambiarContrasenaHU3(payload: {
  actual: string;
  nueva: string;
  confirmacion: string;
},socketId?:string): Promise<{ ok: boolean; message: string }>  {
  // usar tu lector de token (sin tocarlo)
  const token = getAccessToken();
  if (!token) return { ok: false, message: "No hay sesión activa." };
console.log(`socket ${socketId}`)
  try {
    const res = await fetch(`${API_URL}/api/teamsys/usuario/cambiar-contrasena`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
        ...(socketId ? { "x-socket-id": socketId } : {}),// Bearer requerido
      },
      // claves con ñ, entre comillas (según contrato que te pasaron)
      body: JSON.stringify({
        "contraseñaActual": payload.actual,
        "nuevaContraseña": payload.nueva,
        "confirmacionContraseña": payload.confirmacion,
      }),
    });
    if (res.status === 401) {
    cerrarSesion();
    return {
    ok: false,
    message:
      "Algún usuario cerró tu sesión en otros dispositivos. " +
      "Por eso no se pudo realizar la acción.",
  };
  }

    const data = await safeJson(res);

    if (!res.ok || (data && data.success === false)) {
      return { ok: false, message: (data && data.message) || "No se pudo cambiar la contraseña." };
    }

    return {
      ok: true,
      message: (data && data.message) || "Contraseña cambiada exitosamente.",
    };
  } catch {
    return { ok: false, message: "Error de red o servidor." };
  }
}

/* ====== lo demás de abajo queda como estaba ====== */

// actualizar ubicacion
export async function actualizarUbicacionBack(id: string, lat: string, long: string) {
  // Convertir strings a número (acepta coma)
  const token = sessionStorage.getItem("authToken") || '';
  const latNum = parseFloat(lat.replace(",", "."));
  const longNum = parseFloat(long.replace(",", "."));

  if (isNaN(latNum) || isNaN(longNum)) {
    throw new Error("Latitud o longitud inválidas");
  }

  // Validar rango geográfico básico
  if (latNum < -90 || latNum > 90) throw new Error("Latitud fuera de rango");
  if (longNum < -180 || longNum > 180) throw new Error("Longitud fuera de rango");

  // Asegurar URL correctamente formada
  const url = `${API_URL}/api/teamsys/usuario/ubicacion/${id}`;

  // Formato que tu back espera: [longitud, latitud]
  const body = {
    ubicacion: {
      type: "Point",
      coordinates: [longNum, latNum],
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (res.status === 401) {
    cerrarSesion();
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Error al actualizar la ubicación");
  }

  return data;
}

// === Cerrar sesiones en todos los dispositivos excepto el actual ===
// === Cerrar sesiones en todos los dispositivos excepto el actual (con fallbacks y verificación real) ===
export async function cerrarSesionesRemotas(
  accessToken: string,
  socketId?: string            // NUEVO (opcional)
): Promise<{ ok: boolean; message: string }> {
  if (!accessToken) {
    return { ok: false, message: "Token de sesión no proporcionado." };
  }

  // Limpia la URL para evitar problemas por "/", espacios, etc.
  const base = (API_URL ?? "").trim().replace(/\/+$/, "");
  const url = `${base}/api/teamsys/sessions/user/all-except-current`;

  const isRealSuccess = (res: Response, data: any) => {
    if (res.status === 204) return true;
    if (data?.success === true) return true;
    if (typeof data?.closed === "number" && data.closed > 0) return true;
    if (typeof data?.closedCount === "number" && data.closedCount > 0) return true;

    const msg = (data?.message || "").toString().toLowerCase();
    if (/cerraron|cerradas|closed/.test(msg)) return true;

    return false;
  };

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // SOLO AGREGADO: enviamos el socketId si existe
        ...(socketId ? { "x-socket-id": socketId } : {}),
      },
    });

    if (res.status === 401) {
      cerrarSesion();
      return {
        ok: false,
        message:
          "Algún usuario cerró tu sesión en otros dispositivos. " +
          "Por eso no se pudo realizar la acción.",
      };
    }

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null; // Puede ser 204 sin body
    }

    if (res.ok && isRealSuccess(res, data)) {
      const message =
        data?.message ||
        data?.msg ||
        "Se cerraron las demás sesiones correctamente.";

      return { ok: true, message };
    }

    const errorMessage =
      data?.message ||
      data?.error ||
      `Error HTTP ${res.status} al cerrar las sesiones remotas.`;

    return { ok: false, message: errorMessage };
  } catch (e: any) {
    return {
      ok: false,
      message: e?.message ?? "Error de red al cerrar sesiones remotas.",
    };
  }
}


export async function obtenerPerfilActual(accessToken: string) {
  const res = await fetch(`${API_URL}/api/teamsys/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 401) {
    cerrarSesion();
    return;
  }

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
