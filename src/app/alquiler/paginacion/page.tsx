'use client';

import JobCard from "./components/jobCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { useState, useEffect, useMemo } from "react";
import { usePagination } from "./hooks/usePagination";
import { Job } from "./types/job";
import BusquedaAutocompletado from "../Busqueda/busquedaAutocompletado";
import { useSearchParams } from "next/navigation";

export default function BusquedaPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;

  // Manejar resultados de búsqueda
  const handleSearchResults = (searchTerm: string, resultados: Job[]) => {
    console.log('🔍 [BUSQUEDA-PAGE] Búsqueda recibida:', searchTerm);
    console.log('🔍 [BUSQUEDA-PAGE] Resultados recibidos:', resultados);

    setSearchTerm(searchTerm);
    setSearchResults(resultados);
    setIsSearchActive(!!searchTerm.trim());
  };

  // Determinar qué datos mostrar
  const jobsToDisplay = useMemo(() => {
    console.log('📊 [BUSQUEDA-PAGE] Determinando jobs a mostrar:');
    console.log('📊 [BUSQUEDA-PAGE] - Búsqueda activa:', isSearchActive);
    console.log('📊 [BUSQUEDA-PAGE] - Search term:', searchTerm);
    console.log('📊 [BUSQUEDA-PAGE] - Search results:', searchResults.length);
    console.log('📊 [BUSQUEDA-PAGE] - All jobs:', allJobs.length);

    // Si hay búsqueda activa, usar searchResults
    if (isSearchActive && searchTerm.trim() !== "") {
      return searchResults.length > 0 ? searchResults : [];
    }

    // Por defecto, usar allJobs
    return allJobs;
  }, [isSearchActive, searchTerm, searchResults, allJobs]);

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems
  } = usePagination(jobsToDisplay, itemsPerPage);

  const handleViewDetails = (job: Job) => {
    console.log('Ver detalles de:', job);
    // Aquí puedes navegar a la página de detalles o mostrar un modal
  };

  // Cargar trabajos desde la API al montar el componente
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        console.log('📥 [BUSQUEDA-PAGE] Cargando trabajos...');
        const jobs = await getJobs();
        console.log('📥 [BUSQUEDA-PAGE] Trabajos cargados:', jobs.length);

        setAllJobs(jobs);
        setSearchResults(jobs); // Inicialmente mostrar todos
      } catch (error) {
        console.error('❌ [BUSQUEDA-PAGE] Error cargando trabajos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Si hay un parámetro en la URL al cargar, ejecutar la búsqueda automáticamente
  useEffect(() => {
    if (urlQuery && allJobs.length > 0) {
      console.log('🔗 [BUSQUEDA-PAGE] Búsqueda desde URL:', urlQuery);
      // Simular la búsqueda con el término de la URL
      const resultadosFiltrados = allJobs.filter(job =>
        job.service.toLowerCase().includes(urlQuery.toLowerCase()) ||
        job.title.toLowerCase().includes(urlQuery.toLowerCase())
      );
      handleSearchResults(urlQuery, resultadosFiltrados);
    }
  }, [urlQuery, allJobs]);

  // Limpiar resultados de búsqueda cuando se borra el término
  useEffect(() => {
    if (!searchTerm.trim() && isSearchActive) {
      setIsSearchActive(false);
      setSearchResults(allJobs);
    }
  }, [searchTerm, isSearchActive, allJobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-3 tracking-tight">
          Ofertas de Trabajo Disponibles
        </h1>

        {/* Buscador */}
        <div className="mb-6">
          <BusquedaAutocompletado
            onSearch={handleSearchResults}
            datos={allJobs}
            placeholder="Buscar por profesional, servicio..."
            valorInicial={urlQuery} // Pasar el query de la URL como valor inicial
          />
        </div>

        {/* Información de resultados */}
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

        {/* Mensaje si no hay resultados */}
        {!isLoading && jobsToDisplay.length === 0 && (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg">
              {isSearchActive && searchTerm
                ? `No se encontraron resultados para "${searchTerm}".`
                : "No hay ofertas de trabajo disponibles."}
            </p>
            {isSearchActive && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setIsSearchActive(false);
                  setSearchResults(allJobs);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todas las ofertas
              </button>
            )}
          </div>
        )}

        {/* Lista de trabajos */}
        {!isLoading && jobsToDisplay.length > 0 && (
          <>
            <div className="space-y-6 mt-6">
              {currentItems.map((job, index) => (
                <JobCard
                  key={`${job.title}-${job.company}-${index}-${currentPage}`}
                  {...job}
                  onViewDetails={() => handleViewDetails(job)}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8">
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