// src/app/components/guiaUsuarios/modalUsuario.tsx

'use client';

import { useState, useEffect } from 'react';

interface ModalGuiaUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void; // CAMBIO: Prop para manejar el scroll
}

export default function ModalGuiaUsuario({ isOpen, onClose, onAccept }: ModalGuiaUsuarioProps) {
  const [noMostrar, setNoMostrar] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleAceptar = () => {
    if (noMostrar) {
      localStorage.setItem('guiaVista', 'true');
    }
    onAccept(); // Llama a la función de scroll del padre
    onClose();
  };

  const handleRechazar = () => {
     if (noMostrar) {
      localStorage.setItem('guiaVista', 'true');
    }
    onClose();
  };

  if (true) return null; // Deshabilita el modal de guía de usuario
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              ¡Bienvenido a Servineo!
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              ¿Te gustaría ver una guía rápida sobre cómo funciona nuestra plataforma?
            </p>
            <div className="flex items-center justify-center mb-6">
              <input
                type="checkbox"
                id="noMostrar"
                checked={noMostrar}
                onChange={(e) => setNoMostrar(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="noMostrar" className="ms-2 text-sm text-gray-600">
                No volver a mostrar
              </label>
            </div>
            <div className="flex gap-3 justify-center">
              {/* CAMBIO: Botón con estilo de "Iniciar Sesión" (bordeado) */}
              <button
                onClick={handleRechazar}
                className="px-6 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 
                           font-semibold text-sm 
                           transform transition-transform duration-300 ease-in-out hover:scale-105"
              >
                Rechazar
              </button>
              {/* CAMBIO: Botón con estilo de "Registrarse" (sólido) */}
              <button
                onClick={handleAceptar}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           font-semibold text-sm shadow-md
                           transform transition-transform duration-300 ease-in-out hover:scale-105"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}