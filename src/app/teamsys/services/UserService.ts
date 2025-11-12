

import { Delete } from "lucide-react";
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

  // ⬇⬇⬇ AGREGADO: guarda el token para que getAccessToken() lo encuentre
  if (typeof window !== "undefined" && data?.data?.accessToken) {
    localStorage.setItem("accessToken", data.data.accessToken);
  }
  // (opcional) si quieres también refresco
  // if (data?.data?.refreshToken) localStorage.setItem("refreshToken", data.data.refreshToken);
  // ⬆⬆⬆ FIN AGREGADO

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
    body: JSON.stringify({ token: code,secret }),
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
export async function agregarAutenticacion(usuario:string,provider:string,password:string) {
  if(provider=='local'){
  const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: `{"provider":"${provider}","password":"${password}"}`
  });
  //console.log("Respuesta del servidor:", res.body);
  return res.json();
  }else{
    const res = await fetch(`${API_URL}/api/teamsys/auth-Method/${usuario}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: `{"provider":"${provider}","email":"${password}"}`
  });
  //console.log("Respuesta del servidor:", res.body);
  return res.json();
  }
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
/* ============================
   CAMBIAR CONTRASEÑA (HU3)
   ============================ */
export async function cambiarContrasenaHU3(payload: {
  actual: string;
  nueva: string;
  confirmacion: string;
}): Promise<{ ok: boolean; message: string }> {
  // usar tu lector de token (sin tocarlo)
  const token = getAccessToken();
  if (!token) return { ok: false, message: "No hay sesión activa." };

  try {
    const res = await fetch(`${API_URL}/api/teamsys/usuario/cambiar-contrasena`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Bearer requerido
      },
      // claves con ñ, entre comillas (según contrato que te pasaron)
      body: JSON.stringify({
        "contraseñaActual": payload.actual,
        "nuevaContraseña": payload.nueva,
        "confirmacionContraseña": payload.confirmacion,
      }),
    });

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
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Error al actualizar la ubicación");
  }

  return data;
}

// === Cerrar sesiones en todos los dispositivos excepto el actual ===
// === Cerrar sesiones en todos los dispositivos excepto el actual (con fallbacks y verificación real) ===
export async function cerrarSesionesRemotas(
  accessToken: string
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
        Authorization: Bearer ${accessToken},
      },
    });

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
      Error HTTP ${res.status} al cerrar las sesiones remotas.;

    return { ok: false, message: errorMessage };
  } catch (e: any) {
    return {
      ok: false,
      message: e?.message ?? "Error de red al cerrar sesiones remotas.",
    };
  }}