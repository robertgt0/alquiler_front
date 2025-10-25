"use client";
import { useState } from "react";
import { ISolicitud, IFranjaDisponible } from "../interfaces/Solicitud.interface";
import { enviarSolicitud } from "../services/solicitudService";

type SolicitudResponse = { message?: string }; // ajusta si tu service tipa el retorno

export function useSolicitudTrabajo(
  franjas: IFranjaDisponible[],
  date: string,
  _providerId?: string
) {
  // Marcar explícitamente las props aún no usadas para que ESLint no avise:
  void franjas;
  void _providerId;

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function enviar(parcial: Pick<ISolicitud, "horaInicio" | "horaFin">) {
    setLoading(true);
    setMensaje("");

    try {
      if (!date) {
        throw new Error("Falta la fecha (date)");
      }

      const payload: ISolicitud = {
        date,
        horaInicio: parcial.horaInicio,
        horaFin: parcial.horaFin,
      };

      const resp = (await enviarSolicitud(payload)) as SolicitudResponse;
      setMensaje(resp?.message || "Solicitud enviada con éxito");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al enviar solicitud";
      setMensaje(msg);
    } finally {
      setLoading(false);
    }
  }

  return { loading, mensaje, setMensaje, enviar };
}

