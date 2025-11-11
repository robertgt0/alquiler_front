"use client";

import { useEffect, useMemo, useRef } from "react";
import EtiquetaEstado from "../components/EtiquetaEstado";
import { SolicitudDetalle } from "../interfaces/Trabajo.interface";
import { useGestionSolicitud } from "../hooks/useGestionSolicitud";

/* -------------------------------------------------------------------------- */
/* ✅ CORRECCIÓN: interpretar fecha como LOCAL (sin desfase de día)           */
/* -------------------------------------------------------------------------- */
function formatearFecha(fechaISO: string): string {
  // Si la fecha viene como "YYYY-MM-DD", la descomponemos
  const partes = fechaISO.split("-");
  const fecha = new Date(
    Number(partes[0]), // año
    Number(partes[1]) - 1, // mes (base 0)
    Number(partes[2]) // día
  );

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

  return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
}

/* -------------------------------------------------------------------------- */
/* 🔹 COMPONENTE PRINCIPAL                                                    */
/* -------------------------------------------------------------------------- */
export default function DetalleSolicitudTrabajo({
  data,
}: {
  data: SolicitudDetalle;
}) {
  const { loading, mensaje, setMensaje, confirmarTrabajo, rechazarTrabajo } =
    useGestionSolicitud();

  const botonesHabilitados = useMemo(
    () => data.estado === "Pendiente" && !loading,
    [data.estado, loading]
  );

  // Medir tiempo de carga
  useEffect(() => {
    const t0 = performance.now();
    const id = requestAnimationFrame(() => {
      const elapsed = Math.round(performance.now() - t0);
      console.log(`[Métrica] Carga de "Trabajo": ${elapsed} ms`);
      if (elapsed > 1000)
        console.warn("⚠️ La vista 'Trabajo' tardó > 1s en cargar.");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const tAccionRef = useRef<number | null>(null);

  const handleConfirmar = async () => {
    if (!botonesHabilitados) return;
    setMensaje(null);
    tAccionRef.current = performance.now();
    await confirmarTrabajo(data.id);
    const dt = Math.round(performance.now() - (tAccionRef.current ?? 0));
    console.log(`[Métrica] Confirmar (API) en ${dt} ms`);
    if (dt > 1000) console.warn("⚠️ Confirmar (API) tardó > 1s.");
    tAccionRef.current = null;
  };

  const handleRechazar = async () => {
    if (!botonesHabilitados) return;
    setMensaje(null);
    tAccionRef.current = performance.now();
    await rechazarTrabajo(data.id);
    const dt = Math.round(performance.now() - (tAccionRef.current ?? 0));
    console.log(`[Métrica] Rechazar (API) en ${dt} ms`);
    if (dt > 1000) console.warn("⚠️ Rechazar (API) tardó > 1s.");
    tAccionRef.current = null;
  };

  const volver = () => window.history.back();

  return (
    <div className="w-full max-w-3xl mx-auto border border-white rounded-md p-8 sm:p-10 bg-white">
      {/* Título */}
      <h1 className="text-[#0C4FE9] Poppins text-4xl font-bold text-center mb-8">
        Trabajo
      </h1>

      {/* Campos visibles */}
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
          className={`mt-6 w-full text-center text-[17px] font-medium Poppins rounded-md px-5 py-3 border ${
            mensaje.tipo === "confirmar"
              ? "bg-[#DFFFE3] border-[#3DD45E] text-[#0E5B1C]"
              : "bg-[#FFE3E3] border-[#FF4D4D] text-[#A10000]"
          }`}
          role="status"
          aria-live="polite"
        >
          {mensaje.texto}
        </div>
      )}

      {/* Botones */}
      <div className="mt-9 flex items-center justify-between">
        <button
          type="button"
          onClick={volver}
          className="h-12 w-36 rounded-lg bg-[#0C4FE9] hover:brightness-110 text-white Poppins text-[17px] font-semibold"
        >
          Atrás
        </button>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleRechazar}
            disabled={!botonesHabilitados}
            className="h-12 w-40 rounded-lg bg-[#E5E5E5] text-black Poppins text-[17px] font-semibold disabled:opacity-60"
          >
            {loading === "rechazar" ? "Rechazando…" : "Rechazar"}
          </button>

          <button
            type="button"
            onClick={handleConfirmar}
            disabled={!botonesHabilitados}
            className="h-12 w-40 rounded-lg bg-[#0C4FE9] hover:brightness-110 text-white Poppins text-[17px] font-semibold disabled:opacity-60"
          >
            {loading === "confirmar" ? "Confirmando…" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
