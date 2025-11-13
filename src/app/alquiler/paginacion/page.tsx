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

// Componente de fallback simple
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="ml-4 text-lg text-gray-600">Cargando...</p>
  </div>
);

// Componente principal
function BusquedaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados iniciales del URL
  const urlQuery = searchParams.get("q") || "";
  // Utilizamos `useMemo` para obtener el `urlPage` y evitar problemas de renderizado
  const urlPage = useMemo(() => searchParams.get("page"), [searchParams]);
  // const urlSort = searchParams.get("sort"); // no usado en el código

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [estadoBusqueda, setEstadoBusqueda] = useState<"idle" | "success" | "error">("idle");
  const [errorCaracteres, setErrorCaracteres] = useState<string>("");

  const [sortBy, setSortBy] = useState("Fecha (Reciente)");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioResumen[]>([]);
  type ModoVista = "jobs" | "usuarios";
  const [modoVista, setModoVista] = useState<ModoVista>("jobs");
  const [filtersNoResults, setFiltersNoResults] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  // const latestSearchIdRef = useRef(0); // No usado, se eliminó
  const itemsPerPage = 10;
  const [busquedaAvanzadaAbierta, setBusquedaAvanzadaAbierta] = useState(false);

  // --- Funciones de utilidad ---

  const opcionesOrdenamiento = [
    "Fecha (Reciente)",
    "Nombre A-Z",
    "Nombre Z-A",
    "Mayor Calificación (⭐)",
  ];

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
        // Asegurar que postedDate es una cadena o número válido para new Date
        sorted.sort(
          (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
        break;
      case "Mayor Calificación (⭐)":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Evitar un caso default vacío, usar el caso más común
        sorted.sort(
          (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
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
        sorted.sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0));
        break;
      default:
        // Mantener el orden actual si la opción no está definida para usuarios
        return lista;
    }
    return sorted;
  };

  const actualizarURL = (term: string, page?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Si se proporciona el término, actualiza 'q'
    if (term.trim()) {
      params.set('q', term.trim());
    } else {
      params.delete('q');
    }

    // Si se proporciona la página, actualiza 'page', sino la elimina
    if (page && page > 1) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };
  
  // --- Efectos de Estado ---

  // Efecto para cargar los trabajos (una sola vez)
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const jobs = await getJobs();
        setAllJobs(jobs);
        setSearchResults(jobs); // Inicializa searchResults con todos los trabajos
      } catch (error) {
        console.error("Error cargando trabajos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  // Efecto para manejar la paginación y el término de búsqueda inicial del URL
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    let currentPage = 1;

    // 1. Manejo de la página del URL y sessionStorage
    if (urlPage) {
      const pageNum = parseInt(urlPage, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        // Corrección: Si es inválido, forzar la página 1 y actualizar el URL
        currentParams.set('page', '1');
        currentPage = 1;
        router.replace(`?${currentParams.toString()}`, { scroll: false });
      } else {
        currentPage = pageNum;
        sessionStorage.setItem('lastPage', urlPage);
      }
    } else if (sessionStorage.getItem('lastPage')) {
      // Corrección: Leer de sessionStorage solo si no hay 'page' en URL
      const lastPage = sessionStorage.getItem('lastPage');
      const pageNum = parseInt(lastPage || '1', 10);
      if (pageNum > 1) {
        currentParams.set('page', lastPage || '1');
        currentPage = pageNum;
        router.replace(`?${currentParams.toString()}`, { scroll: false });
      }
    }

    // 2. Aplicar el término de búsqueda inicial del URL si existe
    if (urlQuery && allJobs.length > 0 && !filtrosAplicados) {
      handleSearchResults(urlQuery, allJobs, false); // No actualiza el URL, solo el estado
    }
    
    // 3. Forzar la página si es necesario (manejar el hook de paginación)
    if (currentPage > 1) {
      // Se necesita una forma de comunicar la página inicial al hook usePagination
      // Esto se manejará en el hook usePagination o en el estado local de la paginación.
      // Por ahora, el hook de paginación manejará su propia inicialización basada en los items
    }

    // Nota: El ordenamiento podría inicializarse aquí si urlSort estuviera en uso
    
  }, [urlQuery, allJobs, filtrosAplicados, router, urlPage]); // Dependencias importantes

  // --- Lógica de Filtrado y Ordenamiento ---
  
  // Función de búsqueda y normalización de texto
  const normalizarBusqueda = (lista: Job[], term: string) => {
    if (!term || !term.trim()) return lista;

    const normalizar = (texto: string) =>
      texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const palabras = normalizar(term).split(/\s+/).filter(Boolean);

    return lista.filter((job) => {
      const title = normalizar(job.title || "");
      const company = normalizar(job.company || "");
      const servicio = normalizar(job.service || "");
      
      // La búsqueda debe pasar por TODAS las palabras si están separadas por espacios
      return palabras.every(
        (palabra) =>
          title.includes(palabra) ||
          company.includes(palabra) ||
          servicio.includes(palabra)
      );
    });
  };

  // Jobs para mostrar (Lógica centralizada de búsqueda y ordenamiento)
  const jobsToDisplay = useMemo(() => {
    let data = [...allJobs]; // Usar una copia
    
    // 1. Filtrar por búsqueda avanzada (solo si se aplicaron filtros avanzados)
    if (filtrosAplicados && modoVista === 'jobs') {
        data = searchResults; // searchResults tiene los resultados de filtros avanzados
    } 
    // 2. Filtrar por búsqueda de texto (solo si no se está aplicando un filtro avanzado y hay un término)
    else if (searchTerm && searchTerm.trim()) {
      data = normalizarBusqueda(data, searchTerm);
    }
    
    // 3. Ordenar
    return ordenarItems(sortBy, data);
    
  }, [searchResults, allJobs, sortBy, searchTerm, filtrosAplicados, modoVista]);
  
  // Usuarios ordenados
  const usuariosOrdenados = useMemo(
    () => ordenarUsuarios(sortBy, usuariosFiltrados),
    [sortBy, usuariosFiltrados]
  );
  
  // --- Hook de Paginación ---
  
  // Ajuste: El hook de paginación necesita saber la página inicial
  const initialPage = useMemo(() => {
    const pageNum = parseInt(urlPage || '1', 10);
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [urlPage]);
  
  // Uso del hook de paginación
  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems,
  } = usePagination(jobsToDisplay, itemsPerPage);
  
  // Efecto para actualizar la URL con el número de página después de la paginación
  useEffect(() => {
    // Solo actualiza si la página actual no es la inicial del URL
    if (currentPage !== initialPage) {
        actualizarURL(searchTerm, currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); // Solo depende de currentPage para evitar bucles.



  // --- Handlers ---

  const handleAdvancedFilters = (filtros: any) => {
  console.log(" Filtros aplicados:", filtros);

  const filtrados = allJobs.filter((job: Job) => {
    let match = true;

    // Tipo de servicio
    if (filtros.tipoServicio) {
      match &&=
        job.title?.toLowerCase().includes(filtros.tipoServicio.toLowerCase()) ||
        job.service?.toLowerCase().includes(filtros.tipoServicio.toLowerCase());
    }

    // Zona
    if (filtros.zona) {
      match &&= job.location?.toLowerCase().includes(filtros.zona.toLowerCase());
    }

    // Precio (rango salarial)
    if (filtros.precioMin || filtros.precioMax) {
      const salaryRangeText = job.salaryRange || "0";
      const numeros = salaryRangeText.match(/\d+(\.\d+)?/g) || ["0"];
      const precioNum = parseFloat(numeros[0]);

      if (filtros.precioMin) match &&= precioNum >= filtros.precioMin;
      if (filtros.precioMax) match &&= precioNum <= filtros.precioMax;
    }

    // Horario o tipo de empleo
    if (filtros.horario) {
      match &&= job.employmentType?.toLowerCase() === filtros.horario.toLowerCase();
    }

    // Disponibilidad (si existe en tus datos, ej. "Full time" o "Part time")
    if (filtros.disponibilidad) {
      match &&= job.employmentType?.toLowerCase().includes(
        filtros.disponibilidad.toLowerCase()
      );
    }

    // Experiencia (asumiendo que existe campo `experienceYears` o similar)
    if (filtros.experiencia) {
      const experienciaNum = parseInt((job as any).experienceYears || "0", 10);
      match &&= experienciaNum >= parseInt(filtros.experiencia, 10);
    }

    // Fecha (asumiendo que el filtro tiene un rango o una fecha mínima)
    if (filtros.fechaDesde || filtros.fechaHasta) {
      const fechaJob = new Date(job.postedDate);
      if (filtros.fechaDesde) {
        const fechaMin = new Date(filtros.fechaDesde);
        match &&= fechaJob >= fechaMin;
      }
      if (filtros.fechaHasta) {
        const fechaMax = new Date(filtros.fechaHasta);
        match &&= fechaJob <= fechaMax;
      }
    }

    return match;
  });

  setFiltrosAplicados(true);
  setSearchResults(filtrados);
  setModoVista("jobs");
  setFiltersNoResults(filtrados.length === 0);
  handlePageChange(1);
};


  const handleSearchResults = (
    termino: string,
    // *Error Corregido: El argumento `resultados` no debería usarse directamente si se hace la lógica de filtrado en `jobsToDisplay`
    // Solo actualizamos el `searchTerm` y dejamos que `jobsToDisplay` se encargue del filtrado.
    _resultados: Job[], // Cambiado para ignorar el resultado de autocompletado si la lógica está en useMemo
    maybeIdOrActualizar?: number | boolean
  ) => {
    // *Error Corregido: La validación de caracteres especiales debe hacerse aquí
    const tieneCaracteresProblema = /[@#$%^&*_+=[\]{}|\\<>]/.test(termino);
    
    setBuscando(true);
    setEstadoBusqueda("idle");
    setErrorCaracteres("");
    
    let actualizarUrl = true;
    if (typeof maybeIdOrActualizar === "boolean") {
        actualizarUrl = maybeIdOrActualizar;
    }

    try {
      if (tieneCaracteresProblema) {
        setErrorCaracteres(`No se pueden realizar búsquedas con caracteres especiales como @, #, $, etc. en "${termino}"`);
        setEstadoBusqueda("error");
        setSearchResults([]); // Limpiar resultados para mostrar el error
        setSearchTerm(termino);
        handlePageChange(1);
      } else {
        // *Corrección: La lógica del filtro de texto se maneja en `jobsToDisplay`
        setSearchTerm(termino);
        setSearchResults(allJobs); // Restablecer searchResults al set completo para que `jobsToDisplay` haga el filtro de texto
        setErrorCaracteres("");
        
        // *Importante: Si se aplica una nueva búsqueda, se eliminan los filtros avanzados
        setFiltrosAplicados(false); 
        
        // Reinicia la paginación a la página 1
        handlePageChange(1);

        if (actualizarUrl) actualizarURL(termino, 1); // Actualiza URL y va a la página 1
        setEstadoBusqueda("success");
      }
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
    setErrorCaracteres("");
    actualizarURL("", 1); // Limpiar término y reiniciar paginación
    handlePageChange(1); // Asegurar que la paginación local se restablezca
    setTimeout(() => setSortBy("Fecha (Reciente)"), 0);
  };

  const handleClearFilters = () => {
    setFiltrosAplicados(false);
    setFiltersNoResults(false);
    setUsuariosFiltrados([]);
    setModoVista("jobs");
    // *Corrección: Los resultados vuelven a ser `allJobs` para que `jobsToDisplay` funcione correctamente
    setSearchResults(allJobs); 
    setErrorCaracteres("");
    setSortBy("Fecha (Reciente)");
    handlePageChange(1); // Restablecer la página a 1
    actualizarURL(searchTerm, 1); // Mantener el término de búsqueda si existe, pero restablecer la página
  };
  
  const handleViewDetails = (id: string | number) => {
    // Guarda la página actual en sessionStorage antes de navegar
    sessionStorage.setItem('lastPage', String(currentPage));
    router.push(`/alquiler/${id}`);
  };

  // --- Lógica de Renderizado ---
  
  const mostrarSinResultadosFiltros =
    filtrosAplicados &&
    modoVista === "jobs" &&
    filtersNoResults; // Corregido: `usuariosFiltrados.length === 0` es redundante si `modoVista` es "jobs"

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
            valorInicial={urlQuery}
          />
        )}

        <div className="mt-8">
          <BusquedaAvanzada
            onAplicarFiltros={handleAdvancedFilters}
            onLimpiarFiltros={handleClearFilters}
            onToggle={setBusquedaAvanzadaAbierta}
          />
        </div>

        {!busquedaAvanzadaAbierta && (
          <div className="mt-6">
            <FiltrosForm
              onResults={(usuarios: UsuarioResumen[]) => {
                setUsuariosFiltrados(usuariosOrdenados); // Corrección: Usar el estado ordenado
                setModoVista("jobs"); // Siempre mostrar vista de jobs con JobCard
                setFiltrosAplicados(true);
                setFiltersNoResults(usuarios.length === 0); // Establecer filtersNoResults si no hay usuarios
              }}
              onFilterNoResults={(noResults: boolean) => {
                setFiltersNoResults(noResults);
                setFiltrosAplicados(true);
                if (noResults) {
                  setUsuariosFiltrados([]);
                }
              }}
              onClearFilters={handleClearFilters}
              sort={sortBy}
              setSort={setSortBy}
              opcionesOrdenamiento={opcionesOrdenamiento}
              totalItems={modoVista === "jobs" ? totalItems : usuariosOrdenados.length}
              disabled={
                (modoVista === "jobs" && jobsToDisplay.length === 0 && !isLoading) ||
                (modoVista === "usuarios" && usuariosFiltrados.length === 0)
              }
            />
          </div>
        )}

        {/* Vista usuarios */}
        {modoVista === "usuarios" ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              Resultados de Profesionales
            </h2>
            {usuariosOrdenados.length > 0 ? ( 
              <>
                <div className="UserProfilesContainer space-y-6">
                  {usuariosOrdenados.map((usuario: UsuarioResumen) => (
                    <UserProfileCard
                      key={usuario.id_usuario}
                      usuario={usuario}
                      onContactClick={() =>
                        router.push(`/alquiler/${usuario.id_usuario}`)
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Se encontraron {usuariosOrdenados.length} profesionales
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
                  {mostrarSinResultadosFiltros ? (
                    "No se encontraron ofertas"
                  ) : (
                    (() => {
                      // Calcula el rango mostrado: desde - hasta
                      const desde = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
                      const hasta = desde === 0 ? 0 : desde + currentItems.length - 1;
                      return `Mostrando ${desde}${hasta ? ` - ${hasta}` : ''} de ${totalItems} Ofertas Disponibles`;
                    })()
                  )}
                </div>

                <div className="results-area mt-6">
                  {buscando ? (
                    // ... Lógica de Buscando ...
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                      <p className="mt-2 text-lg text-gray-600">
                        Buscando resultados para &quot;{searchTerm}&quot;...
                      </p>
                    </div>
                  ) : mostrarErrorCaracteres ? (
                    // ... Lógica de Error Caracteres ...
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
                    // ... Lógica de Sin Resultados Filtros ...
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
                  ) : currentItems.length === 0 && (searchTerm.trim() || filtrosAplicados) ? (
                    // ... Lógica de Sin Resultados de Búsqueda/Filtro ...
                    <div className="text-center py-8">
                      <p className="text-xl text-gray-600 mb-4">
                        {searchTerm && estadoBusqueda === "success"
                          ? `No se encontraron resultados para "${searchTerm}"`
                          : "No hay ofertas de trabajo disponibles con los criterios actuales."}
                      </p>
                      {(searchTerm || filtrosAplicados) && (
                        <button
                          onClick={searchTerm ? handleClearSearch : handleClearFilters}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Ver todas las ofertas
                        </button>
                      )}
                    </div>
                  ) : (
                    // ... Lógica de Resultados y Paginación ...
                    <>
                      <div className="space-y-6">
                        {currentItems.map((job, index) => (
                          <JobCard
                            key={`${job.title}-${index}-${job.id}`} // Agregué job.id para una key más única
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