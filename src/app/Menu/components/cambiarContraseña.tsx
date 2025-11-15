'use client';

import React, { useState } from "react";
import { cambiarContrasenaHU3 } from "@/app/teamsys/services/UserService";
import { getSocket } from "@/app/teamsys/realtime/socketClient";

interface Props {
  onClose: () => void;
}

const RE_COMPLEJIDAD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,30}$/; // min 8, mayus, minus, número y símbolo

export default function CambiarContrasena({ onClose }: Props) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  const [errActual, setErrActual] = useState<string | null>(null);
  const [errNueva, setErrNueva] = useState<string | null>(null);
  const [errConfirm, setErrConfirm] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{
    type: "ok" | "err" | null;
    text: string;
  }>({ type: null, text: "" });

  // Modal de éxito "Tu contraseña fue actualizada"
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validar = () => {
    let ok = true;

    // CONTRASEÑA ACTUAL
    if (!actual) {
      setErrActual("Ingresa tu contraseña actual.");
      ok = false;
    } else {
      setErrActual(null);
    }

    // NUEVA CONTRASEÑA
    if (!nueva) {
      setErrNueva("Ingresa una nueva contraseña.");
      ok = false;
    } else if (!RE_COMPLEJIDAD.test(nueva)) {
      setErrNueva(
        "La nueva contraseña debe tener entre 8 y 30 caracteres e incluir mayúscula, minúscula, número y símbolo."
      );
      ok = false;
    } else if (nueva === actual) {
      // Evita al menos reutilizar la contraseña actual
      setErrNueva("La nueva contraseña no puede ser igual a la contraseña actual.");
      ok = false;
    } else {
      setErrNueva(null);
    }

    // CONFIRMACIÓN
    if (!confirmacion) {
      setErrConfirm("Confirma tu nueva contraseña.");
      ok = false;
    } else if (confirmacion !== nueva) {
      setErrConfirm("La confirmación no coincide con la nueva contraseña.");
      ok = false;
    } else {
      setErrConfirm(null);
    }

    return ok;
  };

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setBanner({ type: null, text: "" });

  if (!validar()) return;

  try {
    setLoading(true);

    //  Igual que en CerrarSesiones
    const socket = getSocket();
    const socketId = socket?.id;  // por si acaso

    const resp = await cambiarContrasenaHU3(
      {
        actual,
        nueva,
        confirmacion,
      },
      socketId  //  aquí se envía al servicio
    );

    setLoading(false);

    if (!resp.ok) {
      setBanner({
        type: "err",
        text: resp.message || "No se pudo cambiar la contraseña.",
      });
      return;
    }

    setActual("");
    setNueva("");
    setConfirmacion("");

    setBanner({
      type: "ok",
      text: resp.message || "Contraseña cambiada exitosamente.",
    });

    // Muestra ventana "Tu contraseña fue actualizada"
    setShowSuccessModal(true);
  } catch (error) {
    setLoading(false);
    setBanner({
      type: "err",
      text: "Error de red o servidor.",
    });
  }
};


  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#2D7DFF] flex items-center justify-center z-50 px-4">
      {/* CARD CON FONDO AZUL COMO EN EL MOCKUP */}
      <div className="bg-blue-50 rounded-3xl border border-blue-200 shadow-xl w-full max-w-md p-6">
        <h2 className="text-center text-blue-700 font-semibold text-lg mb-1">
          Cambiar contraseña
        </h2>

        {/* Mensaje general (error / info) */}
        {banner.type && (
          <p
            className={`text-center text-sm mb-3 ${
              banner.type === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {banner.text}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* CONTRASEÑA ACTUAL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña actual
            </label>
            <input
              type="password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              className={`w-full px-3 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 ${
                errActual
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Ingresa tu contraseña actual"
            />
            {errActual && (
              <p className="text-xs text-red-600 mt-1">{errActual}</p>
            )}
          </div>

          {/* NUEVA CONTRASEÑA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              className={`w-full px-3 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 ${
                errNueva
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Ingresa tu nueva contraseña"
            />
            <p className="text-xs text-gray-500 mt-1">
              Debe tener entre 8 y 30 caracteres, incluir mayúsculas, minúsculas,
              números y un símbolo.
            </p>
            {errNueva && (
              <p className="text-xs text-red-600 mt-1">{errNueva}</p>
            )}
          </div>

          {/* CONFIRMAR NUEVA CONTRASEÑA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              className={`w-full px-3 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 ${
                errConfirm
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Vuelve a escribir tu nueva contraseña"
            />
            {errConfirm && (
              <p className="text-xs text-red-600 mt-1">{errConfirm}</p>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-2xl text-sm hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 text-white py-2 rounded-2xl text-sm transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL DE ÉXITO */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Tu contraseña fue actualizada
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Has cambiado tu contraseña correctamente.
            </p>
            <button
              onClick={closeSuccessModal}
              className="w-full rounded-2xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
