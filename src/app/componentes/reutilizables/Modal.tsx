// src/app/componentes/reutilizables/Modal.tsx

import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
    // Bloquear scroll del fondo
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    // Limpieza al desmontar
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Focus trap: solo permite tabular dentro del modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div ref={modalRef} className="relative w-full max-w-2xl bg-[#eef7ff] rounded-lg shadow-xl text-[#13378b] font-inter">
        <div className="max-h-[90vh] overflow-hidden rounded-lg">
          <div className="flex items-start justify-between p-6 pb-4 border-b border-[#b9ddff]">
            <h3 className="text-xl font-semibold text-[#11255a]" style={{ fontFamily: 'Poppins, Anton, Roboto, sans-serif' }}>{title}</h3>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label="Cerrar modal"
              className="text-[#13378b] bg-transparent hover:bg-[#b9ddff] hover:text-[#11255a] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <IoClose size={24} />
            </button>
          </div>
          <div className="p-6 overflow-auto text-base max-h-[70vh] space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;