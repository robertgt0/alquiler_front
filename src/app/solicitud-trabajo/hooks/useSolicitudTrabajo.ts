import { useState } from "react";
import { ISolicitud, IFranjaDisponible } from "../interfaces/Solicitud.interface";
import { toMinutes } from "../utils/helpers";
import { enviarSolicitudMock } from "../services/solicitudService";

export function useSolicitudTrabajo(
  franjas: IFranjaDisponible[],
  date: string,
  providerId: string
) {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const enviar = async (data: ISolicitud) => {
    setMensaje("");

    if (!data.horaInicio || !data.horaFin) {
      setEnviado(false);
      setMensaje("Selecciona hora inicio y fin.");
      return;
    }
    if (toMinutes(data.horaFin) <= toMinutes(data.horaInicio)) {
      setEnviado(false);
      setMensaje("La hora fin debe ser mayor a la hora inicio.");
      return;
    }

    setLoading(true);
    try {
      const resp = await enviarSolicitudMock(date, providerId, data, franjas);
      setEnviado(resp.ok);
      setMensaje(resp.message);
    } catch {
      setMensaje("No pudimos enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // devolvemos mensaje
  return { loading, enviado, mensaje, setMensaje, enviar };
}
