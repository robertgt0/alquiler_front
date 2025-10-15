"use client";

import { useFiltros } from "@Feature/Hooks/useFiltro";

export default function FiltrosForm() {
  const {
    ciudades,
    provincias,
    disponibilidad,
    especialidades,
    filtro,
    handleChange,
  } = useFiltros();

  const handleBuscar = () => {
    console.log("Filtros aplicados:", filtro);
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 border border-blue-300 rounded-lg bg-white font-sans text-sm text-blue-700">
      {/* 🔍 Buscador */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-5">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full px-3 py-1.5 border border-blue-300 rounded-md placeholder-blue-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-base cursor-pointer">
            🔍
          </span>
        </div>

        <button
          onClick={handleBuscar}
          className="bg-blue-600 text-white px-5 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
        >
          Buscar
        </button>
      </div>

      {/* 🧩 Filtros adaptativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 transition-all duration-300">
        {/* Ciudad */}
        <div className="flex flex-col">
          <label className="text-blue-700 text-xs font-semibold mb-1">
            Ciudad
          </label>
          <select
            value={filtro.ciudad || ""}
            onChange={(e) => handleChange("ciudad", e.target.value)}
            className="border border-blue-300 rounded-md bg-white text-blue-700 text-xs py-1 px-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option className="text-gray-400">Seleccionar</option>
            {ciudades.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Provincia */}
        <div className="flex flex-col">
          <label className="text-blue-700 text-xs font-semibold mb-1">
            Provincia
          </label>
          <select
            value={filtro.provincia || ""}
            onChange={(e) => handleChange("provincia", e.target.value)}
            className="border border-blue-300 rounded-md bg-white text-blue-700 text-xs py-1 px-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option className="text-gray-400">Seleccionar</option>
            {provincias.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Especialidad */}
        <div className="flex flex-col">
          <label className="text-blue-700 text-xs font-semibold mb-1">
            Especialidad
          </label>
          <select
            value={filtro.tipoEspecialidad || ""}
            onChange={(e) => handleChange("tipoEspecialidad", e.target.value)}
            className="border border-blue-300 rounded-md bg-white text-blue-700 text-xs py-1 px-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option className="text-gray-400">Seleccionar</option>
            {especialidades.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Disponibilidad */}
        <div className="flex flex-col">
          <label className="text-blue-700 text-xs font-semibold mb-1">
            Disponibilidad
          </label>
          <select
            value={filtro.disponibilidad || ""}
            onChange={(e) => handleChange("disponibilidad", e.target.value)}
            className="border border-blue-300 rounded-md bg-white text-blue-700 text-xs py-1 px-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option className="text-gray-400">Seleccionar</option>
            {disponibilidad.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📄 Paginación */}
      <div className="flex flex-wrap items-center gap-1 justify-center sm:justify-start">
        <button className="px-3 py-1 border border-blue-600 bg-blue-600 text-white rounded text-xs font-semibold">
          1
        </button>
        {[2, 3, 4, 5].map((num) => (
          <button
            key={num}
            className="px-3 py-1 border border-blue-600 text-blue-600 rounded text-xs hover:bg-blue-600 hover:text-white transition"
          >
            {num}
          </button>
        ))}
        <button className="ml-1 px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded text-xs hover:bg-blue-200 transition">
          Siguiente &gt;
        </button>
      </div>
    </div>
  );
}
