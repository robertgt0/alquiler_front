// src/app/epic_VerDetallesAmbos/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RatingModal } from './RatingModal';

export default function VerDetallesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  
  // Destino de la redirección
  const redirectPath = '/epic_VisualizadorDeTrabajosAgendadosVistaCliente';

  // --- LÓGICA PARA LOS BOTONES DEL MODAL ---

  /**
   * 1. Botón "Atrás": Solo cierra el modal.
   */
  const handleAtrasClick = () => {
    setIsModalOpen(false);
  };

  /**
   * 2. Botón "Omitir": Cierra el modal y redirige.
   */
  const handleOmitirClick = () => {
    setIsModalOpen(false);
    router.push(redirectPath);
  };

  /**
   * 3. Botón "Enviar": Envía datos al backend, luego cierra y redirige.
   */
  const handleEnviarClick = async (rating: number, comment: string) => {
    console.log('Enviando al backend:', { rating, comment });

    // --- INICIO: LÓGICA DE BACKEND (COMENTADA) ---
    /*
    try {
      const response = await fetch('/api/proveedor/calificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // providerId: 'proveedor_123',
          // jobId: 'trabajo_456',
          rating: rating,
          comment: comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la calificación');
      }

      const result = await response.json();
      console.log('Respuesta del backend:', result);
      alert('¡Gracias por tu calificación!');

    } catch (error) {
      console.error('Error en handleEnviarClick:', error);
      alert('No se pudo enviar tu calificación. Inténtalo de nuevo.');
      throw error; 
    }
    */
    // --- FIN: LÓGICA DE BACKEND ---

    // Simulación
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Calificación enviada (simulación)');

    // --- ÉXITO: Cerrar y redirigir ---
    setIsModalOpen(false);
    router.push(redirectPath);
  };

  // --- RENDERIZADO DE LA PÁGINA ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-24">
      <h1 className="text-3xl font-bold mb-8">Detalles del Trabajo</h1>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <p>Contenido de los detalles del trabajo...</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
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

      {/* --- ESTA ES LA PARTE CORREGIDA --- */}
      <RatingModal
        isOpen={isModalOpen}
        onCloseClick={handleAtrasClick}
        onOmitClick={handleOmitirClick}
        onSubmitClick={handleEnviarClick}
      />
    </main>
  );
}