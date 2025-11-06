'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface MessageSeguridadProps {
  redireccion?: string; // ruta a donde redirige al marcar el checkbox
  onClose?: () => void; // función para cerrar el mensaje si se hace clic fuera
}

export const MessageSeguridad: React.FC<MessageSeguridadProps> = ({
  redireccion = "/SeguridadQr",
  onClose,
}) => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const isChecked = e.target.checked;
  setChecked(isChecked);

  if (isChecked) {
    // Guardamos una marca temporal para mostrar el check en login
    sessionStorage.setItem("checkSeguridad", "true");

    // Cierra el mensaje
    onClose?.();

    // Redirige después de un pequeño retraso
    setTimeout(() => {
      router.push(redireccion);
    }, 200);
  }
};


  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

     return (
    <div
      className="fixed inset-0 bg-white/90 backdrop-blur-[2px] flex items-center justify-center z-50 px-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-3xl border border-gray-300 shadow-xl w-full max-w-md p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        {/* Mensaje */}
        <p className="text-gray-900 font-medium text-sm sm:text-base leading-relaxed text-left">
          <span className="font-semibold block mb-1">Autentificación multifactor</span>
          Requiere un desafío de seguridad adicional al iniciar sesión. Si no
          puedes pasar este desafío, tendrás la opción de recuperar tu cuenta por
          correo electrónico.
        </p>

        {/* Checkbox */}
        <div className="flex items-start space-x-2 w-full sm:w-auto">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            className="mt-1 w-5 h-5 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};


