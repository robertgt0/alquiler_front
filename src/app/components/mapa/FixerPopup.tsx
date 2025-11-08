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
}

const FixerPopup: FC<{ fixer: Fixer }> = ({ fixer }) => {
  return (
    <div className="w-[220px] p-2">
      <h3 className="text-sm font-semibold text-blue-600 mb-1">{fixer.nombre}</h3>
      <p className="text-xs text-gray-600 bg-gray-100 rounded p-1 mb-1">
        🛠️ {fixer.especialidad}
      </p>
      <p className="text-[11px] text-gray-700 mb-2">
        {fixer.descripcion || "Especialista disponible"}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-green-600 text-xs">
          ⭐ {fixer.rating || 4.5}/5
        </span>
        {fixer.verified && (
          <span className="text-[10px] text-emerald-600 flex items-center gap-1">
            <FaCheck className="text-[10px]" /> Verificado
          </span>
        )}
      </div>
    </div>
  );
};

export default FixerPopup;