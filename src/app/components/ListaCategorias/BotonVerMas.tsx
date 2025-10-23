"use client";

interface BotonVerMasProps {
  onClick?: () => void;
}

export default function BotonVerMas({ onClick }: BotonVerMasProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      {/* 🔘 Botón mejorado (mantiene tu funcionalidad) */}
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md 
                   transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:ring-offset-2 active:scale-95"
        aria-label="Ver más categorías"
      >
        <span className="text-lg">+</span>
        <span>Ver más categorías</span>
      </button>
    </div>
  );
}
