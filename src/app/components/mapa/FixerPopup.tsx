/* eslint-disable @next/next/no-img-element */
// components/FixerPopup.tsx
"use client";
import { FC } from "react";
import { FaCheck } from "react-icons/fa";

export interface Fixer {
  _id: string;
  nombre: string;
  posicion: { lat: number; lng: number };
  especialidad: string;
  descripcion?: string;
  rating?: number;
  verified?: boolean;
  whatsapp?: string;
  imagenPerfil?: string;
}

const FixerPopup: FC<{ fixer: Fixer }> = ({ fixer }) => {
  const tieneWhatsapp = fixer.whatsapp && fixer.whatsapp.trim() !== '';

  const handleWhatsappClick = () => {
    if (!tieneWhatsapp) return;
    
    const numeroLimpio = fixer.whatsapp!.replace(/[^\d]/g, '');
    const mensaje = `Hola ${fixer.nombre}, vi tu perfil en FixItNow y me interesa tus servicios de ${fixer.especialidad}`;
    const url = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="w-[220px] p-2">
      <div className="flex justify-center mb-2">
        <img 
          src={fixer.imagenPerfil}
          alt={`Perfil de ${fixer.nombre}`}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
          onError={(e) => {
            e.currentTarget.src = "/imagenes_respaldo/perfil-default.jpg";
          }}
        />
      </div>

      <h3 className="text-sm sm:text-base font-bold text-[#2a87ff] mb-1">
        {fixer.nombre}
      </h3>

      <p className="text-xs sm:text-sm text-gray-700 bg-gray-100 rounded p-1 mb-1">
        🛠️ {fixer.especialidad}
      </p>

      <p className="text-xs sm:text-sm text-gray-700 mb-2">
        {fixer.descripcion || "Especialista disponible"}
      </p>

      <div className="flex justify-between items-center mb-2">
        <span className="text-green-600 text-xs sm:text-sm">
          ⭐ {fixer.rating || 4.5}/5
        </span>
        {fixer.verified && (
          <span className="text-xs sm:text-sm text-emerald-600 flex items-center gap-1">
            <FaCheck className="text-xs" /> Verificado
          </span>
        )}
      </div>

      {/* Botón WhatsApp - SOLO ESTA PARTE NUEVA */}
      {/* Botón WhatsApp - versión mejorada */}
      <button
        onClick={handleWhatsappClick}
        disabled={!tieneWhatsapp}
        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
          tieneWhatsapp
            ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer shadow-md"
            : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
        }`}
      >
        <span>📱</span>
        {tieneWhatsapp ? "Contactar por WhatsApp" : "Sin contacto"}
      </button>
    </div>
  );
};

export default FixerPopup;