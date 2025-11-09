"use client";
import { useEffect } from "react";
import { Bell } from "lucide-react";

type AlertType = "success" | "error";

interface TopNotificationAlertProps {
  show: boolean;
  type?: AlertType;
  message?: string;
  onClose?: () => void;
  duration?: number;
}

export default function TopNotificationAlert({
  show,
  type = "success",
  message = "",
  onClose,
  duration = 4000,
}: TopNotificationAlertProps) {
  // ⏱️ Auto cierre
  useEffect(() => {
    if (!show) return;
    if (!duration || duration <= 0) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  // 🎨 Configuración visual
  const config =
    type === "success"
      ? {
          title: "Cita creada correctamente",
          sub: "La cita fue registrada exitosamente.",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
          border: "border-blue-200",
        }
      : {
          title: "Error al crear la cita",
          sub: "No se pudo completar la creación de la cita.",
          iconBg: "bg-red-50",
          iconColor: "text-red-500",
          border: "border-red-200",
        };

  const showMessage = message && message.trim() !== config.title.trim();

  return (
    <div
      aria-live="polite"
      className="fixed top-6 right-6 z-[99999] w-[380px] animate-fade-in"
    >
      <div
        className={`flex flex-col bg-white/95 backdrop-blur-md border ${config.border} rounded-xl shadow-md px-5 py-3 transition-all duration-300`}
      >
        {/* 🔔 Contenido */}
        <div className="flex items-start gap-3">
          <div
            className={`flex items-center justify-center ${config.iconBg} rounded-full w-9 h-9 flex-shrink-0`}
          >
            <Bell className={`${config.iconColor} w-5 h-5`} />
          </div>

          <div className="flex-1 text-left">
            <h4 className="font-semibold text-gray-500 text-[15px] leading-tight">
              {config.title}
            </h4>
            {showMessage && (
              <p className="text-[14px] text-gray-400 mt-1 leading-snug">
                {message || config.sub}
              </p>
            )}
          </div>
        </div>

        {/* ⚙️ Botón cerrar */}
        <div className="flex justify-end mt-3">
          <button
            onClick={() => onClose?.()}
            className="text-sm px-4 py-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 transition"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* ✨ Animación */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
