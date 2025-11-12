

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
export async function cerrarSesionesRemotas(): Promise<{ ok: boolean; message: string }> {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "No hay sesión activa." };

  const base = API_URL.replace(/\/+$/, "");

  // Variantes típicas de path
  const candidatePaths = [
    "/api/teamsys/sessions/user/all-except-current", // plural + /user
    "/api/teamsys/session/user/all-except-current",  // singular + /user
    "/api/teamsys/sessions/all-except-current",      // plural sin /user
    "/api/teamsys/session/all-except-current",       // singular sin /user
  ];

  const methods: Array<"POST" | "DELETE"> = ["POST", "DELETE"];
  let lastError = "Ruta no encontrada.";

  // Helper para decidir si hubo éxito REAL
  const isRealSuccess = (res: Response, data: any) => {
    // 204 No Content suele ser éxito en endpoints "acción"
    if (res.status === 204) return true;
    // Contratos comunes de éxito
    if (data?.success === true) return true;
    if (typeof data?.closed === "number" && data.closed > 0) return true;
    if (typeof data?.closedCount === "number" && data.closedCount > 0) return true;
    // Mensajes típicos del back
    const msg = (data?.message || "").toString().toLowerCase();
    if (/cerraron|cerradas|closed/.test(msg)) return true;
    return false;
  };

  for (const p of candidatePaths) {
    const url = `${base}${p}`;
    for (const m of methods) {
      try {
        const res = await fetch(url, {
          method: m,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Puede no haber body (204). Safe parse:
        let data: any = null;
        try { data = await res.json(); } catch { data = null; }

        if (res.ok && isRealSuccess(res, data)) {
          // éxito real
          const message =
            (data && data.message) ||
            "Se cerraron las demás sesiones.";
          return { ok: true, message };
        }

        // Si 404, prueba siguiente variante
        if (res.status === 404) {
          console.warn(`404 en ${m} ${url} — probando siguiente variante…`);
          lastError = (data && data.message) || `HTTP 404 en ${m} ${url}`;
          continue;
        }

        // Si 2xx pero sin éxito real, seguimos buscando otra variante
        if (res.ok) {
          lastError =
            (data && data.message) ||
            `Endpoint ${m} ${url} respondió 2xx pero no confirmó cierre de sesiones.`;
          console.warn(lastError);
          continue;
        }

        // Otros códigos (401/403/500…): devolvemos el error
        lastError = (data && data.message) || `HTTP ${res.status} en ${m} ${url}`;
        console.error(`Fallo ${m} ${url}:`, lastError);
        return { ok: false, message: lastError };
      } catch (e: any) {
        lastError = e?.message || `Error de red en ${m} ${url}`;
        console.error(lastError);
        // probar siguiente variante
      }
    }
  }

  // Ninguna variante confirmó éxito
  return { ok: false, message: lastError || "No se pudieron cerrar las otras sesiones." };
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