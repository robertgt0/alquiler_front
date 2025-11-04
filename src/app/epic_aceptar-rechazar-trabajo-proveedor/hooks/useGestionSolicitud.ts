"use client";

import { useState } from "react";
import { confirmarSolicitud, rechazarSolicitud } from "../services/solicitudProveedorService";

export function useGestionSolicitud(id: string) {
  const [loading, setLoading] = useState<"confirmar" | "rechazar" | null>(null);
  const [mensaje, setMensaje] = useState("");

  // 🟦 Acción: Confirmar solicitud
  async function onConfirmar() {
    setMensaje("");
    setLoading("confirmar");
    try {
      await confirmarSolicitud(id); // 👉 conexión real con backend más adelante
      setMensaje("✅ Solicitud confirmada. El trabajo pasará a 'Confirmado'.");
    } catch {
      setMensaje("❌ No se pudo confirmar. Intenta nuevamente.");
    } finally {
      setLoading(null);
    }
  }

  // 🔴 Acción: Rechazar solicitud
  async function onRechazar() {
    setMensaje("");
    setLoading("rechazar");
    try {
      await rechazarSolicitud(id);
      setMensaje("⚠️ Solicitud rechazada. El trabajo pasará a 'Cancelado'.");
    } catch {
      setMensaje("❌ No se pudo rechazar. Intenta nuevamente.");
    } finally {
      setLoading(null);
    }
  }

  return { loading, mensaje, setMensaje, onConfirmar, onRechazar };
}
