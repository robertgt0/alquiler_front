// src/app/components/PermisoGeolocalizacion.tsx
"use client";

import React, { useEffect, useState } from "react";
import { UbicacionManager } from "./UbicacionManager";

interface PermisoGeolocalizacionProps {
  isLoggedIn: boolean; // prop que indica si el app cree que está logueado
}

export default function PermisoGeolocalizacion({ isLoggedIn: propIsLoggedIn }: PermisoGeolocalizacionProps) {
  const [estadoPermisos, setEstadoPermisos] = useState<"granted" | "denied" | "prompt">("prompt");
  const [solicitando, setSolicitando] = useState(false);
  const [mostrarTooltip, setMostrarTooltip] = useState(false);

  // estado efectivo de autenticación: usa prop, pero si es false comprueba storage (caso Google sign-in)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!propIsLoggedIn);

  const ubicacionManager = UbicacionManager.getInstancia();

  // helper para revisar storage (soporta local/session)
  const checkAuthStorage = (): boolean => {
    try {
      const token = localStorage.getItem("authToken") ?? sessionStorage.getItem("authToken");
      const user = localStorage.getItem("userData") ?? sessionStorage.getItem("userData");
      return !!(token && user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  };

  // sincronizar prop + storage al montar
  useEffect(() => {
    if (propIsLoggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(checkAuthStorage());
    }

    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "authToken" || e.key === "userData") {
        setIsLoggedIn(checkAuthStorage());
      }
    };

    const onLogin = () => setIsLoggedIn(true);
    const onLogout = () => {
      setIsLoggedIn(false);
      setEstadoPermisos("prompt");
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("login-exitoso", onLogin);
    window.addEventListener("logout-exitoso", onLogout);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("login-exitoso", onLogin);
      window.removeEventListener("logout-exitoso", onLogout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // verificar estado de permisos **solo** cuando estemos logueados
  useEffect(() => {
    const verificarEstadoPermisos = async (): Promise<void> => {
      try {
        const permisosConcedidos = await ubicacionManager.verificarPermisosGeolocalizacion();
        setEstadoPermisos(permisosConcedidos ? "granted" : "prompt");
      } catch (error) {
        console.log("Error al verificar permisos:", error);
        setEstadoPermisos("prompt");
      }
    };

    if (isLoggedIn) {
      verificarEstadoPermisos();
    } else {
      setEstadoPermisos("prompt");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleSolicitarPermisos = async (): Promise<void> => {
    // proteccion: si no estamos logueados no hacemos nada
    if (!isLoggedIn) return;

    setSolicitando(true);

    try {
      const concedido = await ubicacionManager.solicitarPermisosGeolocalizacion();

      if (concedido) {
        setEstadoPermisos("granted");
        window.dispatchEvent(new CustomEvent("solicitar-geolocalizacion"));
      } else {
        setEstadoPermisos("denied");
      }
    } catch (error) {
      console.log("Error al solicitar permisos:", error);
      setEstadoPermisos("denied");
    } finally {
      setSolicitando(false);
    }
  };

  const getIcono = (): string => {
    if (!isLoggedIn) return "🔒";
    switch (estadoPermisos) {
      case "granted": return "✅";
      case "denied": return "❌";
      default: return "📍";
    }
  };

  const getTooltipText = (): string => {
    if (!isLoggedIn) return "Inicia sesión para acceder a tu ubicación";
    switch (estadoPermisos) {
      case "granted": return "Permisos de ubicación concedidos";
      case "denied": return "Permisos de ubicación denegados";
      default: return "Haz clic para permitir el acceso a tu ubicación";
    }
  };

  const getColorClases = (): string => {
    if (!isLoggedIn) return "bg-gray-400 text-white cursor-not-allowed";
    switch (estadoPermisos) {
      case "granted": return "bg-green-500 hover:bg-green-600 text-white";
      case "denied": return "bg-red-500 hover:bg-red-600 text-white";
      default: return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  };

  const estaDeshabilitado = !isLoggedIn || solicitando || estadoPermisos === "granted";

  return (
    // mantengo la posición que pediste; uso z-[1000] para Tailwind y evito que el contenedor bloquee clicks
    <div className="fixed bottom-40 right-8 z-1000 flex flex-col items-end pointer-events-none">
      {mostrarTooltip && (
        <div className="mb-2 bg-gray-800 text-white text-sm rounded-lg py-2 px-3 max-w-xs shadow-lg relative pointer-events-auto">
          {getTooltipText()}
          <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-gray-800 rotate-45" />
        </div>
      )}

      <button
        className={`
          w-12 h-12 rounded-full shadow-lg transition-all duration-200 
          flex items-center justify-center text-lg font-bold
          ${getColorClases()}
          ${!isLoggedIn ? "" : solicitando ? "opacity-50" : "hover:scale-105"}
        `}
        onClick={handleSolicitarPermisos}
        disabled={estaDeshabilitado}
        aria-disabled={estaDeshabilitado}
        onMouseEnter={() => setMostrarTooltip(true)}
        onMouseLeave={() => setMostrarTooltip(false)}
        title={getTooltipText()}
        aria-label="Solicitar permisos de geolocalización"
        style={{ pointerEvents: estaDeshabilitado ? "none" : "auto" }}
      >
        {solicitando ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          getIcono()
        )}
      </button>
    </div>
  );
}
