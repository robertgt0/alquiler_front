"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFiltros } from "app/alquiler/Feature/Hooks/useFiltro";
import type { UsuarioResumen } from "app/alquiler/Feature/Types/filtroType";

interface FiltrosFormProps {
  onResults?: (usuarios: any[]) => void; // Props pasadas desde paginacion para Ordenamiento y Búsqueda
  sort: string;
  setSort: (value: string) => void;
  search?: string;
  setSearch?: (value: string) => void;
  opcionesOrdenamiento: string[];
  totalItems: number; // Conteo de resultados de trabajos
  // Notifica a la página si los filtros dieron como resultado "sin resultados"
  onFilterNoResults?: (noResults: boolean) => void;
  // NUEVA PROP: Notifica cuando se limpian los filtros
  onClearFilters?: () => void;
}

interface Option {
  value: string;
  label: string;
}

export default function FiltrosForm({
  onResults,
  sort,
  setSort,
  search,
  setSearch,
  opcionesOrdenamiento = [],
  totalItems,
  onFilterNoResults,
  onClearFilters, // NUEVA PROP
}: FiltrosFormProps) {
  const router = useRouter();
  const {
    departamentos,
    ciudades,
    provincias,
    disponibilidad,
    especialidades,
    filtro,
    handleChange,
    limpiarFiltros,
    usuarios,
    loadingUsuarios,
    errorUsuarios,
    sinResultados,
    departamentoSeleccionado,
    setDepartamentoSeleccionado,
    loadCiudadesByDepartamento,
  } = useFiltros();

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    if (onResults) {
      onResults(usuarios);
    }
    // Notificar a la página si los filtros no arrojaron resultados
    if (typeof onFilterNoResults === 'function') {
      console.log("🔄 Notificando estado de sin resultados:", sinResultados);
      onFilterNoResults(Boolean(sinResultados));
    }
  }, [usuarios, onResults, sinResultados, onFilterNoResults]);

  return (
    <div className="w-full bg-white rounded-xl p-6 md:p-8 shadow-2xl shadow-gray-200/50 border border-gray-100">
      {/* FILTROS SECUNDARIOS DESPLEGABLES */}
      <div className={`pt-5 ${mostrarFiltros ? "border-t" : ""}`}>
        <h3
          className="font-semibold text-base text-blue-600 hover:text-blue-700 transition cursor-pointer flex items-center mb-1"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          Filtrar por
          <span className="ml-1 text-blue-600">
            {mostrarFiltros ? "▼" : "▶"}
          </span>
        </h3>

        {/* Solo se muestran cuando mostrarFiltros */}
        {mostrarFiltros && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {/* Departamento */}
            <select
              value={departamentoSeleccionado || ""}
              onChange={async (e) => {
                const val = e.target.value;
                setDepartamentoSeleccionado(val);
                // limpiar ciudad seleccionada cuando cambia el departamento
                handleChange("ciudad", "");
                // siempre llamar a la carga de ciudades; la función internamente
                // limpia `ciudades` si el departamento es vacío.
                await loadCiudadesByDepartamento(val);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {/* placeholder no seleccionable - mejora UX: el usuario no puede elegir "vacío" a propósito */}
              <option value="" disabled>
                Elige un departamento
              </option>
              {departamentos.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            {/* Ciudad */}
            <select
              value={filtro.ciudad || ""}
              onChange={(e) => handleChange("ciudad", e.target.value)}
              disabled={!departamentoSeleccionado || ciudades.length === 0}
              className={`border rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!departamentoSeleccionado || ciudades.length === 0 ? 'opacity-60 cursor-not-allowed' : 'border-gray-300'}`}
            >
              {/* Si no hay departamento seleccionado o no hay ciudades, mostrar mensaje clarificador */}
              {(!departamentoSeleccionado || ciudades.length === 0) ? (
                <option value="" disabled>
                  Seleccione un departamento primero
                </option>
              ) : (
                <>
                  <option value="">Elige una ciudad</option>
                  {ciudades.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </>
              )}
            </select>

            {/* Disponibilidad */}
            <select
              value={filtro.disponibilidad || ""}
              onChange={(e) => handleChange("disponibilidad", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tipo de Especialidad</option>
              {especialidades.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
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
            {opcionesOrdenamiento?.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>

        {/* CONTEO DE RESULTADOS */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 font-medium">Total de Ofertas: {totalItems}</div>
          <button
            type="button"
            onClick={() => {
              // limpiar todos los filtros, restablecer orden y redirigir
              try {
                limpiarFiltros();
                // restablecer orden al valor por defecto si se pasó setSort
                try { if (typeof setSort === 'function') setSort("Fecha (Reciente)"); } catch(e) { /* ignore */ }
                // LLAMAR AL HANDLER DE LIMPIEZA DEL COMPONENTE PADRE
                if (typeof onClearFilters === 'function') {
                  onClearFilters();
                }
              } catch (e) {
                console.warn('Error limpiando filtros', e);
              }
              router.push('/alquiler/paginacion');
            }}
            className="ml-4 inline-block mt-0 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      
      {/* Feedback de carga y error */}
      {loadingUsuarios && (
        <p className="text-black/70 mt-4">Buscando profesionales...</p>
      )}
      {errorUsuarios && (
        <p className="text-red-600 text-sm font-medium mt-4">
          ⚠ {errorUsuarios}
        </p>
      )}
    </div>
  );
}