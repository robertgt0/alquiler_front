export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Avatar centrado arriba */}
      <div className="flex justify-center mb-8">
        <div className="h-36 w-36 rounded-full bg-gray-300 border border-gray-400" />
      </div>

      {/* Grid 2 columnas (izq datos / der métricas) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Columna izquierda */}
        <div className="space-y-5">
          <div>
            <p className="text-gray-600">Nombre:</p>
            <p className="text-xl font-semibold">Juan Pérez</p>
          </div>

          <div>
            <p className="text-gray-600">Ciudad:</p>
            <p className="text-sm text-gray-500">Cochabamba</p>
          </div>

          <div>
            <p className="font-medium">Rubros</p>
            <p className="text-xs sm:text-sm text-gray-500">
              Carpintero, Albañil, Plomero
            </p>
          </div>

         
            <p className="capitalize font-medium">sobre mi :</p>
            <div className="rounded-2xl border border-green-400 bg-gray-100 p-4 text-sm text-gray-800 shadow-card">
              soy una persona responsable y eficiente que trabajo tanto en obras
              grandes y pequeñas
            </div>
          </div>
        

        {/* Columna derecha */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">trabajos registrados :</span> 45
            </p>
          </div>

          <div>
            <p className="font-medium">Calificacion</p>
            <div className="mt-1 text-amber-400 text-xl" aria-label="4 de 5">
              ★★★★<span className="text-gray-300">★</span>
            </div>
          </div>

          <div>
            <p className="font-medium">En Servineo desde</p>
            <p className="text-sm text-gray-500">28-08-2015</p>
          </div>

          <div className="pt-4">
            <button
              type="button"
              className= "w-64 h-14 rounded-xl bg-whatsapp text-white font-medium shadow-card hover:brightness-95 transition"
            >
              contactar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
