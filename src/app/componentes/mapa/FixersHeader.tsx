// components/FixersHeader.tsx

import { FaMapMarkerAlt } from "react-icons/fa";

export default function FixersHeader() {
  return (
    <div className="bg-[#f0f7ff] rounded-lg p-1 my-1 flex flex-col sm:flex-row sm:items-center sm:gap-4">

      {/* Ícono */}
      <div className="flex items-center gap-2">
        <FaMapMarkerAlt className="text-[#1366fd] text-2xl" />
        <h2 className="text-xl font-bold text-[#0d1b3d]">
          FIXERS Cerca de ti
        </h2>
      </div>

      {/* Texto */}
      <p className="text-[#1366fd] text-sm sm:text-base mt-2 sm:mt-0">
        Encuentra FIXERS disponibles en Cochabamba. Haz clic en los marcadores para contactarlos.
      </p>
    </div>
  );
}