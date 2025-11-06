"use client";
import React, { useEffect, useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MagicLinkPage() {
  const [status, setStatus] = useState<"loading"|"ok"|"error">("loading");
  const [message, setMessage] = useState("Validando enlace mágico...");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { setStatus("error"); setMessage("El enlace no contiene un token válido."); return; }
    if (!API_URL) { setStatus("error"); setMessage("Falta NEXT_PUBLIC_BACKEND_URL."); return; }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/teamsys/magic-link/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.status === 410) throw new Error("El enlace ha expirado. Solicita uno nuevo.");
        if (res.status === 409) throw new Error("Este enlace ya ha sido usado. Solicita uno nuevo.");
        if (res.status === 401) throw new Error(data?.message || "Token inválido.");
        if (!res.ok || data?.success === false) throw new Error(data?.message || "Error al verificar enlace.");

        localStorage.setItem("accessToken", data.data?.accessToken || "");
        localStorage.setItem("refreshToken", data.data?.refreshToken || "");
        if (data.data?.user) localStorage.setItem("userData", JSON.stringify(data.data.user));

        setStatus("ok"); setMessage("✅ Acceso concedido. Redirigiendo…");
        setTimeout(() => (window.location.href = "/home"), 1200);
      } catch (e:any) {
        setStatus("error"); setMessage(e?.message || "Error al verificar el enlace.");
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className={`rounded-2xl p-6 text-center shadow ${status==="error"?"bg-red-50 text-red-700 border border-red-300":status==="ok"?"bg-green-50 text-green-800 border border-green-300":"bg-white text-gray-700 border border-gray-200"}`}>
        <h1 className="text-2xl font-semibold mb-2">
          {status==="loading"?"Verificando enlace…":status==="ok"?"¡Listo!":"Error con el enlace"}
        </h1>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
