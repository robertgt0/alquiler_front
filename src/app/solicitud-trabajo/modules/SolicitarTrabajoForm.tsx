"use client";

import { useState } from "react";
import TimeInput from "../components/CampoHora";
import { useSolicitudTrabajo } from "../hooks/useSolicitudTrabajo";

export default function SolicitarTrabajoForm() {
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const { loading, mensaje, enviar } = useSolicitudTrabajo();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await enviar({ horaInicio, horaFin });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
      <TimeInput
        label="Hora Inicio"
        value={horaInicio}
        onChange={(e) => { setHoraInicio(e.target.value); setHoraFin(""); }}
        step={1800}
        disabled={loading}
      />

      <TimeInput
        label="Hora Fin"
        value={horaFin}
        onChange={(e) => setHoraFin(e.target.value)}
        step={1800}
        disabled={loading || !horaInicio}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0C4FE9] hover:bg-blue-700 text-white Poppins rounded-lg mt-1 sm:mt-2 h-12 sm:h-11 disabled:opacity-70"
      >
        {loading ? "Enviando…" : "Solicitar trabajo"}
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
