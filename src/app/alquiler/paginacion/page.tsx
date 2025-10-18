'use client';

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import JobCard from "./components/jobCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";
import { Job } from "./types/job";
import BusquedaAutocompletado from "../Busqueda/busquedaAutocompletado";
import FiltrosForm from "../Feature/Componentes/FiltroForm";
import { UsuarioResumen } from "../Feature/Types/filtroType";

export default function BusquedaPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  // Estados principales
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [sortBy, setSortBy] = useState("Fecha (Reciente)");
  const [search, setSearch] = useState("");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioResumen[]>([]);
  const [modoVista, setModoVista] = useState<"jobs" | "usuarios">("jobs");

  const itemsPerPage = 10;

  // Opciones de ordenamiento
  const opcionesOrdenamiento = [
    "Fecha (Reciente)",
    "Nombre A-Z",
    "Nombre Z-A",
    "Mayor Calificación (⭐)"
  ];

  // Función de ordenamiento
  const ordenarItems = (opcion: string, lista: Job[]) => {
    const sorted = [...lista];
    switch (opcion) {
      case "Nombre A-Z":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Nombre Z-A":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "Fecha (Reciente)":
        sorted.sort(
          (a, b) =>
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
        break;
      case "Mayor Calificación (⭐)":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return sorted;
  };

  // Determinar qué lista mostrar
  const jobsToDisplay = useMemo(() => {
    let data = isSearchActive ? searchResults : allJobs;

    if (search.trim() !== "") {
      data = data.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return ordenarItems(sortBy, data);
  }, [isSearchActive, searchResults, allJobs, sortBy, search]);

  // Hook de paginación
  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems
  } = usePagination(jobsToDisplay, itemsPerPage);

  // Manejar resultados de búsqueda (desde el autocompletado)
  const handleSearchResults = (termino: string, resultados: Job[]) => {
    console.log("🔍 [BUSQUEDA-PAGE] Búsqueda recibida:", termino);
    setSearchTerm(termino);
    setSearchResults(resultados);
    setIsSearchActive(!!termino.trim());
  };

  // Cargar trabajos al montar
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        console.log("📥 [BUSQUEDA-PAGE] Cargando trabajos...");
        const jobs = await getJobs();
        setAllJobs(jobs);
        setSearchResults(jobs);
      } catch (error) {
        console.error("❌ Error cargando trabajos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  // Búsqueda automática si hay `q` en la URL
  useEffect(() => {
    if (urlQuery && allJobs.length > 0) {
      console.log("🔗 [BUSQUEDA-PAGE] Búsqueda desde URL:", urlQuery);
      const resultados = allJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(urlQuery.toLowerCase()) ||
          job.service?.toLowerCase().includes(urlQuery.toLowerCase())
      );
      handleSearchResults(urlQuery, resultados);
    }
  }, [urlQuery, allJobs]);

  // Limpiar búsqueda si el término se borra
  useEffect(() => {
    if (!searchTerm.trim() && isSearchActive) {
      setIsSearchActive(false);
      setSearchResults(allJobs);
    }
  }, [searchTerm, isSearchActive, allJobs]);

  // Vista de detalles
  const handleViewDetails = (job: Job) => {
    console.log("🧾 Ver detalles de:", job);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Título */}
        <h1 className="text-4xl font-extrabold text-blue-600 mb-10 border-l-4 border-blue-600 pl-4 tracking-wide">
          Ofertas de Trabajo Disponibles
        </h1>

        {/* Buscador */}
        <div className="mb-6">
          <BusquedaAutocompletado
            onSearch={handleSearchResults}
            datos={allJobs}
            placeholder="Buscar por profesional, servicio..."
            valorInicial={urlQuery}
          />
        </div>

        {/* Info de resultados */}
        <div className="text-lg text-blue-600 font-medium mt-2 mb-4">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Cargando ofertas...
            </div>
          ) : (
            <>
              Mostrando {currentItems.length} de {totalItems} Ofertas Disponibles
              {isSearchActive && searchTerm && (
                <span className="text-sm text-gray-600 ml-2">
                  (Búsqueda: "{searchTerm}")
                </span>
              )}
            </>
          )}
        </div>

        {/* Filtros y ordenamiento */}
        <div className="mb-12">
          <FiltrosForm
            onResults={(usuarios: UsuarioResumen[]) => {
              setUsuariosFiltrados(usuarios);
              setModoVista(usuarios.length > 0 ? "usuarios" : "jobs");
            }}
            sort={sortBy}
            setSort={setSortBy}
            search={search}
            setSearch={setSearch}
            opcionesOrdenamiento={opcionesOrdenamiento}
            totalItems={totalItems}
          />
        </div>

        {/* Vista de usuarios */}
        {modoVista === "usuarios" && usuariosFiltrados.length > 0 ? (
          <div className="space-y-6 mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3">
              Resultados de Profesionales
            </h2>
            {usuariosFiltrados.map((u) => (
              <div
                key={u._id}
                className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition"
              >
                <h3 className="font-semibold text-lg text-gray-900">{u.nombre}</h3>
              </div>
            ))}
            <button
              onClick={() => setModoVista("jobs")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Volver a ofertas
            </button>
          </div>
        ) : (
          <>
            {/* Vista de jobs */}
            <div className="text-xl text-blue-700 font-semibold mb-6">
              Mostrando {currentItems.length} de {totalItems} Ofertas Disponibles
            </div>

            <div className="space-y-6">
              {currentItems.map((job, index) => (
                <JobCard
                  key={`${job.title}-${index}`}
                  {...job}
                  onViewDetails={() => handleViewDetails(job)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  handleNextPage={handleNextPage}
                  handlePrevPage={handlePrevPage}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

