"use client";

import { useState } from "react";

/**
 * Hook SOLO-frontend:
 * - No llama backend
 * - No cambia el estado real del trabajo
 * - Solo muestra mensajes y simula una acción rápida de UI
 */
export function useGestionSolicitud() {
  const [loading, setLoading] = useState<"confirmar" | "rechazar" | null>(null);
  const [mensaje, setMensaje] = useState("");

  const wait = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

  async function simularConfirmar() {
    setLoading("confirmar");
    try {
      await wait(300);
      // Mensaje de interfaz. La actualización real será del backend cuando esté integrado.
      setMensaje(
        "Tu confirmación fue enviada. El estado se actualizará cuando el sistema procese la solicitud."
      );
    } finally {
      setLoading(null);
    }
  }

  async function simularRechazar() {
    setLoading("rechazar");
    try {
      await wait(300);
      setMensaje(
        "Tu rechazo fue enviado. El estado se actualizará cuando el sistema procese la solicitud."
      );
    } finally {
      setLoading(null);
    }
  }

  return { loading, mensaje, setMensaje, simularConfirmar, simularRechazar };
}
