"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNewServicesCount } from "@/lib/checkNewServices";

export default function NotificationBell() {
  const [newCount, setNewCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      try {
        setIsLoading(true);
        const count = await getNewServicesCount();
        if (isMounted) setNewCount(count);
      } catch (error) {
        console.error("Error verificando nuevos servicios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    check();

    // 🔁 Vuelve a verificar cada 5 segundos
    const interval = setInterval(check, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative">
      {/* 🔔 Botón de campanita */}
      <button
        onClick={() => setShowPanel((p) => !p)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition duration-200"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        {/* 🔴 Indicador si hay nuevas notificaciones */}
        {newCount > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* 📩 Panel desplegable de notificaciones */}
      {showPanel && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl border border-gray-200 z-50">
          <div className="p-3">
            {isLoading ? (
              <p className="text-gray-400 text-sm italic">Actualizando...</p>
            ) : newCount > 0 ? (
              <p className="text-gray-700 text-sm">
                Se subieron <b>{newCount}</b> nuevos servicios en los
                últimos <b>15 minutos</b>.
              </p>
            ) : (
              <p className="text-gray-500 text-sm">No hay nuevos servicios.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}