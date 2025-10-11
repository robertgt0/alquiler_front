"use client";

import { FC } from "react";
import { FaStar, FaCheck, FaWhatsapp } from "react-icons/fa";

export interface Fixer {
  _id: string;
  nombre: string;
  posicion: {
    lat: number;
    lng: number;
  };
  especialidad: string;
  descripcion?: string;
  rating?: number;
  whatsapp?: string;
  verified?: boolean;
}

interface FixerCardProps {
  fixer: Fixer;
}

const getWhatsAppLink = (phone?: string) => {
  if (!phone) return "#";
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
};

const FixerCard: FC<FixerCardProps> = ({ fixer }) => {
  const initials = fixer.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-w-[250px] max-w-sm bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition duration-200 font-sans">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          {initials}
        </div>

        {/* Información principal */}
        <div className="flex flex-col">
          <div className="font-semibold text-base text-slate-900 flex items-center gap-1">
            {fixer.nombre}
            {fixer.verified && (
              <FaCheck className="text-blue-600" title="Verificado" />
            )}
          </div>

          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
            <FaStar className="text-yellow-400" />
            <span>
              {fixer.rating ? fixer.rating.toFixed(1) : "4.5"} / 5
            </span>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-2 leading-snug">
        {fixer.descripcion || "Especialista disponible para ayudarte."}
      </p>

      {/* Especialidad */}
      {fixer.especialidad && (
        <div className="flex flex-wrap gap-2 my-3">
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
            {fixer.especialidad}
          </span>
        </div>
      )}

      {/* Botón de WhatsApp */}
      {fixer.whatsapp ? (
        <button
          onClick={() => window.open(getWhatsAppLink(fixer.whatsapp), "_blank")}
          className="w-full bg-green-500 text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 text-sm hover:bg-green-600 active:scale-[0.98] transition"
        >
          <FaWhatsapp size={16} />
          Contactar por WhatsApp
        </button>
      ) : (
        <div className="w-full bg-gray-200 text-gray-600 font-semibold rounded-lg py-3 flex items-center justify-center text-sm cursor-not-allowed">
          Sin número disponible
        </div>
      )}
    </div>
  );
};

export default FixerCard;



