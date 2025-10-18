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
    buscarPorServicio,   // ✅ siempre por servicio
    usuarios,
    loadingUsuarios,
    errorUsuarios,
  } = useFiltros();

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 text-black">
      {/* 🔍 Barra de búsqueda por SERVICIO */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar servicio (ej: Limpieza, Montaje de muebles...)"
          value={filtro.busqueda}
          onChange={(e) => handleChange("busqueda", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") buscarPorServicio(1);
          }}
          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => buscarPorServicio(1)}
          disabled={loadingUsuarios || !filtro.busqueda.trim()}
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loadingUsuarios ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <h3 className="font-semibold text-lg mb-3 text-black">Filtrar por:</h3>

      {/* 🧩 Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {/* Ciudad */}
        <select
          value={filtro.ciudad || ""}
          onChange={(e) => handleChange("ciudad", e.target.value)}
          className="border border-gray-400 rounded-lg px-3 py-2 text-sm text-black focus:ring-blue-500 focus:border-blue-500"
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
          className={`border rounded-lg px-3 py-2 text-sm text-black ${
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
          className="border border-gray-400 rounded-lg px-3 py-2 text-sm text-black focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Disponibilidad</option>
          {disponibilidad.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* Tipo de Especialidad (por ID desde listado) */}
        <select
          value={filtro.tipoEspecialidad || ""}
          onChange={(e) => handleChange("tipoEspecialidad", e.target.value)}
          className="border border-gray-400 rounded-lg px-3 py-2 text-sm text-black focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tipo de Especialidad</option>
          {especialidades.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 Resultados */}
      <div className="mt-4">
        {loadingUsuarios && <p className="text-black/70">Cargando usuarios...</p>}

        {errorUsuarios && (
          <p className="text-red-600 text-sm font-medium">⚠ {errorUsuarios}</p>
        )}

        {!loadingUsuarios && !errorUsuarios && usuarios.length > 0 && (
          <ul className="space-y-2 mt-2">
            {usuarios.map((u) => (
              <li
                key={u._id}
                className="border border-gray-300 rounded-lg p-3 hover:bg-gray-100 transition"
              >
                <div className="font-semibold text-black text-base">{u.nombre}</div>
                <div className="text-sm text-black/80">
                  {u.ciudad?.nombre ?? "Sin ciudad"} — {u.email ?? "Sin email"} — {u.telefono ?? "Sin teléfono"}
                </div>
                {u.servicios?.length ? (
                  <div className="text-sm text-black mt-1">
                    <strong>Servicios:</strong> {u.servicios.map((s) => s.nombre).join(", ")}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {!loadingUsuarios && !errorUsuarios && usuarios.length === 0 && filtro.busqueda.trim() && (
          <p className="text-black/70 text-sm">
            No hay usuarios para “{filtro.busqueda}”.
          </p>
        )}
      </div>
    </div>
  );
}