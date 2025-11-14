// components/BotonesAccion.tsx
"use client"; // NUEVO: Necesario para useState y onClick

import React, { useState } from "react"; // NUEVO: importamos useState
// NUEVO: Importa tu modal (ajusta la ruta si es necesario)
import { RatingModal } from './RatingModal'; 

interface BotonesAccionProps {
  trabajoId: string; 
  estadoTrabajo: "Confirmado" | "Cancelado";
  onAtras: () => void;
  onCancelar: () => void;
  onTerminado: () => void; // Esta función se llamará DESPUÉS del modal
}

const BotonesAccion: React.FC<BotonesAccionProps> = ({
  trabajoId,
  estadoTrabajo,
  onAtras,
  onCancelar,
  onTerminado, // Esta es la función original del padre
}) => {
  const deshabilitado = estadoTrabajo === "Cancelado";

  // --- NUEVO: LÓGICA DEL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cierra el modal (sin terminar el trabajo)
  const handleAtrasClick = () => {
    setIsModalOpen(false);
  };

  // Omite la calificación, PERO SÍ TERMINA EL TRABAJO
  const handleOmitirClick = () => {
    onTerminado(); // Llama a la función original del padre
    setIsModalOpen(false);
  };

  // Envía la calificación Y LUEGO TERMINA EL TRABAJO
   
  const API_URL = `http://localhost:5000/api/los_vengadores/trabajos/trabajo/${trabajoId}/calificar`;

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
  // --- FIN LÓGICA DEL MODAL ---


  return (
    // NUEVO: Usamos un Fragment (<>) para envolver los botones y el modal
    <> 
      <div className="flex gap-4 justify-center">
        <button
          onClick={onAtras}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Atrás
        </button>

        <button
          onClick={onCancelar}
          disabled={deshabilitado}
          className={`px-8 py-3 font-bold rounded-lg transition-colors shadow-md ${
            deshabilitado
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Cancelar Trabajo
        </button>

        <button
          // MODIFICADO: Ahora abre el modal
          onClick={() => setIsModalOpen(true)}
          disabled={deshabilitado}
          className={`px-8 py-3 font-bold rounded-lg transition-colors shadow-md ${
            deshabilitado
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Trabajo Terminado
        </button>
      </div>

      {/* NUEVO: El modal se renderiza aquí y se conecta a los handlers */}
      <RatingModal
        isOpen={isModalOpen}
        onCloseClick={handleAtrasClick}
        onOmitClick={handleOmitirClick}
        onSubmitClick={handleEnviarClick}
      />
    </>
  );
};

export default BotonesAccion;