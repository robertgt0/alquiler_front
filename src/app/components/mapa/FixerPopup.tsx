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

      <div className="flex justify-between items-center">
        <span className="text-green-600 text-xs sm:text-sm">
          ⭐ {fixer.rating || 4.5}/5
        </span>
        {fixer.verified && (
          <span className="text-xs sm:text-sm text-emerald-600 flex items-center gap-1">
            <FaCheck className="text-xs" /> Verificado
          </span>
        )}
      </div>
    </div>
  );
};

export default FixerPopup;