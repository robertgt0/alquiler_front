// src/modules/epic_aceptar-rechazar-trabajo-proveedor/hooks/useGestionSolicitud.ts
"use client";

import { useState } from "react";
import { confirmarSolicitud, rechazarSolicitud } from "../services/solicitudProveedorService";

type TipoAccion = "confirmar" | "rechazar" | null;

interface MensajeUI {
  tipo: Exclude<TipoAccion, null>;
  texto: string;
}

export function useGestionSolicitud() {
  const [loading, setLoading] = useState<TipoAccion>(null);
  const [mensaje, setMensaje] = useState<MensajeUI | null>(null);

  async function confirmarTrabajo(id: string) {
    setLoading("confirmar");
    try {
      await confirmarSolicitud(id);
      setMensaje({
        tipo: "confirmar",
        texto: "✅ Solicitud confirmada correctamente.",
      });
    } catch (error: unknown) {
      const mensajeError =
        error instanceof Error ? error.message : "Error al confirmar la solicitud.";
      setMensaje({
        tipo: "rechazar",
        texto: mensajeError,
      });
    } finally {
      setLoading(null);
    }
  }

  async function rechazarTrabajo(id: string) {
    setLoading("rechazar");
    try {
      await rechazarSolicitud(id);
      setMensaje({
        tipo: "rechazar",
        texto: "❌ Solicitud rechazada correctamente.",
      });
    } catch (error: unknown) {
      const mensajeError =
        error instanceof Error ? error.message : "Error al rechazar la solicitud.";
      setMensaje({
        tipo: "rechazar",
        texto: mensajeError,
      });
    } finally {
      setLoading(null);
    }
  }

  return { loading, mensaje, setMensaje, confirmarTrabajo, rechazarTrabajo };
}
