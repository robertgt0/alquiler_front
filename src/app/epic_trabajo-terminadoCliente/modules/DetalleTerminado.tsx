// app/epic_trabajo-terminadoCliente/modules/DetalleTerminado.tsx
"use client";
import React, { useState } from "react"; // 👈 NUEVO: importamos useState
import { useRouter, useSearchParams } from "next/navigation";
import type { TrabajoTerminado } from "../interfaces/Trabajo.interface";
import { formatFechaLargaES } from "../utils/date";
import { Poppins } from "next/font/google";

// NUEVO: Importa tu modal.
// (Ajusta la ruta si es necesario, ej: "../components/RatingModal")
import { RatingModal } from "./RatingModal"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function DetalleTerminado({ trabajo }: { trabajo: TrabajoTerminado }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 👇 role según desde dónde se hizo click (tag del URL)
  const role = (searchParams.get("role") ?? "cliente") as "cliente" | "proveedor";

  // NUEVO: Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1) Formato de fecha "jueves 20 de noviembre" (sin coma)
  const fechaLarga = formatFechaLargaES(trabajo.fecha).replace(",", "");

  // 2) Calificación: aseguramos que sea número o null
  const raw = trabajo.calificacion as unknown;
  const calificacion = raw === null || raw === undefined ? null : Number(raw);
  const tieneCalificacion = Number.isFinite(calificacion);

  // 3) MAPA DE ESTADOS
  const estadoMap = {
    Terminado:  { bg: "bg-[#31C950]", text: "text-black",  label: "Terminado"  },
    Cancelado:  { bg: "bg-[#E84141]", text: "text-white",  label: "Cancelado"  },
    Confirmado: { bg: "bg-[#0C4FE9]", text: "text-white",  label: "Confirmado" },
    Pendiente:  { bg: "bg-[#F0D92B]", text: "text-black",  label: "Pendiente"  },
  } as const;

  // 4) Normalización de estado
  const estadoNormalizado = (() => {
    const v = String(trabajo.estado || "").toLowerCase();
    if (v === "terminado" || v === "completado")  return "Terminado";
    if (v === "cancelado")  return "Cancelado";
    if (v === "confirmado" || v === "comfirmado") return "Confirmado";
    if (v === "pendiente")  return "Pendiente";
    return "Pendiente";
  })() as keyof typeof estadoMap;

  // 5) Config del badge
  const badge = estadoMap[estadoNormalizado];

  // 👇 Persona mostrada según el rol
  const labelPersona = role === "cliente" ? "Proveedor" : "Cliente";
  const nombrePersona = role === "cliente" ? trabajo.proveedor : trabajo.cliente;

  // --- NUEVO: LÓGICA PARA LOS BOTONES DEL MODAL ---
  // (Copiada de tu segundo código)

  const handleAtrasClick = () => {
    setIsModalOpen(false);
  };

  const handleOmitirClick = () => {
    setIsModalOpen(false);
  };
  
  const API_URL = `http://localhost:5000/api/los_vengadores/trabajos/trabajo/${trabajo.id}/calificar`;

  const handleEnviarClick = async (rating: number, comment: string) => {
    console.log("Datos a enviar:", { rating, comment });
  
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero_estrellas: rating, comentario_calificacion: comment }),
      });
  
      let data: any;
      try {
        data = await response.json();
      } catch {
        data = {}; // fallback si la respuesta no tiene JSON
      }
  
      if (!response.ok) {
        console.error("Error del backend:", response.status, data);
        throw new Error(data.message || data.error || "Error al enviar calificación");
      }
  
      console.log("Respuesta exitosa:", data);
      alert("Calificación enviada con éxito");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error en handleEnviarClick:", error.message || error);
      alert("Error al enviar la calificación. Revisa la consola.");
    }
  };


  // --- RENDERIZADO ---
  // (Se mantiene idéntico, solo cambia el onClick del botón)

  return (
    <section
      className={`
        ${poppins.className}
        min-h-screen
        flex
        items-start
        justify-center
        bg-white
        pt-10
        sm:pt-16
        md:pt-20
      `}
    >
      {/* CONTENEDOR CENTRAL */}
      <div className="w-full max-w-[760px] px-4 sm:px-6 text-gray-900 text-[15px] sm:text-[16px]">
        {/* TÍTULO */}
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-[#0C4FE9] mb-7">
          Trabajo
        </h1>

        {/* TABLA “ETIQUETA : VALOR” */}
        <div
          className="
            w-full
            sm:w-fit
            mx-auto
            sm:ml-[100px]
            grid
            grid-cols-1
            sm:grid-cols-[140px_1fr]
            gap-y-2
            sm:gap-y-1.5
            sm:gap-x-4
            text-[16px]
            sm:text-[18px]
          "
        >
          {}
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
            <span
              className={`
                inline-block
                ${badge.bg}
                ${badge.text}
                px-4
                py-1
                rounded-md
                font-semibold
                text-sm
                sm:text-base
              `}
            >
              {badge.label}
            </span>
          </span>
        </div>

        {/* BOTONES */}
        <div
          className="
            flex
            flex-col
            items-center
            gap-3
            sm:flex-row
            sm:justify-center
            sm:gap-[300px]
            mt-8
          "
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="
              w-full
              sm:w-auto
              min-w-[180px]
              bg-[#0C4FE9]
              hover:bg-blue-700
              text-white
              font-semibold
              rounded-lg
              py-2
              px-7
              transition
              duration-200
              ease-in-out
              cursor-pointer
              active:scale-95
            "
          >
            Atrás
          </button>

          <button
            type="button"
            // 👇 MODIFICADO: Abre el modal en lugar de navegar
            onClick={() => setIsModalOpen(true)}
            className="
              w-full
              sm:w-auto
              min-w-[180px]
              bg-[#0C4FE9]
              hover:bg-blue-700
              text-white
              font-semibold
              rounded-lg
              py-2
              px-7
              transition
              duration-200
              ease-in-out
              cursor-pointer
              active:scale-95
            "
          >
            Calificar Proveedor
          </button>
        </div>
      </div>

      {/* NUEVO: El modal se renderiza aquí */}
      <RatingModal
        isOpen={isModalOpen}
        onCloseClick={handleAtrasClick}
        onOmitClick={handleOmitirClick}
        onSubmitClick={handleEnviarClick}
      />
    </section>
  );
}