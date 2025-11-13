// components/FixersHeader.tsx

export default function FixersHeader() {
  return (
    <div className="bg-[#f0f7ff] rounded-lg p-4 my-2 w-full max-w-6xl mx-auto flex flex-col gap-2">

      {/* Título con la tipografía del carrusel */}
      <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#2a87ff]">
        FIXERS Cerca de ti
      </h2>

      {/* Párrafo con la tipografía del carrusel */}
      <p className="text-gray-700 text-sm sm:text-base md:text-lg">
        Encuentra FIXERS disponibles en Cochabamba. Haz clic en los marcadores para contactarlos.
      </p>
    </div>
  );
}
