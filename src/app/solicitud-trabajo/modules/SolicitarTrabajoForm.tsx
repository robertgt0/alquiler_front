"use client";

import { useState } from "react";
import TimeInput from "../components/CampoHora";
import { useSolicitudTrabajo } from "../hooks/useSolicitudTrabajo";
import { IFranjaDisponible } from "../interfaces/Solicitud.interface";

type Props = {
  franjas: IFranjaDisponible[];
  date: string;
  providerId: string;
};

export default function SolicitarTrabajoForm({ franjas, date, providerId }: Props) {
  const [horaInicio, setHoraInicio] = useState(""); // "" = sin seleccionar
  const [horaFin, setHoraFin] = useState("");

  // Errores por campo (mensajes personalizados)
  const [errorInicio, setErrorInicio] = useState("");
  const [errorFin, setErrorFin] = useState("");

  const { loading, mensaje, setMensaje, enviar } = useSolicitudTrabajo(
    franjas,
    date,
    providerId
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // limpiar errores previos
    setErrorInicio("");
    setErrorFin("");

    // Validaciones personalizadas
    if (!horaInicio) {
      setErrorInicio("Debe seleccionar una hora inicio para solicitar el trabajo");
      return;
    }
    if (!horaFin) {
      setErrorFin("Debe seleccionar una hora fin para solicitar el trabajo");
      return;
    }

    await enviar({ horaInicio, horaFin });
  };

  // Estilos dinámicos del mensaje inferior según su contenido
  const getMessageStyles = () => {
    if (!mensaje) return "";
    const msg = mensaje.toLowerCase();

    // Éxito
    if (msg.includes("enviada") || msg.includes("confirmada") || msg.includes("éxito")) {
      return "border-green-300 bg-green-100 text-green-800";
    }
    // Error
    if (msg.includes("no disponible") || msg.includes("reservado") || msg.includes("error")) {
      return "border-red-300 bg-red-100 text-red-700";
    }
    // Advertencia
    if (msg.includes("debe seleccionar") || msg.includes("selecciona")) {
      return "border-yellow-300 bg-yellow-100 text-yellow-800";
    }
    // Neutro
    return "border-gray-300 bg-gray-50 text-gray-600";
  };

  return (
    // noValidate desactiva la validación nativa del navegador
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
      {/* Hora Inicio */}
      <div className="flex flex-col">
        <TimeInput
          label="Hora Inicio"
          value={horaInicio}
          onChange={(e) => {
            setHoraInicio(e.target.value);
            setHoraFin("");
            setErrorInicio("");
            setErrorFin("");
            if (mensaje) setMensaje("");
          }}
          step={1800}
          disabled={loading}
        />
        {errorInicio && (
          <p className="text-red-500 text-sm mt-1 text-center">{errorInicio}</p>
        )}
      </div>

      {/* Hora Fin */}
      <div className="flex flex-col">
        <TimeInput
          label="Hora Fin"
          value={horaFin}
          onChange={(e) => {
            setHoraFin(e.target.value);
            setErrorFin("");
            setErrorInicio("");
            if (mensaje) setMensaje("");
          }}
          step={1800}
          disabled={loading}
        />
        {errorFin && (
          <p className="text-red-500 text-sm mt-1 text-center">{errorFin}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0C4FE9] hover:bg-blue-700 text-white Poppins rounded-lg mt-1 sm:mt-2 h-12 sm:h-11 disabled:opacity-70"
      >
        {loading ? "Enviando…" : "Enviar solicitud"}
      </button>

      <button
        type="button"
        onClick={() => window.history.back()}
        className="w-full bg-[#0C4FE9] hover:bg-blue-700 text-white Poppins rounded-lg h-12 sm:h-11"
        aria-label="Volver a la página anterior"
      >
        Atrás
      </button>

      {!!mensaje && (
        <div
          className={`w-full text-center rounded-lg border text-sm px-4 py-3 mt-2 Poppins font-medium ${getMessageStyles()}`}
        >
          {mensaje}
        </div>
      )}
    </form>
  );
}
