'use client';

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import JobCard from "./components/jobCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";
import { Job } from "./types/job";
import BusquedaAutocompletado from "../Busqueda/busquedaAutocompletado";
import FiltrosForm from "../Feature/Componentes/FiltroForm";
import { UsuarioResumen } from "../Feature/Types/filtroType";

// Definir tipo para estado de búsqueda
type EstadoBusqueda = "idle" | "loading" | "success" | "error" | "no-results";

export default function BusquedaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") || "";

  // ---------------- Estados principales ----------------
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [estadoBusqueda, setEstadoBusqueda] = useState<EstadoBusqueda>("idle");
  const [error, setError] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [mensajeNoResultados, setMensajeNoResultados] = useState("");

  const [sortBy, setSortBy] = useState("Fecha (Reciente)");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioResumen[]>([]);
  const [modoVista, setModoVista] = useState<"jobs" | "usuarios">("jobs");

  const itemsPerPage = 10;

  // ---------------- Opciones de ordenamiento ----------------
  const opcionesOrdenamiento = [
    "Fecha (Reciente)",
    "Nombre A-Z",
    "Nombre Z-A",
    "Mayor Calificación (⭐)",
  ];

  // ---------------- Función para actualizar URL ----------------
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

  // ---------------- Funciones de ordenamiento ----------------
  const ordenarItems = (opcion: string, lista: Job[]) => {
    if (!lista || lista.length === 0) return [];

    console.log('🔄 [ORDENAMIENTO] Ordenando', lista.length, 'jobs por:', opcion);

    const sorted = [...lista];
    switch (opcion) {
      case "Nombre A-Z":
        sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "Nombre Z-A":
        sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      case "Fecha (Reciente)":
        sorted.sort((a, b) => {
          const dateA = new Date(a.postedDate).getTime();
          const dateB = new Date(b.postedDate).getTime();
          return dateB - dateA; // Más reciente primero
        });
        break;
      case "Mayor Calificación (⭐)":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Por defecto, fecha reciente
        sorted.sort((a, b) => {
          const dateA = new Date(a.postedDate).getTime();
          const dateB = new Date(b.postedDate).getTime();
          return dateB - dateA;
        });
    }

    console.log('🔄 [ORDENAMIENTO] Resultados ordenados:', sorted.length);
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
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return sorted;
  };

  // ---------------- SOLUCIÓN 4: BÚSQUEDA SIMPLIFICADA ----------------
  const handleSearch = async (searchTerm: string, resultados?: Job[], actualizarUrl: boolean = true) => {
    console.log('🔍 [BUSQUEDA-PAGE] Iniciando búsqueda:', searchTerm);
    console.log('🔍 [BUSQUEDA-PAGE] Resultados del autocompletado:', resultados?.length);

    setError(null);
    setSearchTerm(searchTerm);
    setBuscando(true);
    setMensajeNoResultados("");

    try {
      let resultadosFinales: Job[] = [];

      // 🔥 SOLUCIÓN 4: Solo usar resultados del autocompletado para búsquedas con texto
      if (resultados && resultados.length > 0) {
        // ✅ CASO 1: Tenemos resultados del autocompletado (backend)
        resultadosFinales = resultados;
        console.log('✅ [BUSQUEDA-PAGE] Usando resultados del autocompletado:', resultadosFinales.length);
      } else if (searchTerm.trim() === "") {
        // ✅ CASO 2: Búsqueda vacía - mostrar todos los jobs
        resultadosFinales = allJobs;
        console.log('🔄 [BUSQUEDA-PAGE] Búsqueda vacía, mostrando todos los jobs:', allJobs.length);
      } else {
        // ✅ CASO 3: Hay término pero NO hay resultados del autocompletado
        console.log('⏳ [BUSQUEDA-PAGE] Esperando resultados del autocompletado...');
        resultadosFinales = []; // No mostrar nada hasta tener resultados válidos
      }

      // Ordenar resultados
      const resultadosOrdenados = ordenarItems(sortBy, resultadosFinales);
      setSearchResults(resultadosOrdenados);

      // 🔥 LÓGICA MEJORADA PARA MENSAJES
      if (searchTerm.trim() !== "") {
        if (resultadosOrdenados.length === 0) {
          // NO hay resultados para el término de búsqueda
          const mensaje = `No se encontraron resultados para "${searchTerm}"`;
          setMensajeNoResultados(mensaje);
          setEstadoBusqueda("no-results");
          console.log('❌ [BUSQUEDA-PAGE] No hay resultados:', mensaje);
        } else {
          // Sí hay resultados
          setMensajeNoResultados("");
          setEstadoBusqueda("success");
          console.log('✅ [BUSQUEDA-PAGE] Resultados encontrados:', resultadosOrdenados.length);
        }
      } else {
        // Búsqueda vacía
        setMensajeNoResultados("");
        setEstadoBusqueda("idle");
      }

      // Actualizar URL y paginación
      if (actualizarUrl) {
        actualizarURL(searchTerm);
      }
      handlePageChange(1);

    } catch (error) {
      console.error('❌ [BUSQUEDA-PAGE] Error:', error);
      setError('Error al realizar la búsqueda');
      setMensajeNoResultados("");
      setEstadoBusqueda("error");
    } finally {
      setBuscando(false);
    }
  };

  // Handler para limpiar búsqueda
  const handleClearSearch = () => {
    console.log('🧹 Limpiando búsqueda...');
    setSearchTerm("");
    setError(null);
    setEstadoBusqueda("idle");
    setMensajeNoResultados("");

    // Mostrar todos los jobs ordenados
    const todosOrdenados = ordenarItems(sortBy, allJobs);
    setSearchResults(todosOrdenados);

    // Reiniciar paginación
    handlePageChange(1);

    // 🔥 LIMPIAR URL
    actualizarURL("");
  };

  // ---------------- Filtrado y ordenamiento ----------------
  const jobsToDisplay = useMemo(() => {
    // Usamos searchResults que ya viene filtrado y ordenado de handleSearch
    return searchResults.length > 0 ? searchResults : ordenarItems(sortBy, allJobs);
  }, [searchResults, allJobs, sortBy]);

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
 //
  // ---------------- Cargar trabajos ----------------
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        console.log('📥 [LOAD] Cargando jobs iniciales...');

        const jobs = await getJobs();
        console.log('📥 [LOAD] Jobs cargados:', jobs.length);

        setAllJobs(jobs);

        // Verificar si hay query en URL
        const queryFromURL = searchParams.get('q');
        console.log('🔍 [LOAD] queryFromURL:', queryFromURL);

        if (queryFromURL && queryFromURL.trim() !== "") {
          // Hay búsqueda en URL - establecer término
          console.log('✅ [LOAD] Query encontrada en URL:', queryFromURL);
          setSearchTerm(queryFromURL);
          // 🔥 IMPORTANTE: No ejecutar búsqueda automática - esperar al autocompletado
          setEstadoBusqueda("loading");
        } else {
          // No hay búsqueda - mostrar todos ordenados
          console.log('✅ [LOAD] Mostrando todos los jobs ordenados');
          const jobsOrdenados = ordenarItems(sortBy, jobs);
          setSearchResults(jobsOrdenados);
          setEstadoBusqueda("idle");
        }

      } catch (error) {
        console.error("Error cargando trabajos:", error);
        setError('Error al cargar los trabajos');
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  // ---------------- Re-ordenar cuando cambia el criterio ----------------
  useEffect(() => {
    console.log('🔄 [EFECTO-ORDEN] Criterio cambiado:', sortBy);
    console.log('🔄 [EFECTO-ORDEN] Jobs actuales:', searchResults.length);

    if (searchResults.length > 0) {
      const resultadosOrdenados = ordenarItems(sortBy, searchResults);
      setSearchResults(resultadosOrdenados);
      console.log('🔄 [EFECTO-ORDEN] Re-ordenamiento completado');
    } else if (allJobs.length > 0 && estadoBusqueda === "idle") {
      const resultadosOrdenados = ordenarItems(sortBy, allJobs);
      setSearchResults(resultadosOrdenados);
    }
  }, [sortBy]);

  // ---------------- Handlers ----------------
  const handleViewDetails = (job: Job) => {
    console.log("Ver detalles de:", job);
  };

  // Handler para compatibilidad con FiltrosForm
  const handleSearchResults = (termino: string, resultados: Job[]) => {
    handleSearch(termino, resultados);
  };

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-10 border-l-4 border-blue-600 pl-4 tracking-wide">
          {modoVista === "jobs"
            ? searchTerm && estadoBusqueda === "success"
              ? `Resultados para "${searchTerm}"`
              : "Ofertas de Trabajo Disponibles"
            : "Profesionales Filtrados"}
        </h1>

        {/* Búsqueda */}
        <BusquedaAutocompletado
          onSearch={handleSearch}
          datos={allJobs}
          placeholder="Buscar por especialidad, servicio o nombre del fixer..."
          valorInicial={searchTerm}
          campoBusqueda="all"
          maxResultados={50}
          mostrarHistorial={true}
        />

        {/* Mensajes de estado de búsqueda */}
        {searchTerm && estadoBusqueda === "loading" && (
          <p className="text-lg text-gray-600 mt-2">Buscando "{searchTerm}"...</p>
        )}

        {/* 🔥 MENSAJE DE ERROR */}
        {estadoBusqueda === "error" && error && (
          <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md mt-2">
            {error}
          </div>
        )}

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
        {modoVista === "usuarios" && usuariosFiltrados.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              Resultados de Profesionales
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {usuariosOrdenados.map((u) => (
                <div
                  key={u._id}
                  className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-lg text-gray-900">{u.nombre}</h3>
                </div>
              ))}
            </div>
            <button
              onClick={() => setModoVista("jobs")}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Volver a ofertas
            </button>
          </section>
        ) : (
          /* 🔥 VISTA JOBS - CON MENSAJE EN EL ÁREA DE TARJETAS */
          <section className="mt-10">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">Cargando ofertas de trabajo...</p>
              </div>
            ) : buscando ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-lg text-gray-600">Buscando resultados para "{searchTerm}"...</p>
              </div>
            ) : estadoBusqueda === "no-results" ? (
              // 🔥 MENSAJE DE NO RESULTADOS EN EL ÁREA DE TARJETAS
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {mensajeNoResultados}
                </p>
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Ver todas las ofertas
                </button>
              </div>
            ) : currentItems.length === 0 && !searchTerm ? (
              // No hay jobs disponibles en general
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay ofertas disponibles
                </h3>
                <p className="text-gray-600">
                  No hay ofertas de trabajo disponibles en este momento.
                </p>
              </div>
            ) : (
              // Mostrar resultados normales
              <>
                <div className="text-xl text-blue-700 font-semibold mb-6">
                  {searchTerm && estadoBusqueda === "success"
                    ? `Mostrando ${currentItems.length} de ${totalItems} Ofertas Disponibles para "${searchTerm}"`
                    : `Mostrando ${currentItems.length} de ${totalItems} Ofertas Disponibles`
                  }
                </div>

                <div className="space-y-6">
                  {currentItems.map((job, index) => (
                    <JobCard
                      key={`${job.title}-${job.company}-${index}-${currentPage}`}
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
          </section>
        )}
      </main>
    </div>
  );
}