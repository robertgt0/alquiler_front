'use client';

import JobCard from "./components/jobCard";
import Pagination from "./components/Pagination";
import { getJobs, searchJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";
import BusquedaAutocompletado from "../Busqueda/busquedaAutocompletado";
import { useState, useEffect } from "react";
import { JobFrontend } from "./types/job";
import { useRouter, useSearchParams } from 'next/navigation';

type EstadoBusqueda = "idle" | "loading" | "success" | "error";

export default function BusquedaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allJobs, setAllJobs] = useState<JobFrontend[]>([]);
  const [trabajosFiltrados, setTrabajosFiltrados] = useState<JobFrontend[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [estadoBusqueda, setEstadoBusqueda] = useState<EstadoBusqueda>("idle");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Cargar trabajos y búsqueda desde URL al iniciar
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        const jobs = await getJobs();
        setAllJobs(jobs);

        const queryFromURL = searchParams.get('q');
        console.log('🔍 [LOAD] queryFromURL:', queryFromURL);

        if (queryFromURL) {
          setTerminoBusqueda(queryFromURL);
          console.log('🔍 [LOAD] terminoBusqueda seteado:', queryFromURL);
          setEstadoBusqueda("loading");

          try {
            const resultadosBusqueda = await searchJobs(queryFromURL);
            setTrabajosFiltrados(resultadosBusqueda);
            setEstadoBusqueda("success");
          } catch (error) {
            console.error('Error cargando búsqueda desde URL:', error);
            setTrabajosFiltrados(jobs);
            setEstadoBusqueda("idle");
          }
        } else {
          setTrabajosFiltrados(jobs);
          setEstadoBusqueda("idle");
        }

      } catch (err) {
        setError('Error al cargar los trabajos');
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [searchParams]);

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems
  } = usePagination(trabajosFiltrados, itemsPerPage);

  const handleSearch = (searchTerm: string, resultados: JobFrontend[]) => {
    setTerminoBusqueda(searchTerm);
    setTrabajosFiltrados(resultados);

    // 🔧 SOLUCIÓN SEGURA: Usar window.history
    try {
      if (searchTerm.trim() === "") {
        window.history.pushState({}, '', '/alquiler/paginacion');
      } else {
        window.history.pushState({}, '', `/alquiler/paginacion?q=${encodeURIComponent(searchTerm)}`);
      }
    } catch (error) {
      console.error('Error actualizando URL:', error);
    }

    handlePageChange(1);
  };

  const handleViewDetails = (job: JobFrontend) => {
    console.log('Ver detalles de:', job);
  };

  // Estado inicial de carga
  if (loading && allJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="mb-6">
            <h1 className="text-4xl font-bold text-blue-700 mb-3 tracking-tight">
              Ofertas de Trabajo Disponibles
            </h1>
          </div>

          <div className="mb-6 opacity-50">
            <BusquedaAutocompletado
              onSearch={handleSearch}
              datos={[]}
              placeholder="Cargando..."
              valorInicial={terminoBusqueda} // 🔧 Pasar el término actual
            />
          </div>

          <div className="mb-8">
            <div className="text-lg text-blue-600 font-medium">
              Cargando ofertas...
            </div>
          </div>

          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Cargando ofertas de trabajo...</p>
          </div>

        </main>
      </div>
    );
  }

  if (error && allJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="mb-6">
            <h1 className="text-4xl font-bold text-blue-700 mb-3 tracking-tight">
              Ofertas de Trabajo Disponibles
            </h1>
          </div>

          <div className="mb-6">
            <BusquedaAutocompletado
              onSearch={handleSearch}
              datos={[]}
              placeholder="Buscar por puesto, empresa o servicio..."
              valorInicial={terminoBusqueda} // 🔧 Pasar el término actual
            />
          </div>

          <div className="mb-8">
            <div className="text-lg text-blue-600 font-medium">
              Error al cargar ofertas
            </div>
          </div>

          <div className="text-center py-8">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-blue-700 mb-3 tracking-tight">
            {terminoBusqueda
              ? `Resultados para "${terminoBusqueda}"`
              : 'Ofertas de Trabajo Disponibles'
            }
          </h1>
        </div>

        {/* 🔧 IMPORTANTE: Pasar valorInicial al componente */}
        <div className="mb-6">
          <BusquedaAutocompletado
            onSearch={handleSearch}
            datos={allJobs}
            placeholder="Buscar por puesto, empresa o servicio..."
            valorInicial={terminoBusqueda} // 🔧 Esto mantiene el texto al recargar
          />
        </div>

        <div className="mb-8">
          <div className="text-lg text-blue-600 font-medium">
            {estadoBusqueda === "loading"
              ? `Buscando "${terminoBusqueda}"...`
              : `Mostrando ${currentItems.length} de ${totalItems} Ofertas Disponibles${terminoBusqueda ? ` para "${terminoBusqueda}"` : ''}`
            }
          </div>
        </div>

        {error && allJobs.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="results-area">
          {estadoBusqueda === "loading" ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-lg text-gray-600">Buscando resultados para "{terminoBusqueda}"...</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">
                {terminoBusqueda
                  ? `No se encontraron resultados para "${terminoBusqueda}"`
                  : 'No hay ofertas de trabajo disponibles en este momento'
                }
              </p>
              {terminoBusqueda && (
                <button
                  onClick={() => {
                    setTerminoBusqueda("");
                    setTrabajosFiltrados(allJobs);
                    setEstadoBusqueda("idle");
                    window.history.pushState({}, '', '/alquiler/paginacion');
                    handlePageChange(1);
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver todas las ofertas
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {currentItems.map((job, index) => (
                <JobCard
                  key={`${job.id}-${job.company}-${index}`}
                  {...job}
                  onViewDetails={() => handleViewDetails(job)}
                />
              ))}
            </div>
          )}
        </div>

        {currentItems.length > 0 && totalPages > 1 && estadoBusqueda !== "loading" && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
          />
        )}
      </main>
    </div>
  );
}
