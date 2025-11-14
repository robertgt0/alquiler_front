"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFiltros } from "app/alquiler/Feature/Hooks/useFiltro";

interface FiltrosFormProps {
  onResults?: (usuarios: any[]) => void;
  sort: string;
  setSort: (value: string) => void;
  search?: string;
  setSearch?: (value: string) => void;
  opcionesOrdenamiento: string[];
  totalItems: number;
  onFilterNoResults?: (noResults: boolean) => void;
  onClearFilters?: () => void;
  disabled?: boolean;
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
  onClearFilters,
  disabled = false,
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
  const [selectAbierto, setSelectAbierto] = useState(false);
  const [hoverSelect, setHoverSelect] = useState(false);

  // --------------------------
  // 🔹 Limpiar filtros al montar el componente
  useEffect(() => {
    limpiarFiltros();
    try {
      setSort("Fecha (Reciente)");
    } catch {}
  }, []);

  // Bloquea flechas globales salvo cuando selectAbierto === true
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectAbierto && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectAbierto]);

  const handleRealOpen = () => {
    setSelectAbierto(true);
    setTimeout(() => {
      if (!hoverSelect) setSelectAbierto(false);
    }, 300);
  };

  // Manejar resultados
  useEffect(() => {
    if (onResults) onResults(usuarios);
    if (onFilterNoResults) onFilterNoResults(Boolean(sinResultados));
  }, [usuarios, sinResultados]);

  const selectEvents = {
    onMouseEnter: () => setHoverSelect(true),
    onMouseLeave: () => {
      setHoverSelect(false);
      setSelectAbierto(false);
    },
    onMouseDown: handleRealOpen,
  };

  // -----------------------------
  // 🔥 FUNCIÓN CORREGIDA: YA NO BORRA LA CIUDAD CUANDO SELECCIONAS ESPECIALIDAD
  const handleFiltroUnico = async (campo: string, valor: string) => {
    // Si el filtro es departamento → reinicia todo
    if (campo === "departamento") {
      handleChange("departamento", valor);
      handleChange("ciudad", "");
      handleChange("disponibilidad", "");
      handleChange("tipoEspecialidad", "");

      setDepartamentoSeleccionado(valor);
      await loadCiudadesByDepartamento(valor);
      return;
    }

    // Si el filtro es ciudad → NO reiniciar departamento
    if (campo === "ciudad") {
      handleChange("ciudad", valor);
      return;
    }

    // Si el filtro es disponibilidad o tipoEspecialidad → NO borrar ciudad/departamento
    if (campo === "disponibilidad" || campo === "tipoEspecialidad") {
      handleChange(campo, valor);
      return;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-6 md:p-8 shadow-2xl shadow-gray-200/50 border border-gray-100">

      {/* FILTROS SECUNDARIOS */}
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

        {mostrarFiltros && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">

            {/* Departamento */}
            <select
              value={departamentoSeleccionado || ""}
              onChange={(e) => handleFiltroUnico("departamento", e.target.value)}
              {...selectEvents}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Elige un departamento</option>
              {departamentos.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>

            {/* Ciudad */}
            <select
              value={filtro.ciudad || ""}
              onChange={(e) => handleFiltroUnico("ciudad", e.target.value)}
              disabled={!departamentoSeleccionado || ciudades.length === 0}
              {...selectEvents}
              className={`border rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !departamentoSeleccionado || ciudades.length === 0
                  ? "opacity-60 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            >
              {(!departamentoSeleccionado || ciudades.length === 0) ? (
                <option value="" disabled>Seleccione Provincia</option>
              ) : (
                <>
                  <option value="">Seleccione Provincia</option>
                  {ciudades.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </>
              )}
            </select>

            {/* Disponibilidad */}
            <select
              value={filtro.disponibilidad || ""}
              onChange={(e) => handleFiltroUnico("disponibilidad", e.target.value)}
              {...selectEvents}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Disponibilidad</option>
              {disponibilidad.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>

            {/* Tipo de Especialidad */}
            <select
              value={filtro.tipoEspecialidad || ""}
              onChange={(e) => handleFiltroUnico("tipoEspecialidad", e.target.value)}
              {...selectEvents}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tipo de Especialidad</option>
              {especialidades.map((t, index) => (
                <option key={t.value + "-" + index} value={t.value}>{t.label}</option>
              ))}
            </select>

          </div>
        )}
      </div>

      {/* ORDENAMIENTO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t pt-4 mt-4">

        <div className="flex items-center gap-2 mb-3 sm:mb-0">
          <p className="font-semibold text-base text-blue-600">Ordenar por</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            disabled={disabled}
            {...selectEvents}
            className={`border border-gray-400 rounded-lg px-3 py-2 text-sm text-black focus:ring-blue-500 focus:border-blue-500 ${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {opcionesOrdenamiento?.map((opcion) => (
              <option key={opcion} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 font-medium">Total de Ofertas: {totalItems}</div>
          <button
            type="button"
            onClick={() => {
              limpiarFiltros();
              try { setSort("Fecha (Reciente)"); } catch {}
              if (onClearFilters) onClearFilters();
              router.push("/alquiler/paginacion");
            }}
            className="ml-4 inline-block mt-0 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {loadingUsuarios && <p className="text-black/70 mt-4">Buscando profesionales...</p>}
      {errorUsuarios && <p className="text-red-600 text-sm font-medium mt-4">⚠ {errorUsuarios}</p>}
    </div>
  );
}
