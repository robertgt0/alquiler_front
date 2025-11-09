"use client";
import { useEffect } from "react";

type AlertType = "success" | "error" | "info" | "warning";

interface TopNotificationAlertProps {
  show: boolean;
  type?: AlertType;
  message?: string;
  onClose?: () => void;
  duration?: number; // milisegundos
}

export default function TopNotificationAlert({
  show,
  type = "info",
  message = "",
  onClose,
  duration = 3500,
}: TopNotificationAlertProps) {
  // 🕒 Auto-cierre
  useEffect(() => {
    if (!show || !duration || duration <= 0) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  // 🎨 Colores según estándares UMSS
  const styles =
    type === "success"
      ? { border: "border-[#0c4fe9]/30", text: "text-[#0c4fe9]" }
      : type === "error"
      ? { border: "border-[#E91923]/30", text: "text-[#E91923]" }
      : type === "warning"
      ? { border: "border-[#FFDF20]/40", text: "text-[#11255a]" }
      : { border: "border-gray-300", text: "text-[#11255a]" };

  // 🩵 Título predeterminado según tipo
  const defaultTitle =
    type === "success"
      ? "Cita creada correctamente"
      : type === "error"
      ? "Error al crear la cita"
      : type === "warning"
      ? "Atención"
      : "Información";

  const showTitle = !message.toLowerCase().includes(defaultTitle.toLowerCase());

  return (
    <div
      aria-live="polite"
      className="fixed top-6 right-6 z-[99999] max-w-[380px] w-full animate-fade-in"
    >
      <div
        className={`rounded-2xl px-5 py-4 flex items-start gap-3 border ${styles.border} ${styles.text} 
          shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300`}
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "16px",
        }}
      >
        <div className="flex-1">
          {showTitle && (
            <div className="font-semibold text-base mb-1 tracking-wide font-[Poppins]">
              {defaultTitle}
            </div>
          )}
          <div className="text-sm opacity-90 leading-snug font-[Inter]">
            {message ||
              (type === "success"
                ? "La cita fue registrada exitosamente en el sistema."
                : type === "error"
                ? "Ocurrió un problema al procesar la cita. Inténtalo de nuevo."
                : type === "warning"
                ? "Verifica los campos antes de continuar."
                : "Notificación general.")}
          </div>
        </div>

        <button
          onClick={() => onClose?.()}
          className="text-gray-400 hover:text-gray-600 text-lg font-medium ml-3 leading-none"
          aria-label="Cerrar alerta"
        >
          ✕
        </button>
      </div>

      {/* Animación suave */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
  );
}
