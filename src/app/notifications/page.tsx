"use client";
import { useState } from "react";
import SendNotificationForm from "./SendNotificationForm";
import bg from "./image.png";
import {
  notifyUserRegister,
  notifyFixerRequest,
  notifyClientAccepted,
} from "@/lib/notifications";
import TopNotificationAlert from "./TopNotificationAlert";

export default function NotificationsPage() {
  const [accepted, setAccepted] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const handleAccept = async () => {
    try {
      setAccepted(true);

      // 🔹 Crear cita real (sin tocar backend)
      const response = await fetch("http://localhost:5000/api/devcode/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proveedorId: "655e6bbefba59f4a5e9b3f22",
          servicioId: "655e6bc8fba59f4a5e9b3f23",
          clienteId: "655e6bd3fba59f4a5e9b3f24",
          fecha: "2025-11-20",
          horario: { inicio: "10:00", fin: "11:00" },
          estado: "pendiente",
        }),
      });

      if (!response.ok) {
           const errorBody = await response.text().catch(() => "");
          throw new Error(
          `Error al crear cita: ${errorBody || response.statusText}`
     );
     }


      await notifyClientAccepted(
        "adrianvallejosflores24@gmail.com",
        "Fixer Carlos"
      );

      // Mostrar alerta de éxito
      setAlert({
        show: true,
        type: "success",
        message: "Cita creada correctamente",
      });
    } catch (error) {
      console.error("Error en handleAccept:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Error al crear la cita",
      });
    } finally {
      setTimeout(() => setAccepted(false), 3000);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-blue-50"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <TopNotificationAlert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl max-w-3xl w-full shadow-2xl border border-blue-100">
        <h1
          className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-2"
          style={{ color: "#0c4fe9" }}
        >
          <span>🚀</span> Escenarios de Notificaciones del Sistema
        </h1>

        <div className="flex flex-col items-center space-y-8 w-full">
          <SendNotificationForm
            title="Registro de Usuario"
            onSend={(form) => notifyUserRegister(form.email, form.name)}
          />

          <SendNotificationForm
            title="Usuario envía solicitud a Fixer"
            onSend={(form) =>
              notifyFixerRequest(form.email, form.name, form.details ?? "")
            }
            showDetails
          />

          <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-6 w-full max-w-md mx-auto my-6 transition-all duration-300 hover:shadow-lg">
            <h2
              className="text-xl font-semibold mb-4 text-center"
              style={{ color: "#0c4fe9" }}
            >
              Fixer acepta la solicitud
            </h2>

            <div className="border border-gray-200 rounded-lg p-4 text-left bg-gray-50 mb-4 text-[#11255a]">
              <p className="text-sm">
                <strong>Solicitud:</strong> Plomería general
                <br />
                <strong>Cliente:</strong> Juanito Pérez
                <br />
                <strong>Fecha:</strong> 20 de octubre, 2025
              </p>
            </div>

            <button
              onClick={handleAccept}
              disabled={accepted}
              className={`px-5 py-2.5 rounded-xl w-full text-white font-semibold shadow-md transition-all duration-300 ${
                accepted
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-[#0c4fe9] hover:bg-[#1366fd]"
              }`}
            >
              {accepted ? "✅ Trabajo aceptado" : "Aceptar trabajo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}