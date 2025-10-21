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
      className="min-h-screen bg-center bg-no-repeat bg-fixed py-10 flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover", // ✅ ocupa todo el fondo
        backgroundPosition: "center", // centrada
      }}
    >
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl max-w-3xl mx-auto shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <span>🚀</span> Prueba de Concepto - Notificaciones
        </h1>

        <div className="flex flex-col items-center space-y-8">
          <SendNotificationForm
            title="1️⃣ Registro de usuario"
            onSend={(form) => notifyUserRegister(form.email, form.name)}
          />

          <SendNotificationForm
            title="2️⃣ Usuario envía solicitud a Fixer"
            onSend={(form) =>
              notifyFixerRequest(form.email, form.name, form.details ?? "")
            }
            showDetails
          />

          {/* 3️⃣ Escenario: Fixer acepta una solicitud */}
          <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md mx-auto my-6 text-center">
            <h2 className="text-xl font-semibold mb-4">
              3️⃣ Fixer acepta la solicitud
            </h2>

            <div className="border rounded-lg p-4 text-left bg-gray-50 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Solicitud de trabajo:</strong> Plomería general
                <br />
                <strong>Cliente:</strong> Juanito Pérez
                <br />
                <strong>Fecha:</strong> 20 de octubre, 2025
              </p>
            </div>

            <button
              onClick={handleAccept}
              disabled={accepted}
              className={`px-4 py-2 rounded w-full text-white transition-all duration-300 ${
                accepted
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
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
