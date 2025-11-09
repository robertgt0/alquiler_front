"use client";

import { useState } from "react";

/**
 * Hook SOLO-frontend:
 * - No llama backend
 * - No cambia el estado real del trabajo
 * - Solo muestra mensajes y simula una acción rápida de UI
 */

type TipoAccion = "confirmar" | "rechazar" | null;

interface MensajeUI {
  tipo: Exclude<TipoAccion, null>;
  texto: string;
}

export function useGestionSolicitud() {
  const [loading, setLoading] = useState<TipoAccion>(null);
  const [mensaje, setMensaje] = useState<MensajeUI | null>(null);

  const wait = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

  async function simularConfirmar() {
    setLoading("confirmar");
    try {
      await wait(300);
      setMensaje({
        tipo: "confirmar",
        texto:
          "Solicitud Confirmada. El estado se actualizará cuando el sistema procese la solicitud.",
      });
    } finally {
      setLoading(null);
    }
  }

  async function simularRechazar() {
    setLoading("rechazar");
    try {
      await wait(300);
      setMensaje({
        tipo: "rechazar",
        texto:
          "Solicitud Rechazada. El estado se actualizará cuando el sistema procese la solicitud.",
      });
    } finally {
      setLoading(null);
    }
  }

  return { loading, mensaje, setMensaje, simularConfirmar, simularRechazar };
}
