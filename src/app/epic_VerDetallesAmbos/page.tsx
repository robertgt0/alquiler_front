// src/app/epic_VerDetallesAmbos/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter ya no es estrictamente necesario para esta lógica, pero lo dejamos
import { RatingModal } from './RatingModal';

export default function VerDetallesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const API_URL = "http://localhost:5000/api/los_vengadores/trabajos/trabajo/69043b0b04115600c8f6fa65/calificar";

  // Eliminamos 'router' y 'redirectPath' si ya no se usan para redireccionar
  // const router = useRouter(); 
  // const redirectPath = '/epic_VisualizadorDeTrabajosAgendadosVistaCliente';

  // --- LÓGICA PARA LOS BOTONES DEL MODAL ---

  const handleAtrasClick = () => {
    setIsModalOpen(false);
  };

  const handleOmitirClick = () => {
    setIsModalOpen(false);
  };

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

  // --- RENDERIZADO DE LA PÁGINA ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-24">
      <h1 className="text-3xl font-bold mb-8">Detalles del Trabajo</h1>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <p>Contenido de los detalles del trabajo...</p>
      </div>

      <div className="flex gap-4">
        {/* Si quieres que este botón "Volver" regrese a la lista, 
          necesitarás 'useRouter' de nuevo. 
          Lo re-activaré por si acaso.
        */}
        <button
          onClick={() => {
             // Si descomentaste 'useRouter' arriba, esto funcionará
             // router.back(); 
             // O puedes forzarlo a ir a la lista:
             // router.push('/epic_VisualizadorDeTrabajosAgendadosVistaCliente');
             
             // Por ahora, solo usamos el historial del navegador:
             window.history.back();
          }}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold shadow hover:bg-gray-600 transition-colors"
        >
          Volver
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
        >
          Calificar Proveedor
        </button>
      </div>

      <RatingModal
        isOpen={isModalOpen}
        onCloseClick={handleAtrasClick}
        onOmitClick={handleOmitirClick}
        onSubmitClick={handleEnviarClick}
      />
    </main>
  );
}