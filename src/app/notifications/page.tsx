"use client";
import { useState } from "react";
import SendNotificationForm from "./SendNotificationForm";
import bg from './image.png';
import {
  notifyUserRegister,
  notifyFixerRequest,
  notifyClientAccepted,
} from "@/lib/notifications";

export default function NotificationsPage() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    setAccepted(true);
    await notifyClientAccepted("adrianvallejosflores24@gmail.com", "Fixer Carlos");
    // vuelve al estado normal después de 3 segundos
    setTimeout(() => setAccepted(false), 3000);
  };

  return (
    <div
      className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-10 px-4"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl max-w-3xl w-full shadow-2xl border border-blue-100">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-700 flex items-center justify-center gap-2">
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

          {/* Escenario 3️⃣ */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-6 w-full max-w-md mx-auto my-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">
              Fixer acepta la solicitud
            </h2>

            <div className="border border-gray-200 rounded-lg p-4 text-left bg-gray-50 mb-4">
              <p className="text-sm text-gray-700">
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
                  : "bg-blue-600 hover:bg-blue-700"
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
