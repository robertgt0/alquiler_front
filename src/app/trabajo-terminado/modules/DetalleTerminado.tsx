"use client";
import React from "react";
import { useRouter } from "next/navigation";
import type { TrabajoTerminado } from "../interfaces/Trabajo.interface";
import { formatFechaLargaES } from "../utils/date";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function DetalleTerminado({ trabajo }: { trabajo: TrabajoTerminado }) {
  const router = useRouter();

  // 1) Formato de fecha "jueves 20 de noviembre" (sin coma)
  const fechaLarga = formatFechaLargaES(trabajo.fecha).replace(",", "");

  // 2) Calificación: aseguramos que sea número o null
  const raw = trabajo.calificacion as unknown;
  const calificacion = raw === null || raw === undefined ? null : Number(raw);
  const tieneCalificacion = Number.isFinite(calificacion);

  // 3) MAPA DE ESTADOS → color de fondo + color de texto + etiqueta a mostrar
  //    Si tu BD entrega "estado" en mayúsculas/minúsculas distinto,
  //    más abajo normalizamos a "Terminado/Cancelado/Confirmado/Pendiente".
  const estadoMap = {
    Terminado:  { bg: "bg-[#31C950]", text: "text-black",  label: "Terminado"  }, // verde
    Cancelado:  { bg: "bg-[#E84141]", text: "text-white",  label: "Cancelado"  }, // rojo
    Confirmado: { bg: "bg-[#0C4FE9]", text: "text-white",  label: "Confirmado" }, // azul 
    Pendiente:  { bg: "bg-[#F0D92B]", text: "text-black",  label: "Pendiente"  }, // amarillo
  } as const;

  // 4) Normalizamos el "estado" recibido por si viene en minúsculas/variante
  const estadoNormalizado = (() => {
    const v = String(trabajo.estado || "").toLowerCase();
    if (v === "terminado" || v === "completado")  return "Terminado";
    if (v === "cancelado")  return "Cancelado";
    if (v === "confirmado") return "Confirmado";
    if (v === "pendiente")  return "Pendiente";
    return "Pendiente"; // fallback
  })() as keyof typeof estadoMap;

  // 5) Obtenemos la configuración (colores/texto) del estado actual
  const badge = estadoMap[estadoNormalizado];

  return (
    /**
     * CONTENEDOR DE LA VISTA
     * - min-h-screen: ocupa alto de ventana
     * - items-start + pt-26: empuja el contenido hacia arriba (ajusta el pt-26 si lo quieres aún más pegado)
     *   Por ejemplo: pt-16 / pt-20 / pt-24 / pt-26
     */
    <section className={`${poppins.className} min-h-screen flex items-start justify-center bg-white pt-26`}>
      {/* CONTENEDOR CENTRAL */}
      <div className="w-full max-w-[760px] px-6 text-gray-900 text-[16px]">

        {/* TÍTULO */}
        <h1 className="text-center text-3xl font-extrabold text-[#0C4FE9] mb-7">
          Trabajo
        </h1>

        {/**
         * TABLA “ETIQUETA : VALOR”
         * - grid-cols-[140px_1fr]: columna izquierda fija 140px, derecha flexible
         * - ml-[100px]: empuja el bloque hacia adentro (ajústalo a tu gusto)
         * - gap-y/gap-x: separaciones entre filas/columnas
         */}
        <div className="w-fit ml-[100px] grid grid-cols-[140px_1fr] gap-y-1/2 gap-x-1/2 text-[18px]">
          <span className="font-bold text-black">Cliente:</span>
          <span>{trabajo.cliente}</span>

          <span className="font-bold text-black">Proveedor:</span>
          <span>{trabajo.proveedor}</span>

          <span className="font-bold text-black">Fecha:</span>
          <span>{fechaLarga}</span>

          <span className="font-bold text-black">Horario:</span>
          <span>{trabajo.horario}</span>

          <span className="font-bold text-black">Descripción:</span>
          <span>{trabajo.descripcion}</span>

          <span className="font-bold text-black">Costo:</span>
          <span>{trabajo.costo} Bs</span>

          <span className="font-bold text-black">Estado:</span>
          <span>
            {/**
             * BADGE DINÁMICO
             * - color y texto cambian según el estado normalizado
             * - px/py: tamaño del “chip”
             */}
            <span className={`inline-block ${badge.bg} ${badge.text} px-4 py-1 rounded-md font-semibold`}>
              {badge.label}
            </span>
          </span>
        </div>

        {/* BOTONES */}
        <div className="flex justify-center gap-16 mt-8">
          {/* Atrás */}
          <button
            type="button"
            onClick={() => router.back()}
            className="min-w-[180px] bg-[#0C4FE9] hover:bg-blue-700 text-white font-semibold rounded-lg py-1 px-7 transition duration-200 ease-in-out translate-x-[-115px] cursor-pointer active:scale-95"
          >
            Atrás
          </button>

          {/* Ver mi calificación
             - Si deseas que SOLO aparezca cuando estado === "Terminado",
               reemplaza la condición por: (tieneCalificacion && estadoNormalizado === "Terminado") */}
          <button
            type="button"
            onClick={() => {
              if (tieneCalificacion) alert(`Tu calificación fue ${calificacion} ★`);
              else alert("Este trabajo aún no tiene calificación.");
            }}
            className="min-w-[180px] bg-[#0C4FE9] hover:bg-blue-700 text-white font-semibold rounded-lg py-1 px-7 transition duration-200 ease-in-out translate-x-[80px] cursor-pointer active:scale-95"
          >
            Ver mi calificación
          </button>
        </div>

      </div>
    </section>
  );
}
