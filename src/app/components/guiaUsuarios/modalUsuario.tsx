'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ModalGuiaUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalGuiaUsuario({ isOpen, onClose }: ModalGuiaUsuarioProps) {
  const [noMostrar, setNoMostrar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAceptar = () => {
    if (noMostrar) {
      localStorage.setItem('noMostrarGuia', 'true');
    }
    onClose();
    // Navegar a la sección de guía de usuarios
    router.push('/Homepage#gia-usuarios-nuevos');
  };

  const handleRechazar = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Fondo/Overlay oscuro semi-transparente */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      
      {/* Contenedor del Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        
        {/* El modal en sí con nuevos colores y tipografía */}
        <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-md w-full">
          
          {/* Contenido */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-center mb-4">
              ¡Bienvenido a Servineo!
            </h2>

            {/* Párrafo centrado */}
            <p className="text-gray-700 text-sm mb-6 text-center">
              ¿Te gustaría ver una guía rápida sobre cómo funciona nuestra plataforma? 
              Te ayudaremos a conocer todas las funcionalidades disponibles.
            </p>

            {/* Checkbox centrado */}
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

            {/* Botones con nuevos estilos */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRechazar}
                className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                Rechazar
              </button>
              <button
                onClick={handleAceptar}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
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