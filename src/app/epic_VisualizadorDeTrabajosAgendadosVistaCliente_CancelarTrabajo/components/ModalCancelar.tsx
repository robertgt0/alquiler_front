import React from "react";
import { contarPalabras } from "../utils/validaciones";

interface ModalCancelarProps {
  abierto: boolean;
  justificacion: string;
  error: string;
  procesando: boolean;
  onJustificacionChange: (texto: string) => void;
  onCancelar: () => void;
  onCerrar: () => void;
}

const ModalCancelar: React.FC<ModalCancelarProps> = ({
  abierto,
  justificacion,
  error,
  procesando,
  onJustificacionChange,
  onCancelar,
  onCerrar,
}) => {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Cancelar Trabajo
        </h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Agregar justificación de cancelación...
          </label>
          <textarea
            value={justificacion}
            onChange={(e) => onJustificacionChange(e.target.value)}
            placeholder="Escriba aquí su justificación (mínimo 10 palabras, máximo 100 palabras)"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="text-sm text-gray-500 mt-1">
            Palabras: {contarPalabras(justificacion)} / 100
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={onCerrar}
            disabled={procesando}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
          >
            Regresar
          </button>

          <button
            onClick={onCancelar}
            disabled={procesando}
            className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors shadow-md disabled:opacity-50"
          >
            {procesando ? "Procesando..." : "Cancelar Trabajo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCancelar;