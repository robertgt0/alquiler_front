'use client';
import React from "react";

interface CerrarSesionesProps {
  onContinue?: () => void;
  onCancel?: () => void;
}

export const CerrarSesiones: React.FC<CerrarSesionesProps> = ({
  onContinue,
  onCancel,
}) => {
  return (
    // Fondo translúcido que cubre toda la pantalla
    <div className="fixed inset-0 bg-white/90 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
      {/* Contenedor del mensaje */}
      <div className="bg-white rounded-3xl border border-gray-300 shadow-xl w-full max-w-md p-6 flex flex-col items-center text-center animate-fade-in">
        {/* Mensaje principal */}
        <p className="text-gray-900 font-semibold text-base sm:text-lg mb-6 leading-relaxed">
          Esta acción cerrará tu sesión
          <br />
          en todos los dispositivos excepto este.
        </p>

        {/* Botones responsivos del mismo tamaño */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Botón Continuar */}
          <button
            type="button"
            onClick={() => onContinue?.()}
            className="flex-1 bg-blue-500 text-white py-2 rounded-2xl hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          >
            Continuar
          </button>

          {/* Botón Cancelar */}
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="flex-1 bg-blue-500 text-white py-2 rounded-2xl hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};