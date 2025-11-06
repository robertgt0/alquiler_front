'use client';

import React, { useState } from "react";
import { cambiarContrasenaHU3 } from "@/app/teamsys/services/UserService";

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
  const [banner, setBanner] = useState<{type: "ok" | "err" | null; text: string}>({ type: null, text: "" });

  const validar = () => {
    let ok = true;

    if (!actual) {
      setErrActual("Ingresa tu contraseña actual.");
      ok = false;
    } else {
      setErrActual(null);
    }

    if (!RE_COMPLEJIDAD.test(nueva)) {
      setErrNueva(
        "Mín. 8 caracteres, con mayúscula, minúscula, número y símbolo."
      );
      ok = false;
    } else {
      setErrNueva(null);
    }

    if (confirmacion !== nueva) {
      setErrConfirm("La confirmación no coincide.");
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

    setLoading(true);
    const resp = await cambiarContrasenaHU3({
      actual,
      nueva,
      confirmacion,
    });
    setLoading(false);

    if (!resp.ok) {
      setBanner({ type: "err", text: resp.message || "Error al cambiar contraseña." });
      return;
    }

    // Éxito HU3:
    setBanner({ type: "ok", text: resp.message });
    // Limpia campos
    setActual("");
    setNueva("");
    setConfirmacion("");
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl w-full max-w-md p-6">
        <h2 className="text-center text-blue-600 font-semibold text-lg mb-1">
          Cambiar contraseña
        </h2>

        {banner.type && (
          <p
            className={`text-center text-sm mb-3 ${
              banner.type === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {banner.text}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <input
              type="password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              className={`w-full px-3 py-3 border rounded-2xl focus:outline-none focus:ring-2 ${
                errActual ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Contraseña actual"
            />
            {errActual && <p className="text-xs text-red-600 mt-1">{errActual}</p>}
          </div>

          <div>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              className={`w-full px-3 py-3 border rounded-2xl focus:outline-none focus:ring-2 ${
                errNueva ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Nueva contraseña"
            />
            {errNueva && <p className="text-xs text-red-600 mt-1">{errNueva}</p>}
          </div>

          <div>
            <input
              type="password"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              className={`w-full px-3 py-3 border rounded-2xl focus:outline-none focus:ring-2 ${
                errConfirm ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Confirmar nueva contraseña"
            />
            {errConfirm && <p className="text-xs text-red-600 mt-1">{errConfirm}</p>}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-2xl hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 text-white py-2 rounded-2xl ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
