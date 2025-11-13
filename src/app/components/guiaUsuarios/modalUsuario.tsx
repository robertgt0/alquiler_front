// src/app/components/guiaUsuarios/modalUsuario.tsx

'use client';
import { useState, useEffect } from 'react';

interface ModalGuiaUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function ModalGuiaUsuario({ isOpen, onClose, onAccept }: ModalGuiaUsuarioProps) {
  const [noMostrar, setNoMostrar] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const noMostrarGuardado = localStorage.getItem('noMostrarGuiaUsuario');
      if (noMostrarGuardado === 'true') {
        onClose();
      }
    }
  }, [isOpen, onClose]);

  const handleAceptar = () => {
    if (noMostrar) {
      localStorage.setItem('noMostrarGuiaUsuario', 'true');
    }
    onAccept();
  };

  const handleRechazar = () => {
    if (noMostrar) {
      localStorage.setItem('noMostrarGuiaUsuario', 'true');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
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
                // CAMBIO: Colores adaptados a la paleta azul de Servineo.
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="noMostrar" className="ms-2 text-sm text-gray-600">
                No volver a mostrar
              </label>
            </div>
            <div className="flex gap-3 justify-center">
              {/* CAMBIO: Botón secundario. */}
              <button
                onClick={handleRechazar}
                className="px-6 py-2 bg-transparent text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 
                           font-semibold text-sm 
                           transform transition-transform duration-300 ease-in-out hover:scale-105"
              >
                Rechazar
              </button>
              {/* CAMBIO: Botón primario. */}
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