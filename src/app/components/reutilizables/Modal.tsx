// src/app/componentes/reutilizables/Modal.tsx

import React from 'react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Fondo borroso y semi-transparente; permitir scroll en el overlay si el modal excede la ventana
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">

      {/* Panel del modal con max-height para permitir scroll interno */}
  <div className="relative w-full max-w-2xl bg-[#eef7ff] rounded-lg shadow-xl text-[#13378b]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        {/* Limitar la altura total del panel y permitir scroll interno */}
        <div className="max-h-[90vh] overflow-hidden rounded-lg">

          {/* Encabezado del Modal */}
          <div className="flex items-start justify-between p-6 pb-4 border-b border-[#b9ddff]">
            <h3 className="text-xl font-semibold text-[#11255a]">{title}</h3>

            {/* Botón de cierre "X" con colores actualizados */}
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="text-[#13378b] bg-transparent hover:bg-[#b9ddff] hover:text-[#11255a] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Contenido del Modal: permitir scroll si es largo */}
          <div className="p-6 overflow-auto text-base max-h-[70vh] space-y-4">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;