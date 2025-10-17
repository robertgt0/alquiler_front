"use client";

import { ReactNode } from "react";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalWrapper({ isOpen, onClose, children }: ModalWrapperProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
