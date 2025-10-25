"use client";

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
import { enviarSolicitud, enviarSolicitudMock } from "../services/solicitudService";

// Tipos flexibles para normalizar la respuesta del backend/mock
type Status = "ok" | "unavailable" | "conflict" | "error";
type BackendResponse = {
  ok?: boolean;
  status?: Status | string;
  message?: string; // lo ignoraremos para priorizar copy del front
  raw?: unknown;
};

// Copys propios del front por estado
const COPY: Record<Status, string> = {
  ok: "Solicitud enviada con éxito",
  unavailable: "Horario no disponible",
  conflict: "Horario ya reservado",
  error: "No pudimos enviar la solicitud. Intenta nuevamente.",
};

export function useSolicitudTrabajo(
  franjas: IFranjaDisponible[],
  date: string,
  providerId: string
) {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const enviar = async (data: Pick<ISolicitud, "horaInicio" | "horaFin">) => {
    setMensaje("");
    setEnviado(false);

    const { horaInicio, horaFin } = data;

    // 0) Validaciones de presencia (con mensajes específicos)
    if (!horaInicio && !horaFin) {
      setMensaje("Debe seleccionar todos los campos para solicitar el trabajo");
      return;
    }
    if (!horaInicio) {
      setMensaje("Debe seleccionar una hora inicio para solicitar el trabajo");
      return;
    }
    if (!horaFin) {
      setMensaje("Debe seleccionar una hora fin para solicitar el trabajo");
      return;
    }

    // 1) Orden de horas
    if (toMinutes(horaFin) <= toMinutes(horaInicio)) {
      setMensaje("La hora fin debe ser mayor a la hora inicio.");
      return;
    }

    // 2) Validación puntual por franja para cada hora
    const inicioOk = isTimeInsideAnyFranja(horaInicio, franjas);
    const finOk = isTimeInsideAnyFranja(horaFin, franjas);

    if (!inicioOk && !finOk) {
      setMensaje("Horario no disponible");
      return;
    }
    if (!inicioOk) {
      setMensaje("Hora inicio no disponible");
      return;
    }
    if (!finOk) {
      setMensaje("Hora fin no disponible");
      return;
    }

    // 3) Validación de que TODO el rango cae en UNA franja
    if (!isInsideAnyFranja(horaInicio, horaFin, franjas)) {
      setMensaje("Horario no disponible");
      return;
    }

    // 4) Payload con el nuevo campo `date` (para backend)
    const payload: ISolicitud = {
      date,
      horaInicio,
      horaFin,
    };

    setLoading(true);
    try {
      // Intento contra el backend real
      const resp = (await enviarSolicitud(payload)) as BackendResponse | void;

      // Normalizamos un status para decidir el copy del frontend
      const status: Status =
        (resp?.status as Status) ??
        (resp && resp.ok === false ? "error" : "ok");

      setEnviado(status === "ok");
      setMensaje(COPY[status]); // 💡 priorizamos SIEMPRE el mensaje del front
    } catch {
      // Fallback al mock si el backend falla
      try {
        const mock = await enviarSolicitudMock(date, providerId, payload, franjas);
        const status: Status =
          (mock.status as Status) ?? (mock.ok ? "ok" : "error");

        setEnviado(mock.ok);
        setMensaje(COPY[status]); // 💡 también priorizamos el copy del front aquí
      } catch {
        setEnviado(false);
        setMensaje(COPY.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, enviado, mensaje, setMensaje, enviar };
}
