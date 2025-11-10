// src/app/componentes/reutilizables/Modal.tsx

"use client";

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
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Guardar el elemento enfocado antes de abrir para restaurarlo luego
      previouslyFocused.current = document.activeElement;
      // Focar el botón de cerrar cuando se abre
      if (closeBtnRef.current) closeBtnRef.current.focus();
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      // Restaurar foco al elemento previo si existe
      if (previouslyFocused.current instanceof HTMLElement) {
        (previouslyFocused.current as HTMLElement).focus();
      }
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

  // Cerrar con Escape y evitar que la tecla Escape se propague fuera
  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    // si el click fue fuera del contenido del modal, cerrar
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      aria-hidden={isOpen ? 'false' : 'true'}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-2xl bg-[#eef7ff] rounded-lg shadow-xl text-[#13378b]"
      >
        <div className="max-h-[90vh] overflow-hidden rounded-lg">
          <div className="flex items-start justify-between p-6 pb-4 border-b border-[#b9ddff]">
            <h3 id="modal-title" className="text-xl font-semibold text-[#11255a] font-heading">{title}</h3>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label="Cerrar modal"
              className="text-[#13378b] bg-transparent hover:bg-[#b9ddff] hover:text-[#11255a] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <IoClose size={24} />
            </button>
          </div>
          <div className="p-6 overflow-auto text-base max-h-[70vh] space-y-4 font-heading">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;