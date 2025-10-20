import React from "react";
import EmailErrorIcon from "../assets/icons8-error-50.png"; // Ajusta la ruta


interface EmailExistsMessageProps {
  message?: string;
  onClose?: () => void; // opcional si luego quieres cerrarlo con un clic
}

export const EmailExistsMessage: React.FC<EmailExistsMessageProps> = ({
  onClose,
}) => {
  return (
    // Fondo translúcido que cubre toda la pantalla
    <div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose} // permite cerrar al hacer clic fuera (opcional)
    >
      {/* Contenedor del mensaje */}
      <div className="bg-white/90 border border-gray-400 rounded-3xl shadow-lg px-6 py-6 flex flex-col items-center max-w-sm w-full mx-4 animate-fade-in">
        <img
          src={EmailErrorIcon.src}
          alt="Error correo"
          className="w-16 h-16 mb-3"
        />
       <p className="text-center text-gray-800 text-sm sm:text-base font-bold">
          <span className= "block">Ya existe una cuenta asociada</span>
           <span className= "block">a este correo electronico</span>
        </p>
      </div>
    </div>
  );
};

