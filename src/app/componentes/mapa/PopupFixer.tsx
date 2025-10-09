// components/UbicacionIcon.tsx

"use client";
import { FC } from "react";
import { FaStar, FaCheck, FaWhatsapp } from "react-icons/fa";

interface Fixer {
  name: string;
  verified?: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  specialties: string[];
  whatsapp: string;
}

interface FixerCardProps {
  fixer: Fixer;
}

const getWhatsAppLink = (phone: string) => {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
};

const FixerCard: FC<FixerCardProps> = ({ fixer }) => {
  const initials = fixer.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-w-[250px] font-sans bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-[#1366fd] flex items-center justify-center text-white font-bold text-lg">
          {initials}
        </div>

        <div>
          <div className="font-semibold text-base text-[#11255a] flex items-center gap-1">
            {fixer.name}
            {fixer.verified && (
              <FaCheck className="text-[#1366fd]" title="Verificado" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
            <FaStar className="text-yellow-400" />
            <span>
              {fixer.rating} ({fixer.reviewCount} reseñas)
            </span>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-gray-500 text-sm mb-2">{fixer.description}</p>

      {/* Especialidades */}
      <div className="flex flex-wrap gap-2 my-3">
        {fixer.specialties.map((specialty, index) => (
          <span
            key={index}
            className="bg-[#eef7ff] text-[#1366fd] px-3 py-1 rounded-full text-xs font-medium"
          >
            {specialty}
          </span>
        ))}
      </div>

      {/* Botón de WhatsApp */}
      <button
        onClick={() => window.open(getWhatsAppLink(fixer.whatsapp), "_blank")}
        className="w-full bg-[#25d366] text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 text-sm hover:bg-[#1ebe5a] transition"
      >
        <FaWhatsapp size={16} />
        Contactar por WhatsApp
      </button>
    </div>
  );
};

export default FixerCard;


