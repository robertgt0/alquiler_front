"use client";

import { useFiltros } from "app/alquiler/Feature/Hooks/useFiltro";

export default function FiltrosForm() {
  const {
    ciudades,
    provincias,
    disponibilidad,
    especialidades,
    filtro,
    handleChange,
    buscarPorServicio,
    usuarios,
    loadingUsuarios,
    errorUsuarios,
    limpiarFiltros,
  } = useFiltros();

  const mostrarUsuarios =
    filtro.disponibilidad !== "false" && usuarios.length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 text-black">
    
      
    <h3 className="font-semibold text-lg mb-3 text-blue-600">
  Filtrar por:
</h3>


      {/* 🧩 Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
        {/* Ciudad */}
        <select
          value={filtro.ciudad || ""}
          onChange={(e) => handleChange("ciudad", e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Elige una ciudad</option>
          {ciudades.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Provincia */}
        <select
          value={filtro.provincia || ""}
          onChange={(e) => handleChange("provincia", e.target.value)}
          disabled={provincias.length === 0}
          className={`w-full border rounded-lg px-3 py-2 text-sm ${
            provincias.length === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-400 focus:ring-blue-500 focus:border-blue-500"
          }`}
        >
          <option value="">Elige una provincia</option>
          {provincias.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Disponibilidad */}
        <select
          value={filtro.disponibilidad || ""}
          onChange={(e) => handleChange("disponibilidad", e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Disponibilidad</option>
          {disponibilidad.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* Tipo de Especialidad */}
        <select
          value={filtro.tipoEspecialidad || ""}
          onChange={(e) => handleChange("tipoEspecialidad", e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tipo de Especialidad</option>
          {especialidades.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* 🧼 Botón Limpiar Filtros */}
      <div className="flex justify-end mb-5">
        <button
          onClick={() => {
            limpiarFiltros();
          }}
          disabled={loadingUsuarios}
          className="text-sm text-blue-600 underline hover:text-blue-800 transition disabled:opacity-50"
        >
          Limpiar filtros
        </button>
      </div>

      {/* 📋 Resultados */}
      <div className="mt-4">
        {loadingUsuarios && (
          <p className="text-black/70">Cargando usuarios...</p>
        )}

        {errorUsuarios && (
          <p className="text-red-600 text-sm font-medium">⚠ {errorUsuarios}</p>
        )}

        {!loadingUsuarios &&
          !errorUsuarios &&
          filtro.disponibilidad === "false" && (
            <p className="text-black/60 text-sm">
              No se muestran usuarios con disponibilidad "No disponible".
            </p>
          )}

        {!loadingUsuarios && !errorUsuarios && mostrarUsuarios && (
          <ul className="space-y-2 mt-2">
            {usuarios.map((u) => (
              <li
                key={u._id}
                className="border border-gray-300 rounded-lg p-3 hover:bg-gray-100 transition"
              >
                <div className="font-semibold text-black text-base">
                  {u.nombre}
                </div>
                <div className="text-sm text-black/80">
                  {u.ciudad?.nombre ?? "Sin ciudad"} — {u.email ?? "Sin email"} —{" "}
                  {u.telefono ?? "Sin teléfono"}
                </div>
                {u.servicios?.length ? (
                  <div className="text-sm text-black mt-1">
                    <strong>Servicios:</strong>{" "}
                    {u.servicios.map((s) => s.nombre).join(", ")}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {!loadingUsuarios &&
          !errorUsuarios &&
          usuarios.length === 0 &&
          filtro.busqueda.trim() &&
          filtro.disponibilidad !== "false" && (
            <p className="text-black/70 text-sm">
              No hay usuarios para “{filtro.busqueda}”.
            </p>
          )}
      </div>
    </div>
  );
}
