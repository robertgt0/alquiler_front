"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

interface TopNotificationAlertProps {
  show: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function TopNotificationAlert({
  show,
  type,
  message,
  onClose,
}: TopNotificationAlertProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-white" : "bg-white";
  const borderColor = isSuccess ? "border-[#22c55e]" : "border-red-400";
  const iconColor = isSuccess ? "#0c4fe9" : "#dc2626";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-6 right-6 z-50"
        >
          <div
            className={`flex items-start gap-4 px-4 py-3 rounded-xl shadow-lg border ${bgColor} ${borderColor}`}
            style={{ fontFamily: "Poppins, sans-serif", minWidth: "300px" }}
          >
            <div className="relative">
              {isSuccess ? (
                <div className="bg-[#0c4fe9]/10 p-3 rounded-full">
                  <Bell size={26} color={iconColor} />
                </div>
              ) : (
                <div className="bg-red-100 p-3 rounded-full">
                  <Bell size={26} color={iconColor} />
                </div>
              )}
            </div>

            <div className="flex-1">
              <p
                className="text-[#0c4fe9] font-semibold"
                style={{ fontSize: "15px" }}
              >
                {message}
              </p>
              <p
                className="text-gray-600 mt-1"
                style={{ fontSize: "13px", lineHeight: "1.2em" }}
              >
                {isSuccess
                  ? "Tu cita fue registrada exitosamente en el sistema."
                  : "No se pudo completar la creación de la cita."}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}