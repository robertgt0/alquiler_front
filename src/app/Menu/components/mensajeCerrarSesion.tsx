import React from "react";
import ExitoMensaje from "../assets/iconos8-exito-50png.jpg";


interface MensajeCerrarSesionProps {
  message?: string;
  onClose?: () => void; // opcional si luego quieres cerrarlo con un clic
}

export const MensajeCerrarSesion:React.FC<MensajeCerrarSesionProps> = ({
  onClose,
}) => {
  return (
    // Fondo translúcido que cubre toda la pantalla
    <div
className="fixed inset-0 bg-white/90 backdrop-blur-[1px] flex items-center justify-center z-50"
      onClick={onClose} // permite cerrar al hacer clic fuera (opcional)
    >
      {/* Contenedor del mensaje */}
      <div className="bg-white/90 rounded-3xl border border-gray-300 shadow-lg px-6 py-6 flex flex-col items-center max-w-sm w-full mx-4 animate-fade-in">
        <img
          src={ExitoMensaje.src}
          alt="Error correo"
          className="w-16 h-16 mb-3"
        />
       <p className="text-center text-gray-800 text-sm sm:text-base font-bold">
          <span className= "block">Cierre de sesion exitoso</span>
          
        </p>
      </div>
    </div>
  );
};