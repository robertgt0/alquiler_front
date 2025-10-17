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
  // Valores iniciales por defecto
  const [horaInicio, setHoraInicio] = useState("00:00");
  const [horaFin, setHoraFin] = useState("00:00");

  const { loading, mensaje, setMensaje, enviar } = useSolicitudTrabajo(
    franjas,
    date,
    providerId
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await enviar({ horaInicio, horaFin });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
      <TimeInput
        label="Hora Inicio"
        value={horaInicio}
        onChange={(e) => {
          setHoraInicio(e.target.value);
          setHoraFin("00:00"); // Resetear hora fin al cambiar inicio
          if (mensaje) setMensaje("");
        }}
        step={1800}
        disabled={loading}
      />

      <TimeInput
        label="Hora Fin"
        value={horaFin}
        onChange={(e) => {
          setHoraFin(e.target.value);
          if (mensaje) setMensaje("");
        }}
        step={1800}
        disabled={loading || !horaInicio}
      />

      {/* Botón principal */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0C4FE9] hover:bg-blue-700 text-white Poppins rounded-lg mt-1 sm:mt-2 h-12 sm:h-11 disabled:opacity-70"
      >
        {loading ? "Enviando…" : "Enviar solicitud"}
      </button>

      {/* Botón Atrás */}
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
          className="w-full text-center rounded-lg border border-gray-200 bg-gray-50 
                     text-gray-600 text-sm px-4 py-3 mt-2 Poppins"
        >
          {mensaje}
        </div>
      )}
    </form>
  );
}
