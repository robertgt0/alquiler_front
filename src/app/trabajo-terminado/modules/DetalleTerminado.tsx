"use client";
import React from "react";
import { useRouter } from "next/navigation";
import type { TrabajoTerminado } from "../interfaces/Trabajo.interface";
import { formatFechaLargaES } from "../utils/date";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});


export default function DetalleTerminado({ trabajo }: { trabajo: TrabajoTerminado }) {
  const router = useRouter();

  // ✅ Fecha en formato largo (ej: jueves 20 de noviembre)
  const fechaLarga = formatFechaLargaES(trabajo.fecha).replace(",", "");
  // ✅ Convierte la calificación a número y verifica si existe
  const raw = trabajo.calificacion as unknown;
  const calificacion = raw === null || raw === undefined ? null : Number(raw);
  const tieneCalificacion = Number.isFinite(calificacion);

  return (
    // 🔹 PANTALLA COMPLETA CENTRADA (como en tu 2da imagen)
    // - min-h-screen: ocupar toda la altura del viewport
    // - flex + items-center + justify-center: centro exacto vertical/horizontal
    // - bg-white: fondo blanco (cámbialo si usas tema)
    // - font-[Poppins]: fuente de toda la vista (puedes cambiarla aquí)
    <section className={`${poppins.className} min-h-screen flex items-center justify-center bg-white`}>

      {/* 🔹 CONTENEDOR CENTRAL
          - w-full: usa todo el ancho disponible
          - max-w-[760px]: ancho de lectura (ajústalo: 680/820/900…)
          - px-6: margen lateral “de página”
          - text-gray-900 / text-[16px]: tipografía base */}
      <div className="w-full max-w-[760px] px-6 text-gray-900 text-[16px]">

        {/* 🔹 TÍTULO */}
        {/* - text-center: centrado
            - text-4xl: tamaño del título (sube a text-5xl si lo quieres más grande)
            - font-extrabold: grosor
            - text-[#0C4FE9]: color corporativo
            - mb-6: separación inferior */}
        <h1 className="text-center text-3xl font-extrabold text-[#0C4FE9] mb-7">
          Trabajo
        </h1>

        {/* 🔹 DATOS EN 2 COLUMNAS (etiquetas a la izquierda, valores a la derecha)
            - grid-cols-[140px_1fr]: izquierda fija (edítalo a 120/160px), derecha flexible
            - gap-y-3: separación vertical entre filas (edítalo: 2/3/4…)
            - gap-x-8: separación horizontal entre columnas (edítalo: 6/8/10…)
            - text-[18px]: tamaño general del contenido */}
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
            {/* 🟩 BADGE DEL ESTADO
               - bg-[#31C950]: fondo del badge (verde)
               - text-black: color del texto
               - px-4 py-1: tamaño del badge (sube/baja para más alto/bajo)
               - rounded-md: bordes redondeados
               - font-semibold: grosor del texto */}
            <span className="inline-block bg-[#31C950] text-black px-4 py-1/2 rounded-md font-semibold">
              Terminado
            </span>
          </span>
        </div>

        {/* 🔹 BOTONES CENTRADOS DEBAJO (exacto como la 2da imagen)
            - flex + justify-center: centra el grupo de botones
            - gap-8: espacio entre botones (ajústalo: 6/8/10/12…)
            - mt-6: separación respecto a los datos */}
        <div className="flex justify-center gap-16 mt-8">

          {/* 🔵 Botón “Atrás”
              - px controla el largo, py la altura
              - min-w evita que se achique demasiado
              - rounded-lg: radios (prueba rounded-md/xl) */}
          <button
            type="button"
            onClick={() => router.back()}
            className="min-w-[180px] bg-[#0C4FE9] hover:bg-blue-700 text-white font-semibold rounded-lg py-1 px-7 transition duration-200 ease-in-out translate-x-[-115px] cursor-pointer active:scale-95"
            // 💬 Cambia aquí: color (bg/hover), alto (py), ancho (px), borde (rounded)
          >
            Atrás
          </button>

          {/* 🔵 Botón “Ver mi calificación” (solo si existe calificación) */}
            <button
              type="button"
              onClick={() => {
              if (tieneCalificacion)
                alert(`Tu calificación fue ${calificacion} ★`);
              else
                alert("Este trabajo aún no tiene calificación.");
            }}
              className="min-w-[180px] bg-[#0C4FE9] hover:bg-blue-700 text-white font-semibold rounded-lg py-1 px-7 transition duration-200 ease-in-out translate-x-[80px] cursor-pointer active:scale-95"
              // 💬 Ajusta min-w/px si el texto es más largo o más corto
            >
              Ver mi calificación
            </button>
        </div>

      </div>
    </section>
  );
}
