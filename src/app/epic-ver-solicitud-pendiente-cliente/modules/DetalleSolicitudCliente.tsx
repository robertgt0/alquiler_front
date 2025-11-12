"use client";

import { useEffect } from "react";
import EtiquetaEstado from "../components/EtiquetaEstado";
import { SolicitudClienteDetalle } from "../interfaces/SolicitudCliente.interface";

// ✅ Usa fecha local (sin desfase UTC)
function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return "Fecha no disponible";

  const [year, month, day] = fechaISO.split("-").map(Number);
  const fecha = new Date(year, month - 1, day);

  const dias = [
    "Domingo", "Lunes", "Martes", "Miércoles",
    "Jueves", "Viernes", "Sábado"
  ];
  const meses = [
    "enero", "febrero", "marzo", "abril",
    "mayo", "junio", "julio", "agosto",
    "septiembre", "octubre", "noviembre", "diciembre"
  ];

  return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
}

export default function DetalleSolicitudCliente({ data }: { data: SolicitudClienteDetalle }) {
  // ⏱️ Métrica de carga (< 2s)
  useEffect(() => {
    const t0 = performance.now();
    const id = requestAnimationFrame(() => {
      const elapsed = Math.round(performance.now() - t0);
      console.log(`[Métrica] Carga de "Trabajo (cliente)": ${elapsed} ms`);
      if (elapsed > 2000) console.warn("⚠️ La vista tardó > 2s en cargar.");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const volver = () => window.history.back();

  return (
    <div
      className="
        w-full max-w-3xl mx-auto 
        bg-white
        p-6 sm:p-8 md:p-10 
        rounded-none border-none shadow-none
      "
    >
      <h1 className="text-[#0C4FE9] Poppins text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">
        Trabajo
      </h1>

      <div className="text-[17px] sm:text-[19px] leading-8 Poppins">
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-3 gap-x-4 sm:gap-x-6">
          <span className="font-bold">Proveedor:</span>
          <span>{data.proveedor}</span>

          <span className="font-bold">Fecha:</span>
          <span>{formatearFecha(data.fechaISO)}</span>

          <span className="font-bold">Horario:</span>
          <span>{data.horaInicio} - {data.horaFin}</span>

          <span className="font-bold">Descripción:</span>
          <span>{data.descripcion}</span>

          <span className="font-bold">Costo:</span>
          <span>{data.costo} Bs</span>

          <span className="font-bold">Estado:</span>
          <span><EtiquetaEstado estado={data.estado} /></span>
        </div>
      </div>

      <div className="mt-8 flex justify-start">
        <button
          type="button"
          onClick={volver}
          className="h-12 w-32 sm:w-36 rounded-lg bg-[#0C4FE9] text-white Poppins text-[16px] sm:text-[17px] font-semibold
                     transition-all duration-150 hover:brightness-110 hover:-translate-y-px
                     focus:outline-none focus:ring-2 focus:ring-[#0C4FE9]/40"
        >
          Atrás
        </button>
      </div>
    </div>
  );
}
