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
  duration = 3500,
}: TopNotificationAlertProps) {
  // Auto cierre
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;

  // Estilos por tipo
  const config =
    type === "success"
      ? {
          title: "Cita creada correctamente",
          iconColor: "text-blue-600",
          iconBg: "bg-blue-50",
          border: "border-blue-200",
        }
      : {
          title: "Error al crear la cita",
          iconColor: "text-red-600",
          iconBg: "bg-red-50",
          border: "border-red-200",
        };

  return (
    <>
      {/* Fondo desenfocado */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[99998] pointer-events-none"></div>

      {/* Contenedor de la notificación */}
      <div
        aria-live="polite"
        className="fixed top-6 right-6 z-[99999] w-[390px] animate-fade-in pointer-events-auto"
      >
        <div
          className={`bg-white border ${config.border} rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.10)]
            px-5 py-4 flex flex-col gap-3`}
        >
          {/* Icono + título */}
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full ${config.iconBg} flex items-center justify-center`}
            >
              <Bell className={`${config.iconColor} w-5 h-5`} />
            </div>

            <h4 className="font-semibold text-blue-700 text-[15px] leading-tight">
              {config.title}
            </h4>
          </div>

          {/* Mensaje gris (solo uno, NO duplicado) */}
          <p className="text-[14px] text-[#6f6f6f] leading-snug mt-1">
             {message}
          </p>

          {/* Botón cerrar */}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => onClose?.()}
              className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Animación */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.35s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
}
