"use client";

import EtiquetaEstado from "../components/EtiquetaEstado";
import { SolicitudClienteDetalle } from "../interfaces/SolicitudCliente.interface";

// 🗓️ “Jueves 25 de noviembre”
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
  return `${dias[fecha.getUTCDay()]} ${fecha.getUTCDate()} de ${
    meses[fecha.getUTCMonth()]
  }`;
}

export default function DetalleSolicitudCliente({
  data,
}: {
  data: SolicitudClienteDetalle;
}) {
  return (
    <div className="w-full max-w-3xl mx-auto border border-white rounded-md p-8 sm:p-10 bg-white">
      <h1 className="text-[#0C4FE9] Poppins text-4xl font-bold text-center mb-8">
        Trabajo
      </h1>

      <div className="text-[19px] leading-8 Poppins">
        <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-6">
          <span className="font-bold">Proveedor:</span>
          <span className="font-normal">{data.proveedor}</span>

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

      {/* 🔹 Botón Atrás alineado a la izquierda */}
      <div className="mt-9 flex justify-start">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="h-12 w-36 rounded-lg bg-[#0C4FE9] hover:brightness-110 text-white Poppins text-[17px] font-semibold"
        >
          Atrás
        </button>
      </div>
    </div>
  );
}
