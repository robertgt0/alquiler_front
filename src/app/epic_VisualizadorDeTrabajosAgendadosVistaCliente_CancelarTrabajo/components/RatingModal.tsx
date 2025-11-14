// src/app/epic_VerDetallesAmbos/components/RatingModal.tsx
'use client';

import { useState } from 'react';
import { StarIcon } from './Staricon';

const MAX_COMMENT_LENGTH = 500;

interface RatingModalProps {
  isOpen: boolean;
  onCloseClick: () => void;
  onOmitClick: () => void;
  onSubmitClick: (rating: number, comment: string) => Promise<void>;
}

export function RatingModal({
  isOpen,
  onCloseClick,
  onOmitClick,
  onSubmitClick,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return; // seguridad
    setIsSubmitting(true);

    try {
      await onSubmitClick(rating, comment); // <-- usamos la función que viene por props
      setRating(0);
      setHoverRating(0);
      setComment('');
      setCommentError('');
    } catch (error: any) {
      console.error("Error en handleSubmit:", error.message || error);
      alert("Hubo un error al guardar la calificación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = (closeFn: () => void) => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setCommentError('');
    closeFn();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-blue-700 text-center mb-2">
          ¡GRACIAS POR USAR LA APP!
        </h2>

        <p className="text-gray-900 mb-4">
          ¿Como fue tu experiencia con el proveedor?
        </p>

        <div className="flex justify-start gap-2 mb-4">
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

        <textarea
          id="comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (e.target.value.length <= MAX_COMMENT_LENGTH && commentError) {
              setCommentError('');
            }
          }}
          placeholder="Escribe tu comentario aquí..."
          className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          disabled={isSubmitting}
          aria-describedby="comment-helper"
        />

        <div id="comment-helper" className="flex justify-between items-center mt-1 text-sm">
          <span className="text-red-600 font-medium">{commentError}</span>
          <span className={comment.length > MAX_COMMENT_LENGTH ? 'text-red-600 font-bold' : 'text-gray-500'}>
            {comment.length} / {MAX_COMMENT_LENGTH}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-6">
          <button
            type="button"
            onClick={() => handleResetAndClose(onCloseClick)}
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto"
          >
            Atrás
          </button>

          <button
            type="button"
            onClick={() => handleResetAndClose(onOmitClick)}
            disabled={isSubmitting}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 font-bold w-full sm:w-auto"
          >
            Omitir
          </button>

          <button
            type="button"
            onClick={handleSubmit} // <-- usamos la función adaptada
            disabled={rating === 0 || isSubmitting}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}