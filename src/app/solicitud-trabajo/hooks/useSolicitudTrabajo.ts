"use client";
import { useState } from "react";
import { ISolicitud, IFranjaDisponible } from "../interfaces/Solicitud.interface";
import { enviarSolicitud } from "../services/solicitudService";

export function useSolicitudTrabajo(
  franjas: IFranjaDisponible[],
  date: string,
  _providerId: string // lo dejamos si luego lo usas
) {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function enviar(parcial: Pick<ISolicitud, "horaInicio" | "horaFin">) {
    setLoading(true);
    setMensaje("");

    try {
      if (!date) {
      throw new Error("Falta la fecha (date)"); // evita ir al back vacío
      }
      const payload: ISolicitud = {
        date,                          // <- viene del prop que recibe el hook
        horaInicio: parcial.horaInicio,
        horaFin: parcial.horaFin,
      };

      // Si quieres validar contra franjas antes de enviar, hazlo aquí…

      const resp = await enviarSolicitud(payload); // <-- llamada real
      setMensaje(resp?.message || "Solicitud enviada con éxito");
    } catch (e: any) {
      setMensaje(e?.message || "Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  }

  return { loading, mensaje, setMensaje, enviar };
}
