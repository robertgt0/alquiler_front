"use client";

import EtiquetaEstado from "../components/EtiquetaEstado";
import { SolicitudDetalle } from "../interfaces/Trabajo.interface";
import { useGestionSolicitud } from "../hooks/useGestionSolicitud";

// Formato de fecha literal (ej: Jueves 25 de noviembre)
function formatearFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const diaSemana = dias[fecha.getUTCDay()];
  const diaMes = fecha.getUTCDate();
  const mes = meses[fecha.getUTCMonth()];
  return `${diaSemana} ${diaMes} de ${mes}`;
}

export default function DetalleSolicitudTrabajo({ data }: { data: SolicitudDetalle }) {
  const { loading, mensaje, onConfirmar, onRechazar } = useGestionSolicitud(data.id);

  return (
    <div className="w-full max-w-3xl mx-auto border border-white rounded-md p-8 sm:p-10 bg-white">
      {/* 🔹 Título */}
      <h1 className="text-[#0C4FE9] Poppins text-4xl font-bold text-center mb-8">
        Trabajo
      </h1>

      {/* 🔹 Contenido principal */}
      <div className="text-[19px] leading-8 Poppins">
        <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-6">
          <span className="font-bold">Cliente:</span>
          <span className="font-normal">{data.cliente}</span>

          <span className="font-bold">Fecha:</span>
          <span className="font-normal">{formatearFecha(data.fechaISO)}</span>

          <span className="font-bold">Horario:</span>
          <span className="font-normal">
            {data.horaInicio} - {data.horaFin}
          </span>

          <span className="font-bold">Descripción:</span>
          <span className="font-normal">{data.descripcion}</span>

          <span className="font-bold">Costo:</span>
          <span className="font-normal">{data.costo} Bs</span>

          <span className="font-bold">Estado:</span>
          <span>
            <EtiquetaEstado estado={data.estado} />
          </span>
        </div>
      </div>

      {/* Mensaje de acción */}
      {mensaje && (
        <div
          className="mt-6 rounded-md border px-5 py-3 text-base Poppins bg-gray-50 text-gray-700"
          role="status"
          aria-live="polite"
        >
          {mensaje}
        </div>
      )}

      {/* 🧭 Botones */}
      <div className="mt-9 flex items-center justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="h-12 w-36 rounded-lg bg-[#0C4FE9] hover:brightness-110 text-white Poppins text-[17px] font-semibold"
        >
          Atrás
        </button>

        <div className="flex gap-4">
          <button
            type="button"
            disabled={loading === "rechazar"}
            onClick={onRechazar}
            className="h-12 w-40 rounded-lg bg-[#E5E5E5] text-black Poppins text-[17px] font-semibold disabled:opacity-70"
          >
            {loading === "rechazar" ? "Rechazando…" : "Rechazar"}
          </button>

          <button
            type="button"
            disabled={loading === "confirmar"}
            onClick={onConfirmar}
            className="h-12 w-40 rounded-lg bg-[#0C4FE9] hover:brightness-110 text-white Poppins text-[17px] font-semibold disabled:opacity-70"
          >
            {loading === "confirmar" ? "Confirmando…" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
