// components/FixersHeader.tsx
export default function FixersHeader() {
  return (
    <div className="bg-[#f0f7ff] rounded-lg p-4 my-1 w-full max-w-6xl mx-auto">

      {/* Título - Misma tipografía que carrusel */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#2a87ff]">
          FIXERS Cerca de ti
        </h2>
      </div>

      {/* Párrafo - Misma tipografía que carrusel */}
      <p className="text-gray-700 text-sm sm:text-base md:text-lg mt-2">
        Encuentra FIXERS disponibles en Cochabamba. Haz clic en los marcadores para contactarlos.
      </p>
    </div>
  );
}