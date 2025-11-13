import React from "react";



interface MensajeCerrarSesionProps {
  message?: string;
  onContinue?: () => void;
  onCancel?: () => void; // opcional si luego quieres cerrarlo con un clic
}

export const MensajeCerrarSesion:React.FC<MensajeCerrarSesionProps> = ({
  onContinue,
  onCancel,
}) => {
  return (
    // Fondo translúcido que cubre toda la pantalla
    <div
className="fixed inset-0 bg-white/90 backdrop-blur-[1px] flex items-center justify-center z-50"
     // onClick={onCancel} // permite cerrar al hacer clic fuera (opcional)
    >
      {/* Contenedor del mensaje */}
      <div className="bg-white/90 rounded-3xl border border-gray-300 shadow-lg px-6 py-6 flex flex-col items-center max-w-sm w-full mx-4 animate-fade-in">
        
       <p className="text-center text-gray-800 text-sm sm:text-base font-bold">
          <span className= "block">¿Deseas cerrar sesion actual?</span>
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