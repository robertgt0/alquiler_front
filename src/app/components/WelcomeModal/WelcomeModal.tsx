import React, { useEffect, useRef } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  dontShowAgain: boolean;
  onDontShowAgainChange: (checked: boolean) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
  dontShowAgain,
  onDontShowAgainChange,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const modalNode = modalRef.current;
    if (!modalNode) return;

    const focusableElements = modalNode.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // No hay lógica para la tecla 'Esc', por lo que no cerrará el modal.
      if (e.key !== 'Tab') return;

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    modalNode.addEventListener('keydown', handleKeyDown);

    return () => {
      modalNode.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    // El div de fondo no tiene un onClick, por lo que no se cierra al hacer clic fuera.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // Previene que clics internos se propaguen al fondo
      >
        <h2 id="welcome-title" className="text-2xl font-bold text-center text-gray-800 mb-4">
          ¡Bienvenido a Servineo!
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Queremos asegurarnos de que aproveches al máximo nuestra plataforma. ¿Te gustaría que te guiemos a través de las funciones principales?
        </p>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={onAccept}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Aceptar
          </button>
          <button
            onClick={onDecline}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Rechazar
          </button>
        </div>

        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            id="dont-show-again"
            checked={dontShowAgain}
            onChange={(e) => onDontShowAgainChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="dont-show-again" className="ml-2 text-sm text-gray-600">
            No volver a mostrar
          </label>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
