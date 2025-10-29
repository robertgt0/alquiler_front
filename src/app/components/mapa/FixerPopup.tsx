// components/PopupFixer.tsx
"use client";
import { FC } from "react";
import { FaStar, FaCheck } from "react-icons/fa";

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
  const backupImage = "/imagenes_respaldo/perfil-default.jpg";
  const imageUrl = fixer.imagenPerfil || backupImage;

  return (
    <div className="w-[220px] p-2">
      {/* Imagen de perfil */}
      <div className="flex justify-center mb-2">
        <img 
          src={imageUrl}
          alt={`Perfil de ${fixer.nombre}`}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
          onError={(e) => {
            e.currentTarget.src = backupImage;
          }}
        />
      </div>

      {/* ✅ Título actualizado */}
      <h3 className="text-sm sm:text-base font-bold text-[#2a87ff] mb-1">
        {fixer.nombre}
      </h3>

      {/* ✅ Especialidad actualizada */}
      <p className="text-xs sm:text-sm text-gray-700 bg-gray-100 rounded p-1 mb-1">
        🛠️ {fixer.especialidad}
      </p>

      {/* ✅ Descripción actualizada */}
      <p className="text-xs sm:text-sm text-gray-700 mb-2">
        {fixer.descripcion || "Especialista disponible"}
      </p>

      <div className="flex justify-between items-center">
        {/* ✅ Rating actualizado */}
        <span className="text-green-600 text-xs sm:text-sm">
          ⭐ {fixer.rating || 4.5}/5
        </span>
        
        {/* ✅ Verificado actualizado */}
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