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
    // MEJORA 1: Fondo borroso y semi-transparente
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      
      {/* MEJORA 2: Nuevo color de fondo y de texto del modal */}
      <div className="relative w-full max-w-2xl p-6 bg-[#eef7ff] rounded-lg shadow-xl mx-4 text-[#13378b]">
        
        {/* Encabezado del Modal */}
        <div className="flex items-start justify-between pb-4 border-b border-[#b9ddff]">
          <h3 className="text-xl font-semibold text-[#11255a]">{title}</h3>
          
          {/* Botón de cierre "X" con colores actualizados */}
          <button
            onClick={onClose}
            className="text-[#13378b] bg-transparent hover:bg-[#b9ddff] hover:text-[#11255a] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <IoClose size={24} />
          </button>
        </div>
        
        {/* Contenido del Modal */}
        <div className="pt-4 space-y-4 text-base">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;