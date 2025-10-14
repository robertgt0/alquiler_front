import { useState } from "react";
import { enviarSolicitud } from "../services/solicitudService";
import { ISolicitud } from "../interfaces/Solicitud.interface";

export function useSolicitudTrabajo() {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [mensaje, setMensaje] = useState("");   // ⬅️ añadimos estado

  const enviar = async (data: ISolicitud) => {
    setMensaje("");
    if (!data.horaInicio || !data.horaFin) {
      setMensaje("Selecciona hora inicio y fin.");
      setEnviado(false);
      return;
    }
    if (data.horaFin <= data.horaInicio) {
      setMensaje("La hora fin debe ser mayor a la hora inicio.");
      setEnviado(false);
      return;
    }

    setLoading(true);
    try {
      await enviarSolicitud(data);
      setEnviado(true);
    } catch {
      setMensaje("No pudimos enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // ⬅️ devolvemos mensaje
  return { loading, enviado, mensaje, enviar };
}
