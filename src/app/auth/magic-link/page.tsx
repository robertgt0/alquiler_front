"use client";
import React, { useEffect, useState } from "react";
import { obtenerPerfilActual } from "../../teamsys/services/UserService"; // ajusta la ruta si tu árbol difiere
import { useRouter } from 'next/navigation';


const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function MagicLinkPage() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Validando enlace mágico...");
  const router = useRouter();
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    const run = async () => {
      try {
        if (!API_URL) throw new Error("Falta NEXT_PUBLIC_BACKEND_URL.");
        if (!token) throw new Error("El enlace no contiene un token válido.");

        // 1) Verificar el token con el backend
        const res = await fetch(`${API_URL}/api/teamsys/magic-link/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        let data = await res.json().catch(() => ({}));

        if (res.status === 410) throw new Error("El enlace ha expirado. Solicita uno nuevo.");
        if (res.status === 409) throw new Error("Este enlace ya ha sido usado. Solicita uno nuevo.");
        if (res.status === 401) throw new Error(data?.message || "Token inválido.");
        if (!res.ok || data?.success === false) throw new Error(data?.message || "Error al verificar enlace.");

        // 2) Guardar sesión con lo que devuelve verify
        const accessToken   = data?.data?.accessToken || "";
        const refreshToken  = data?.data?.refreshToken || "";
        const userFromVerify = data?.data?.user || null;

        if (!accessToken) throw new Error("El servidor no devolvió accessToken.");

        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (userFromVerify) localStorage.setItem("userData", JSON.stringify(userFromVerify));

        // 3) Leer /me para extraer correo y authProvider (y cualquier otro dato fresco)
        try {
           data = await obtenerPerfilActual(accessToken);
        } catch (e) {
          console.warn("No se pudo leer /me:", e);
          // no bloquea el login
        }

        setStatus("ok");
        setMessage("✅ Acceso concedido. Redirigiendo…");
        sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem('userData', JSON.stringify(data.data));
    
      
      // Disparar evento de login exitoso para que el Header se actualice
      const eventLogin = new CustomEvent("login-exitoso");
      window.dispatchEvent(eventLogin);
      
      // Redirigir a home
      router.push('/');
      } catch (e: any) {
        setStatus("error");
        setMessage(e?.message || "Error al verificar el enlace.");
      }
    };

    run();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div
        className={`rounded-2xl p-6 text-center shadow-lg ${
          status === "error"
            ? "bg-red-50 text-red-700 border border-red-300"
            : status === "ok"
            ? "bg-green-50 text-green-800 border border-green-300"
            : "bg-white text-gray-700 border border-gray-200"
        }`}
      >
        <h1 className="text-2xl font-semibold mb-2">
          {status === "loading" ? "Verificando enlace…" : status === "ok" ? "¡Listo!" : "Error con el enlace"}
        </h1>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
