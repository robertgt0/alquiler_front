import { useState } from "react";
import {
  ISolicitud,
  IFranjaDisponible,
} from "../interfaces/Solicitud.interface";
import {
  toMinutes,
  isInsideAnyFranja,
  isTimeInsideAnyFranja,
} from "../utils/helpers";
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

    // 1) Validaciones básicas
    if (!data.horaInicio || !data.horaFin) {
      setEnviado(false);
      setMensaje("Selecciona hora inicio y hora fin para solicitar el trabajo.");
      return;
    }
    if (toMinutes(data.horaFin) <= toMinutes(data.horaInicio)) {
      setEnviado(false);
      setMensaje("La hora fin debe ser mayor a la hora inicio.");
      return;
    }

    // 2) Validación puntual: cada hora debe existir en alguna franja disponible
    const inicioOk = isTimeInsideAnyFranja(data.horaInicio, franjas);
    const finOk = isTimeInsideAnyFranja(data.horaFin, franjas);

    if (!inicioOk && !finOk) {
      setEnviado(false);
      setMensaje("Horario no disponible");
      return;
    }
    if (!inicioOk) {
      setEnviado(false);
      setMensaje("Hora inicio no disponible");
      return;
    }
    if (!finOk) {
      setEnviado(false);
      setMensaje("Hora fin no disponible");
      return;
    }

    // 3) Validación del rango completo: debe caer dentro de UNA franja
    if (!isInsideAnyFranja(data.horaInicio, data.horaFin, franjas)) {
      setEnviado(false);
      setMensaje("Horario no disponible");
      return;
    }

    // 4) Simulación de envío (seguirá validando conflictos/reservas)
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

  return { loading, enviado, mensaje, setMensaje, enviar };
}
