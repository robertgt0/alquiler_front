'use client';

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import JobCard from "./components/jobCard";
import { UserProfileCard } from "./components/UserProfileCard";
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
  const [modoVista, setModoVista] = useState<"jobs" | "usuarios">("jobs");

  const itemsPerPage = 10;

  // DEBUG: imprimir muestra de items en cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // se ejecuta solo en cliente
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
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Nombre Z-A":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
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
        // Ordenar por número de servicios disponibles como aproximación de calificación
        sorted.sort((a, b) => {
          const servA = a.servicios?.filter(s => s.disponible)?.length || 0;
          const servB = b.servicios?.filter(s => s.disponible)?.length || 0;
          return servB - servA;
        });
        break;
    }
    return sorted;
  };

  // ---------------- Filtrado y ordenamiento ----------------
  const jobsToDisplay = useMemo(() => {
    let data = searchResults.length > 0 ? searchResults : allJobs;

    const termino = searchTerm.trim().toLowerCase();
    if (termino) {
      // Dividir la búsqueda en palabras
      const palabras = termino.split(/\s+/).filter(Boolean);

      data = data.filter((job) => {
        const title = job.title.toLowerCase();
        const company = job.company.toLowerCase();

        // Retorna true si alguna palabra coincide en title o company
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

    // Actualizar la URL sin recargar la página
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });

    console.log('🔗 [URL] Actualizando URL:', newUrl);
  };

  // ---------------- Limpiar búsqueda ----------------
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(allJobs);
    }
  }, [searchTerm, allJobs]);

  // ---------------- Handlers ----------------
  const handleSearchResults = async (
    termino: string,
    resultados: Job[],
    actualizarUrl: boolean = true
  ) => {
    setBuscando(true);
    setEstadoBusqueda("idle");

    try {
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
    actualizarURL(""); // limpia el parámetro ?q=
  };



  const handleViewDetails = (job: Job) => {
    console.log("Ver detalles de:", job);
  };

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
              setUsuariosFiltrados(usuarios);
              setModoVista(usuarios.length > 0 ? "usuarios" : "jobs");
            }}
            sort={sortBy}
            setSort={setSortBy}
            search={searchTerm}
            setSearch={setSearchTerm}
            opcionesOrdenamiento={opcionesOrdenamiento}
            totalItems={totalItems}
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {usuariosOrdenados.map((u) => (
                    <div key={u._id}>
                      <UserProfileCard 
                        usuario={u}
                        onContactClick={() => {
                          console.log("Contactar a:", u.nombre);
                          // Aquí puedes agregar la lógica para contactar al profesional
                        }}
                      />
                    </div>
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
            <a
              href="/alquiler/paginacion"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Volver a ofertas
            </a>
          </section>
        ) : (
          /* Vista Jobs */
            /* Vista Jobs */
            <section className="mt-10">
              {isLoading ? (
                <p className="text-center text-gray-500 text-lg">Cargando ofertas...</p>
              ) : (
                <>
                  <div className="text-xl text-blue-700 font-semibold mb-6">
                    Mostrando {currentItems.length} de {totalItems} Ofertas Disponibles
                  </div>

                  <div className="results-area mt-6">
                    {/* Mostrar loading mientras busca */}
                    {buscando ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                        <p className="mt-2 text-lg text-gray-600">
                            Buscando resultados para  &quot;{searchTerm}&quot;...
                        </p>
                      </div>
                    ) : currentItems.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-xl text-gray-600 mb-4">
                          {searchTerm && estadoBusqueda === "success"
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
                      <>
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