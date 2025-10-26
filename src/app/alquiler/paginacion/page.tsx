'use client';

import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import JobCard from "./components/jobCard";
import UserProfileCard from "./components/UserProfileCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";
import { Job } from "./types/job";
import BusquedaAutocompletado from "../Busqueda/busquedaAutocompletado";
import FiltrosForm from "../Feature/Componentes/FiltroForm";
import { UsuarioResumen } from "../Feature/Types/filtroType";

// Componente de carga
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center p-8 min-h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Cargando búsqueda...</span>
    </div>
  );
}

// Componente principal que usa useSearchParams - envuelto en Suspense
function BusquedaContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  // ---------------- Estados principales ----------------
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [isLoading, setIsLoading] = useState(true);

  const [buscando, setBuscando] = useState(false);
  const [estadoBusqueda, setEstadoBusqueda] = useState<"idle" | "success" | "error">("idle");

  const [sortBy, setSortBy] = useState("Fecha (Reciente)");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioResumen[]>([]);
    type ModoVista = "jobs" | "usuarios";
    const [modoVista, setModoVista] = useState<ModoVista>("jobs");
  const [filtersNoResults, setFiltersNoResults] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);

  // Ref para identificar la última búsqueda válida y descartar respuestas antiguas
  const latestSearchIdRef = useRef(0);

  const itemsPerPage = 10;

  // DEBUG: imprimir muestra de items en cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        console.log('BusquedaPage sample allJobs[0]:', allJobs[0]);
      }, 0);
    }
  }, [allJobs]);

 // ---------------- Opciones de ordenamiento ----------------
const opcionesOrdenamiento = [
  "Fecha (Reciente)",
  "Nombre A-Z",
  "Nombre Z-A",
  "Mayor Calificación (⭐)",
];

// ---------------- Funciones de ordenamiento ----------------
const ordenarItems = (opcion: string, lista: Job[]) => {
  const sorted = [...lista];
  switch (opcion) {
    case "Nombre A-Z":
      // Cambiar de title a company para ordenar por nombre de persona
      sorted.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
      break;
    case "Nombre Z-A":
      // Cambiar de title a company para ordenar por nombre de persona
      sorted.sort((a, b) => (b.company || "").localeCompare(a.company || ""));
      break;
    case "Fecha (Reciente)":
      sorted.sort(
        (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
      break;
    case "Mayor Calificación (⭐)":
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
  }
  return sorted;
};

  const ordenarUsuarios = (opcion: string, lista: UsuarioResumen[]) => {
    const sorted = [...lista];
    switch (opcion) {
      case "Nombre A-Z":
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "Nombre Z-A":
        sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case "Mayor Calificación (⭐)":
        sorted.sort((a, b) => {
          const calA = a.calificacion ?? 0;
          const calB = b.calificacion ?? 0;
          return calB - calA;
        });
        break;
      default:
        break;
    }
    return sorted;
  };

  // ---------------- Filtrado y ordenamiento ----------------
  const jobsToDisplay = useMemo(() => {
    let data = searchResults.length > 0 ? searchResults : allJobs;
    const normalizar = (texto: string) =>
      texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const termino = (searchTerm || "").trim();
    if (termino) {
      const palabras = normalizar(termino).split(/\s+/).filter(Boolean);

      data = data.filter((job) => {
        const title = normalizar(job.title || "");
        const company = normalizar(job.company || "");
        return palabras.some((palabra) => title.includes(palabra) || company.includes(palabra));
      });
    }

    return ordenarItems(sortBy, data);
  }, [searchResults, allJobs, sortBy, searchTerm]);

  const usuariosOrdenados = useMemo(
    () => ordenarUsuarios(sortBy, usuariosFiltrados),
    [sortBy, usuariosFiltrados]
  );

  
  // ---------------- Hook de paginación ----------------
  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems,
  } = usePagination(jobsToDisplay, itemsPerPage);
   const sinResultados = currentItems.length === 0;

  const handleViewDetails = (id: string | number) => {
    router.push(`/alquiler/${id}`);
  };

  // ---------------- Cargar trabajos ----------------
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const jobs = await getJobs();
        setAllJobs(jobs);
        setSearchResults(jobs);
      } catch (error) {
        console.error("Error cargando trabajos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  // ---------------- Buscar desde URL ----------------
  useEffect(() => {
    if (urlQuery && allJobs.length > 0) {
      const normalizar = (texto: string) =>
        texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const terminoNormalizado = normalizar(urlQuery);
      const palabras = terminoNormalizado.split(/\s+/).filter(Boolean);

      const resultados = allJobs.filter((job) => {
        const title = normalizar(job.title || "");
        const company = normalizar(job.company || "");
        return palabras.some((palabra) => title.includes(palabra) || company.includes(palabra));
      });

      handleSearchResults(urlQuery, resultados);
    }
  }, [urlQuery, allJobs]);

  const actualizarURL = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  // ---------------- Limpiar búsqueda ----------------
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(allJobs);
      setFiltrosAplicados(false);
      setSortBy("Fecha (Reciente)");
    }
  }, [searchTerm, allJobs]);

  // ---------------- Handlers ----------------
  const handleSearchResults = (
    termino: string,
    resultados: Job[],
    maybeIdOrActualizar?: number | boolean
  ) => {
    setBuscando(true);
    setEstadoBusqueda("idle");

    try {
      let searchId: number | undefined;
      let actualizarUrl = true;

      if (typeof maybeIdOrActualizar === "number") {
        searchId = maybeIdOrActualizar;
      } else if (typeof maybeIdOrActualizar === "boolean") {
        actualizarUrl = maybeIdOrActualizar;
      }

      if (typeof searchId === "number") {
        if (searchId < latestSearchIdRef.current) {
          setBuscando(false);
          return;
        }
        latestSearchIdRef.current = searchId;
      } else {
        latestSearchIdRef.current += 1;
      }

      setSearchTerm(termino);
      setSearchResults(resultados);
      if (actualizarUrl) actualizarURL(termino);

      setEstadoBusqueda("success");
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setEstadoBusqueda("error");
    } finally {
      setBuscando(false);
    }
  };
  
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults(allJobs);
    setFiltrosAplicados(false);
    actualizarURL("");
     setTimeout(() => setSortBy("Fecha (Reciente)"), 0);
  };

  // NUEVO HANDLER PARA LIMPIAR FILTROS
  const handleClearFilters = () => {
    setFiltrosAplicados(false);
    setFiltersNoResults(false);
    setUsuariosFiltrados([]);
    setModoVista("jobs");
    setSearchResults(allJobs);
    setSortBy("Fecha (Reciente)");  // Asegurar que se muestren todos los jobs
  };

  const navigateToDetails = (job: Job) => {
    // Redirigir a la página de detalles usando el id
    if (job.id) {
      router.push(`/alquiler/${job.id}`);
    } else {
      alert("No se encontró el ID del usuario/trabajo.");
    }
  };

  // ---------------- Lógica para determinar qué mostrar ----------------
  // SOLUCIÓN: Cambiar la condición para que solo muestre "sin resultados" cuando realmente hay filtros activos
  const mostrarSinResultadosFiltros = filtrosAplicados && 
                                    modoVista === "jobs" && 
                                    usuariosFiltrados.length === 0 &&
                                    filtersNoResults; // Agregar esta condición

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-10 border-l-4 border-blue-600 pl-4 tracking-wide">
          Ofertas de Trabajo
        </h1>

        {/* Búsqueda */}
        <BusquedaAutocompletado
          onSearch={handleSearchResults}
          datos={allJobs}
          placeholder="Buscar por nombre parcial o encargado..."
          valorInicial={urlQuery}
        />

        {/* Filtros */}
        <div className="mt-6">
          <FiltrosForm
            onResults={(usuarios: UsuarioResumen[]) => {
              console.log("🔄 Actualizando resultados filtrados:", usuarios.length);
              setUsuariosFiltrados(usuarios);
              setModoVista(usuarios.length > 0 ? "usuarios" : "jobs");
              setFiltrosAplicados(true);
            }}
            onFilterNoResults={(noResults: boolean) => {
              console.log("🚫 Actualizando estado de sin resultados:", noResults);
              setFiltersNoResults(noResults);
              setFiltrosAplicados(true);
            }}
            onClearFilters={handleClearFilters} // NUEVA PROP
            sort={sortBy}
            setSort={setSortBy}
            opcionesOrdenamiento={opcionesOrdenamiento}
            totalItems={totalItems}
            disabled={
              (modoVista === "jobs" && jobsToDisplay.length === 0) ||
              (modoVista === "usuarios" && usuariosFiltrados.length === 0)
            }
          />
        </div>

        {/* Vista Usuarios */}
        {modoVista === "usuarios" ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              Resultados de Profesionales
            </h2>
            {usuariosFiltrados.length > 0 ? (
              <>
                <div className="UserProfilesContainer space-y-6">
                    {usuariosFiltrados.map((usuario) => (
                      <UserProfileCard
                        key={usuario.id_usuario}
                        usuario={usuario}
                        onContactClick={() => {
                          console.log('Navegando a usuario:', usuario);
                          router.push(`/alquiler/${usuario.id_usuario}`);
                        }}
                      />
                    ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Se encontraron {usuariosFiltrados.length} profesionales
                </p>
              </>
            ) : (
              <p className="text-center text-gray-600 mt-4">
                No se encontraron profesionales con los filtros seleccionados
              </p>
            )}
            <button
              onClick={() => { handleClearFilters(); router.back(); }}
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Volver a ofertas
            </button>
          </section>
        ) : (
          // Vista Jobs
          <section className="mt-10">
            {isLoading ? (
              <p className="text-center text-gray-500 text-lg">Cargando ofertas...</p>
            ) : (
              <>
                <div className="text-xl text-blue-700 font-semibold mb-6">
                  {mostrarSinResultadosFiltros 
                    ? "No se encontraron ofertas" 
                    : `Mostrando ${currentItems.length} de ${totalItems} Ofertas Disponibles`}
                </div>

                <div className="results-area mt-6">
                  {buscando ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                      <p className="mt-2 text-lg text-gray-600">Buscando resultados para &quot;{searchTerm}&quot;...</p>
                    </div>
                  ) : mostrarSinResultadosFiltros ? (
                    // CASO 1: Filtros aplicados sin resultados - NO MOSTRAR TARJETAS
                    <div className="text-center py-8">
                      <p className="text-xl text-gray-600 mb-4">
                        No se encontraron ofertas con los filtros seleccionados
                      </p>
                      <button 
                        onClick={handleClearFilters}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ver todas las ofertas
                      </button>
                    </div>
                  ) : currentItems.length === 0 ? (
                    // CASO 2: Sin filtros aplicados pero no hay resultados
                    <div className="text-center py-8">
                      <p className="text-xl text-gray-600 mb-4">
                        {(searchTerm && estadoBusqueda === "success")
                          ? `No se encontraron resultados para "${searchTerm}"`
                          : "No hay ofertas de trabajo disponibles en este momento."}
                      </p>
                      {searchTerm && (
                        <button 
                          onClick={handleClearSearch} 
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Ver todas las ofertas
                        </button>
                      )}
                    </div>
                  ) : (
                    // CASO 3: Hay resultados para mostrar (por defecto o con búsqueda)
                    <>
                      <div className="space-y-6">
                        {currentItems.map((job, index) => (
                          <JobCard
                            key={`${job.title}-${index}`}
                            {...job}
                            onViewDetails={() => navigateToDetails(job)}
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
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

// Componente principal exportado
export default function BusquedaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BusquedaContent />
    </Suspense>
  );
}