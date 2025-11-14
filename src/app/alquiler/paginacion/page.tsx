'use client';

import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import JobCard from "./components/jobCard";
import UserProfileCard from "./components/UserProfileCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";
import { Job } from "../../../types/job";
import BusquedaAutocompletado from "../Busqueda/busquedaAutocompletado";
import FiltrosForm from "../Feature/Componentes/FiltroForm";
import { UsuarioResumen } from "../Feature/Types/filtroType";
import BusquedaAvanzada from "../BusquedaAvanzada/BusquedaAvanzada";

// Componente de carga
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center p-8 min-h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Cargando búsqueda...</span>
    </div>
  );
}

// Componente principal
function BusquedaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const urlPage = searchParams.get("page");
  const urlSort = searchParams.get("sort");

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [estadoBusqueda, setEstadoBusqueda] = useState<"idle" | "success" | "error">("idle");
  const [errorCaracteres, setErrorCaracteres] = useState<string>("");
  const [estadoInicial, setEstadoInicial] = useState<Job[]>([]);
  const [isFromURLLoad, setIsFromURLLoad] = useState(false); // 🔹 Nuevo estado
  // 🔹 Efecto para manejar la página desde URL o sessionStorage
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);

    if (urlPage) {
      const pageNum = parseInt(urlPage, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        currentParams.set('page', '1');
        router.replace(`?${currentParams.toString()}`, { scroll: false });
      }
    } else if (sessionStorage.getItem('lastPage')) {
      const lastPage = sessionStorage.getItem('lastPage');
      currentParams.set('page', lastPage || '1');
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    }

    if (urlPage) {
      sessionStorage.setItem('lastPage', urlPage);
    }
  }, [urlPage, router]);

  const [sortBy, setSortBy] = useState("Fecha (Reciente)");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioResumen[]>([]);
  type ModoVista = "jobs" | "usuarios";
  const [modoVista, setModoVista] = useState<ModoVista>("jobs");
  const [filtersNoResults, setFiltersNoResults] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const latestSearchIdRef = useRef(0);
  const itemsPerPage = 10;

  const opcionesOrdenamiento = [
    "Fecha (Reciente)",
    "Nombre A-Z",
    "Nombre Z-A",
    "Mayor Calificación (⭐)",
  ];
const parseFechaDDMMYYYY = (fechaStr: string) => {
  if (!fechaStr) return new Date(0); // fallback
  const partes = fechaStr.split('/').map(Number);
  if (partes.length !== 3) return new Date(0);
  const [day, month, year] = partes;
  return new Date(year, month - 1, day); // mes en JS es 0-index
};


  const ordenarItems = (opcion: string, lista: Job[]) => {
    const sorted = [...lista];
    switch (opcion) {
      case "Nombre A-Z":
        sorted.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
        break;
      case "Nombre Z-A":
        sorted.sort((a, b) => (b.company || "").localeCompare(a.company || ""));
        break;
      case "Fecha (Reciente)":
  sorted.sort(
    (a, b) => parseFechaDDMMYYYY(b.postedDate).getTime() - parseFechaDDMMYYYY(a.postedDate).getTime()
  );
  break;
      case "Mayor Calificación (⭐)":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return sorted;
  };

  // 🔹 Función para normalizar texto
  const normalizar = (texto: string) =>
    texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 🔹 AGREGA este estado nuevo (junto con los otros useState)
  const [hasInitialized, setHasInitialized] = useState(false);

  // 🔹 REEMPLAZA el useEffect actual con este:
  useEffect(() => {
    const loadInitialData = async () => {
      // Evitar ejecución múltiple
      if (hasInitialized) return;

      try {
        setIsLoading(true);
        const jobs = await getJobs();
        setAllJobs(jobs);
        setEstadoInicial(jobs);

        // 🔥 NUEVO: SIEMPRE ejecutar búsqueda local si hay término en URL
        if (urlQuery && urlQuery.trim() !== "") {
          console.log("🔍 Búsqueda desde URL (recarga):", urlQuery);
          setIsFromURLLoad(true);

          // 🔥 EJECUTAR BÚSQUEDA LOCAL INMEDIATA con los datos recién cargados
          const resultadosLocales = performSearch(urlQuery, jobs);
          setSearchResults(resultadosLocales);
          setSearchTerm(urlQuery);
          setEstadoBusqueda("success");

          console.log(`✅ ${resultadosLocales.length} resultados locales encontrados`);
        } else {
          setSearchResults(jobs);
        }

      } catch (error) {
        console.error("Error cargando trabajos:", error);
        const jobs = await getJobs();
        setAllJobs(jobs);
        setSearchResults(jobs);
        setEstadoInicial(jobs);
      } finally {
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    loadInitialData();
  }, []);

  // 🔹 MODIFICA la función performSearch para que sea más precisa
  const performSearch = (termino: string, baseData: Job[] = allJobs): Job[] => {
    if (termino.trim() === "") {
      setSearchResults(baseData);
      return baseData;
    }

    // 🔥 MISMA NORMALIZACIÓN que BusquedaAutocompletado
    const normalizarBusqueda = (texto: string) => {
      return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[´'"]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
    };

    const queryNormalizado = normalizarBusqueda(termino);
    const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

    if (tokens.length === 0) {
      setSearchResults([]);
      return [];
    }

    // 🔥 ALGORITMO MEJORADO: búsqueda más flexible pero manteniendo orden
    const resultados = baseData.filter(job => {
      const tituloNormalizado = job.title ? normalizarBusqueda(job.title) : "";
      const empresaNormalizada = job.company ? normalizarBusqueda(job.company) : "";
      const serviciosNormalizados = job.service ? normalizarBusqueda(job.service) : "";

      const campos = [tituloNormalizado, empresaNormalizada, serviciosNormalizados];

      // 🔥 BÚSQUEDA FLEXIBLE: todos los tokens deben aparecer en algún campo (no necesariamente en orden exacto)
      return tokens.every(token =>
        campos.some(campoTexto =>
          campoTexto && campoTexto.includes(token)
        )
      );
    });

    console.log(`🔍 [LOCAL-SEARCH] "${termino}" → ${resultados.length} resultados`);
    return resultados;
  };

  const handleAdvancedFilters = (filtros: any) => {
    console.log(" Filtros aplicados:", filtros);

    // 🔹 Siempre partir de allJobs
    let baseData = allJobs;

    // Aplicar filtros avanzados
    let filtrados = baseData.filter((job) => {
      let match = true;

      if (filtros.tipoServicio)
        match &&= job.title.toLowerCase().includes(filtros.tipoServicio.toLowerCase());
      if (filtros.zona)
        match &&= job.location?.toLowerCase().includes(filtros.zona.toLowerCase());
      if (filtros.precioMin || filtros.precioMax) {
        const precioNum = Number(job.salaryRange.replace(/[^0-9.-]+/g, ""));
        if (filtros.precioMin) match &&= precioNum >= filtros.precioMin;
        if (filtros.precioMax) match &&= precioNum <= filtros.precioMax;
      }
      if (filtros.horario)
        match &&= job.employmentType.toLowerCase() === filtros.horario.toLowerCase();

      return match;
    });

    // 🔹 Reaplicar búsqueda desde URL sobre los resultados filtrados
    if (urlQuery.trim() !== "") {
      const palabras = normalizar(urlQuery).split(/\s+/).filter(Boolean);
      filtrados = filtrados.filter((job) => {
        const title = normalizar(job.title || "");
        const company = normalizar(job.company || "");
        const servicio = normalizar(job.service || "");
        return palabras.some(
          (palabra) =>
            title.includes(palabra) || company.includes(palabra) || servicio.includes(palabra)
        );
      });
    }

    setFiltrosAplicados(true);
    setSearchResults(filtrados);
    setModoVista("jobs");
    setFiltersNoResults(filtrados.length === 0);
  };

  const [busquedaAvanzadaAbierta, setBusquedaAvanzadaAbierta] = useState(false);

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
        sorted.sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0));
        break;
    }
    return sorted;
  };

const jobsToDisplay = useMemo(() => {
  // Clonar para evitar mutaciones
  const data = [...searchResults];

  // 🔥 ORDENAR AQUÍ SIEMPRE ANTES DE PAGINAR
  const ordenados = ordenarItems(sortBy, data);
  const parseFechaDDMMYYYY = (fechaStr: string) => {
    if (!fechaStr) return new Date(0); // fallback
    const partes = fechaStr.split('/').map(Number);
    if (partes.length !== 3) return new Date(0);
    const [day, month, year] = partes;
    return new Date(year, month - 1, day);
  };

  console.log(
    "📌 Jobs ordenados por fecha:",
    ordenados.map(j => `${j.title} (${j.postedDate}) -> ${parseFechaDDMMYYYY(j.postedDate).toISOString()}`)
  );

  // 🔹 Logs para depuración
  console.log("📊 Ordenamiento aplicado:", sortBy);
  console.log(
  "📌 Jobs ordenados por fecha:",
  ordenados.map(j => `${j.title} (${j.postedDate})`)
);

  return ordenados;
}, [searchResults, sortBy]);




  const usuariosOrdenados = useMemo(
    () => ordenarUsuarios(sortBy, usuariosFiltrados),
    [sortBy, usuariosFiltrados]
  );

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems,
  } = usePagination(jobsToDisplay, itemsPerPage);

  const handleViewDetails = (id: string | number) => {
    router.push(`/alquiler/${id}`);
  };

  const actualizarURL = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    else params.delete('q');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  // 🔹 MODIFICA handleSearchResults para prevenir duplicación
  // 🔹 REEMPLAZA handleSearchResults con esta versión
  // 🔹 MODIFICA handleSearchResults para manejar mejor las búsquedas locales
  const handleSearchResults = (
    termino: string,
    resultados: Job[],
    maybeIdOrActualizar?: number | boolean
  ) => {
    // 🔹 PERMITIR limpieza incluso si es igual a URL
    if (termino.trim() === "") {
      console.log("🧹 Permitir limpieza de búsqueda");
      setBuscando(true);
      setEstadoBusqueda("idle");
      setErrorCaracteres("");

      // Restaurar estado inicial
      if (estadoInicial.length > 0) {
        setSearchResults(estadoInicial);
      } else {
        setSearchResults(allJobs);
      }

      setSearchTerm("");
      setFiltersNoResults(false);

      // Limpiar URL
      const params = new URLSearchParams(window.location.search);
      params.delete('q');
      router.replace(`?${params.toString()}`, { scroll: false });

      setBuscando(false);
      return;
    }

    // 🔹 Solo prevenir duplicación si NO es una limpieza y viene de URL
    // PERO permitir si es la primera carga
    if (hasInitialized && termino === urlQuery && isFromURLLoad && !isLoading) {
      console.log("🚫 Evitando búsqueda duplicada desde URL:", termino);
      setIsFromURLLoad(false);
      return;
    }

    setBuscando(true);
    setEstadoBusqueda("idle");
    setErrorCaracteres("");

    try {
      let actualizarUrl = true;
      if (typeof maybeIdOrActualizar === "boolean") {
        actualizarUrl = maybeIdOrActualizar;
      }

      const tieneCaracteresProblema = /[@#$%^&*_+=[\]{}|\\<>]/.test(termino);
      if (resultados.length === 0 && tieneCaracteresProblema) {
        setErrorCaracteres("");
        setSearchTerm(termino);
        setSearchResults([]);
        setEstadoBusqueda("success");
        setBuscando(false);
      } else {
        setErrorCaracteres("");
      }

      setSearchTerm(termino);
      setSearchResults(resultados);
      setFiltersNoResults(resultados.length === 0);

      if (actualizarUrl) actualizarURL(termino);
      setEstadoBusqueda("success");

    } catch (error) {
      console.error("Error en búsqueda:", error);
      setEstadoBusqueda("error");
    } finally {
      setBuscando(false);
      setIsFromURLLoad(false);
    }
  };

  // Agrega este estado con los otros useState
  const [resetBusquedaKey, setResetBusquedaKey] = useState(0);

  const handleClearSearch = () => {
    console.log("🧹 LIMPIANDO BÚSQUEDA COMPLETA - Restaurando estado inicial");

    // 🔹 FORZAR restauración sin importar las prevenciones
    if (estadoInicial.length > 0) {
      setSearchResults(estadoInicial);
      setAllJobs(estadoInicial);
    } else {
      // Recargar datos si es necesario
      console.log("🔄 Recargando datos...");
      getJobs().then(jobs => {
        setAllJobs(jobs);
        setSearchResults(jobs);
        setEstadoInicial(jobs);
      });
    }

    // 🔹 Resetear todos los estados
    setSearchTerm("");
    setFiltrosAplicados(false);
    setErrorCaracteres("");
    setUsuariosFiltrados([]);
    setModoVista("jobs");
    setFiltersNoResults(false);
    setIsFromURLLoad(false); // 🔹 Importante: resetear flag de URL

    // 🔹 Limpiar URL completamente
    const params = new URLSearchParams();
    params.set('page', '1');
    router.replace(`?${params.toString()}`, { scroll: false });

    // 🔹 Limpiar sessionStorage
    sessionStorage.removeItem('lastPage');

    // Resetear ordenamiento
    setTimeout(() => setSortBy("Fecha (Reciente)"), 0);

    console.log("✅ Búsqueda limpiada, estado inicial restaurado");
  };

  const handleClearFilters = () => {
    // Al limpiar filtros, mantener la búsqueda de URL si existe
    if (urlQuery && urlQuery.trim() !== "") {
      performSearch(urlQuery, allJobs);
    } else {
      setSearchResults(allJobs);
    }

    setFiltrosAplicados(false);
    setFiltersNoResults(false);
    setUsuariosFiltrados([]);
    setModoVista("jobs");
    setErrorCaracteres("");
    setSortBy("Fecha (Reciente)");
  };

  const mostrarSinResultadosFiltros =
    filtrosAplicados &&
    modoVista === "jobs" &&
    usuariosFiltrados.length === 0 &&
    filtersNoResults;

  const mostrarErrorCaracteres = errorCaracteres && !buscando;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-10 border-l-4 border-blue-600 pl-4 tracking-wide">
          Ofertas de Trabajo
        </h1>

        {!busquedaAvanzadaAbierta && (
          <BusquedaAutocompletado
            onSearch={handleSearchResults}
            datos={allJobs}
            placeholder="Buscar por nombre parcial o encargado..."
            valorInicial={urlQuery} // 🔹 Siempre usar la URL como valor inicial
          />
        )}

        <div className="mt-8">
          <BusquedaAvanzada
            onAplicarFiltros={handleAdvancedFilters}
            onLimpiarFiltros={() => handleClearFilters()}
            onToggle={(abierta: boolean) => setBusquedaAvanzadaAbierta(abierta)}
          />
        </div>

        {!busquedaAvanzadaAbierta && (
          <div className="mt-6">
            <FiltrosForm
              onResults={(usuarios: UsuarioResumen[]) => {
                setUsuariosFiltrados(usuarios);
                setModoVista(usuarios.length > 0 ? "usuarios" : "jobs");
                setFiltrosAplicados(true);
              }}
              onFilterNoResults={(noResults: boolean) => {
                setFiltersNoResults(noResults);
                setFiltrosAplicados(true);
              }}
              onClearFilters={handleClearFilters}
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
        )}

        {/* Resto del JSX permanece igual */}
        {/* Vista usuarios */}
        {modoVista === "usuarios" ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              Resultados de Profesionales
            </h2>
            {usuariosFiltrados.length > 0 ? (
              <>
                <div className="UserProfilesContainer space-y-6">
                  {usuariosFiltrados.map((usuario, index) => (
                    <UserProfileCard
                      key={`${usuario.id_usuario}-${index}`}
                      usuario={usuario}
                      onContactClick={() =>
                        router.push(`/alquiler/${usuario.id_usuario}`)
                      }
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
              onClick={() => {
                handleClearFilters();
                router.push('/alquiler');
              }}
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Volver a ofertas
            </button>
          </section>
        ) : (
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
                      <p className="mt-2 text-lg text-gray-600">
                        Buscando resultados para &quot;{searchTerm}&quot;...
                      </p>
                    </div>
                  ) : mostrarErrorCaracteres ? (
                    <div className="text-center py-8">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-xl">⚠️</span>
                          </div>
                        </div>
                        <p className="text-lg text-red-700 font-medium mb-2">
                          Caracteres especiales no permitidos
                        </p>
                        <p className="text-gray-600 mb-4">{errorCaracteres}</p>
                        <p className="text-sm text-gray-500 mb-4">
                          Por favor, usa solo letras, números y espacios para tu búsqueda.
                        </p>
                        <button
                          onClick={handleClearSearch}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Limpiar búsqueda
                        </button>
                      </div>
                    </div>
                  ) : mostrarSinResultadosFiltros ? (
                    <div className="text-center py-8">
                      <p className="text-xl text-gray-600 mb-4">
                        No se encontraron resultados
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ver todas las ofertas
                      </button>
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
                            onViewDetails={() => handleViewDetails(job.id)}
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

// Export principal
export default function BusquedaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BusquedaContent />
    </Suspense>
  );
}