"use client";

interface BotonVerMasProps {
  onClick?: () => void;
}

export default function BotonVerMas({ onClick }: BotonVerMasProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      {/* Botón circular clickeable */}
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-blue-500 text-blue-600 
                   hover:bg-blue-50 active:scale-95 transition focus:outline-none"
        aria-label="Ver más categorías"
      >
        +
      </button>

      {/* Texto informativo (NO clickeable) */}
      <span className="mt-2 text-blue-600 text-sm select-none">
        Ver más categorías
      </span>
    </div>
  );
}
