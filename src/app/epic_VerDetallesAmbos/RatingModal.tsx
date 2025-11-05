// src/app/epic_VerDetallesAmbos/components/RatingModal.tsx
'use client';

import { useState } from 'react';
import { StarIcon } from './StarIcon';

// Props que el modal aceptará (MODIFICADAS)
interface RatingModalProps {
  isOpen: boolean;
  onCloseClick: () => void; // Para el botón "Atrás"
  onOmitClick: () => void;  // Para el botón "Omitir"
  onSubmitClick: (rating: number, comment: string) => Promise<void>; // Para "Enviar"
}

export function RatingModal({
  isOpen,
  onCloseClick,
  onOmitClick,
  onSubmitClick,
}: RatingModalProps) {
  // Estados internos del modal
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Por favor, selecciona una calificación.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Llama a la función prop que se encarga de la lógica de envío Y redirección
      await onSubmitClick(rating, comment);
      
      // Resetea los estados internos
      setRating(0);
      setHoverRating(0);
      setComment('');

    } catch (error) {
      // El error (ej. 'Error al enviar') se maneja en la página padre
      // El padre decide si cerrar el modal o mostrar un error
      console.error('Error reportado al modal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para resetear estados al cerrar (Atrás) u Omitir
  const handleResetAndClose = (closeFn: () => void) => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    closeFn(); // Llama a la función prop correspondiente
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        
        {/* --- Título, Estrellas y Comentario (Sin cambios) --- */}
        <h2 className="text-xl font-bold text-blue-700 text-center mb-2">
          ¡GRACIAS POR USAR LA APP!
        </h2>
        <p className="text-gray-700 text-center mb-4">
          ¿Como fue tu experiencia con el proveedor?
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isFilled = starValue <= (hoverRating || rating);
            return (
              <button
                key={starValue}
                type="button"
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starValue)}
                className="transition-transform duration-150 ease-in-out hover:scale-110"
              >
                <StarIcon filled={isFilled} />
              </button>
            );
          })}
        </div>

        <label htmlFor="comment" className="text-gray-600 text-sm mb-2 block">
          Cuéntanos más sobre tu experiencia (Opcional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe tu comentario aquí..."
          className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {/* --- Fin de Título, Estrellas y Comentario --- */}


        {/* Botones de acción (MODIFICADOS) */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => handleResetAndClose(onCloseClick)} // Llama a onCloseClick
            disabled={isSubmitting}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={() => handleResetAndClose(onOmitClick)} // Llama a onOmitClick
            disabled={isSubmitting}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Omitir
          </button>
          <button
            type="button"
            onClick={handleSubmit} // Llama al handleSubmit interno
            disabled={rating === 0 || isSubmitting}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}