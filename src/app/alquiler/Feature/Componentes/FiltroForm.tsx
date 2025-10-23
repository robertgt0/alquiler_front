"use client";

import { useEffect, useState } from "react";
import { useFiltros } from "app/alquiler/Feature/Hooks/useFiltro";
import type { UsuarioResumen } from "app/alquiler/Feature/Types/filtroType";

interface Option {
  value: string;
  label: string;
}

interface FiltrosFormProps {
  onResults?: (usuarios: UsuarioResumen[]) => void;
  sort: string;
  setSort: (value: string) => void;
  opcionesOrdenamiento: string[];
  totalItems: number;
}

export default function FiltrosForm({
  onResults,
  sort,
  setSort,
  opcionesOrdenamiento = [],
  totalItems
}: FiltrosFormProps) {
  const {
    departamentos,
    ciudades,
    disponibilidad,
    especialidades,
    filtro,
    handleChange,
    usuarios,
    loadingUsuarios,
    errorUsuarios,
    sinResultados,
    departamentoSeleccionado,
    setDepartamentoSeleccionado,
    loadCiudadesByDepartamento,
  } = useFiltros();

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // 🔥 ACTUALIZAR LOS RESULTADOS AUTOMÁTICAMENTE
  useEffect(() => {
    if (onResults) {
      onResults(usuarios);
    }
  }, [usuarios, onResults]);

  return (
    <div className="w-full bg-white rounded-xl p-6 md:p-8 shadow-2xl shadow-gray-200/50 border border-gray-100">
      {/* ❌ SE ELIMINÓ COMPLETAMENTE LA BARRA DE BÚSQUEDA PRINCIPAL */}

      {/* FILTROS SECUNDARIOS DESPLEGABLES */}
      <div className="pt-5">
        <h3
          className="font-semibold text-base text-blue-600 hover:text-blue-700 transition cursor-pointer flex items-center mb-1"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          Filtrar por <span className="ml-1 text-blue-600">{mostrarFiltros ? '▼' : '▶'}</span>
        </h3>

        {mostrarFiltros && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {/* Departamento */}
            <select
              value={departamentoSeleccionado || ""}
              onChange={async (e) => {
                const val = e.target.value;
                setDepartamentoSeleccionado(val);
                handleChange("ciudad", "");
                if (val) {
                  await loadCiudadesByDepartamento(val);
                }
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Elige un departamento</option>
              {departamentos.map((d: Option) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>

            {/* Ciudad */}
            <select
              value={filtro.ciudad || ""}
              onChange={(e) => handleChange("ciudad", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Elige una ciudad</option>
              {ciudades.map((c: Option) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            {/* Disponibilidad */}
            <select
              value={filtro.disponibilidad || ""}
              onChange={(e) => handleChange("disponibilidad", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Disponibilidad</option>
              {disponibilidad.map((d: Option) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>

            {/* Tipo de Especialidad */}
            <select
              value={filtro.tipoEspecialidad || ""}
              onChange={(e) => handleChange("tipoEspecialidad", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tipo de Especialidad</option>
              {especialidades.map((t: Option) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ORDENAMIENTO Y CONTEO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t pt-4 mt-4">
        {/* ORDENAR POR */}
        <div className="flex items-center gap-2 mb-3 sm:mb-0">
          <p className="font-semibold text-base text-blue-600">Ordenar por</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-400 rounded-lg px-3 py-2 text-sm text-black focus:ring-blue-500 focus:border-blue-500"
          >
            {opcionesOrdenamiento.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>

        {/* CONTEO DE RESULTADOS */}
        <div className="text-sm text-gray-600 font-medium">
          Total de Ofertas: {totalItems}
        </div>
      </div>

      {/* FEEDBACK MEJORADO */}
      <div className="mt-4">
        {loadingUsuarios && <p className="text-black/70">Buscando profesionales...</p>}
        {errorUsuarios && (
          <p className="text-red-600 text-sm font-medium">⚠ {errorUsuarios}</p>
        )}
        {sinResultados && !loadingUsuarios && (
          <p className="text-orange-600 text-sm font-medium">
            📭 No se encontraron profesionales con los filtros seleccionados
          </p>
        )}
      </div>
    </div>
  );
}