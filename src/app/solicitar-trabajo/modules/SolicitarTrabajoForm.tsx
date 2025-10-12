"use client";

import { useState } from "react";
import TimeInput from "../components/TimeInput";
import ConfirmacionLabel from "../components/ConfirmacionLabel";
import { enviarSolicitud } from "../services/solicitudService";

export default function SolicitarTrabajoForm() {
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("12:00");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await enviarSolicitud({ horaInicio, horaFin });
      setEnviado(true);
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TimeInput
        label="Hora Inicio"
        value={horaInicio}
        onChange={(e) => setHoraInicio(e.target.value)}
      />

      <TimeInput
        label="Hora Fin"
        value={horaFin}
        onChange={(e) => setHoraFin(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-[#0C4FE9] hover:bg-blue-700 text-white Poppins py-2 rounded-lg mt-2"
      >
        Solicitar trabajo
      </button>

      {enviado && <ConfirmacionLabel />}
    </form>
  );
}
