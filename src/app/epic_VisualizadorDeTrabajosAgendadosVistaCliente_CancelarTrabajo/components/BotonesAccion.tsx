import React from "react";

interface BotonesAccionProps {
  estadoTrabajo: "Confirmado" | "Cancelado";
  onAtras: () => void;
  onCancelar: () => void;
  onTerminado: () => void;
}

const BotonesAccion: React.FC<BotonesAccionProps> = ({
  estadoTrabajo,
  onAtras,
  onCancelar,
  onTerminado,
}) => {
  const deshabilitado = estadoTrabajo === "Cancelado";

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={onAtras}
        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        Atrás
      </button>

      <button
        onClick={onCancelar}
        disabled={deshabilitado}
        className={`px-8 py-3 font-bold rounded-lg transition-colors shadow-md ${
          deshabilitado
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        Cancelar Trabajo
      </button>

      <button
        onClick={onTerminado}
        disabled={deshabilitado}
        className={`px-8 py-3 font-bold rounded-lg transition-colors shadow-md ${
          deshabilitado
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Trabajo Terminado
      </button>
    </div>
  );
};

export default BotonesAccion;