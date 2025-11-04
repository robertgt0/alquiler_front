"use client";

import { useEffect, useMemo, useRef } from "react";
import EtiquetaEstado from "../components/EtiquetaEstado";
import { SolicitudDetalle } from "../interfaces/Trabajo.interface";
import { useGestionSolicitud } from "../hooks/useGestionSolicitud";

// 🗓️ Formato de fecha literal (ej: Martes 25 de noviembre)
function formatearFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${dias[fecha.getUTCDay()]} ${fecha.getUTCDate()} de ${meses[fecha.getUTCMonth()]}`;
}

export default function DetalleSolicitudTrabajo({ data }: { data: SolicitudDetalle }) {
  // Hook SOLO front-end (no cambia estado real ni llama backend)
  const { loading, mensaje, setMensaje, simularConfirmar, simularRechazar } =
    useGestionSolicitud();

  // CA1: Botones habilitados solo si el estado es "Pendiente"
  const botonesHabilitados = useMemo(
    () => data.estado === "Pendiente" && !loading,
    [data.estado, loading]
  );

  // CA5: medir tiempo de carga de la vista "Trabajo"
  useEffect(() => {
    const t0 = performance.now();
    const id = requestAnimationFrame(() => {
      const elapsed = Math.round(performance.now() - t0);
      console.log(`[Métrica] Carga de "Trabajo": ${elapsed} ms`);
      if (elapsed > 1000) console.warn("⚠️ La vista 'Trabajo' tardó > 1s en cargar.");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // CA7: medir tiempo desde clic hasta fin de la acción de UI (simulada)
  const tAccionRef = useRef<number | null>(null);

  const handleConfirmar = async () => {
    if (!botonesHabilitados) return;
    setMensaje(null);
    tAccionRef.current = performance.now();
    await simularConfirmar();
    const dt = Math.round(performance.now() - (tAccionRef.current ?? 0));
    console.log(`[Métrica] Confirmar (UI) en ${dt} ms`);
    if (dt > 1000) console.warn("⚠️ Confirmar (UI) tardó > 1s.");
    tAccionRef.current = null;
  };

  const handleRechazar = async () => {
    if (!botonesHabilitados) return;
    setMensaje(null);
    tAccionRef.current = performance.now();
    await simularRechazar();
    const dt = Math.round(performance.now() - (tAccionRef.current ?? 0));
    console.log(`[Métrica] Rechazar (UI) en ${dt} ms`);
    if (dt > 1000) console.warn("⚠️ Rechazar (UI) tardó > 1s.");
    tAccionRef.current = null;
  };

  const volver = () => window.history.back(); // CA4

  return (
    <div className="w-full max-w-3xl mx-auto border border-white rounded-md p-8 sm:p-10 bg-white">
      {/* Título */}
      <h1 className="text-[#0C4FE9] Poppins text-4xl font-bold text-center mb-8">
        Trabajo
      </h1>

      {/* Campos visibles (CA12–CA17) */}
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
            {/* CA11: "Pendiente" en amarillo (lo maneja EtiquetaEstado) */}
            <EtiquetaEstado estado={data.estado} />
          </span>
        </div>
      </div>

      {/* Mensaje de acción (solo UI, centrado y con color por tipo) */}
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

      {/* Botones (colores CA8–CA10) */}
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
