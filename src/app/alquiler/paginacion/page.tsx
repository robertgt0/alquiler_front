'use client';

import JobCard from "./components/jobCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";
import BusquedaAutocompletado from "../Busqueda/busquedaAutocompletado";
import { useState, useEffect } from "react";
import { Job } from "./types/job";
import { useRouter, useSearchParams } from 'next/navigation';

// Importamos el componente de ordenamiento
import Ordenamiento from "../Ordenamiento/ordenamiento";

type EstadoBusqueda = "idle" | "loading" | "success" | "error";

export default function BusquedaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [trabajosParaMostrar, setTrabajosParaMostrar] = useState<Job[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [estadoBusqueda, setEstadoBusqueda] = useState<EstadoBusqueda>("idle");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Estado para el ordenamiento - usando los mismos criterios que el componente Ordenamiento
  const [criterioOrdenamiento, setCriterioOrdenamiento] = useState("Fecha (Reciente)");
  const [buscando, setBuscando] = useState(false);

  // 🔥 FUNCIÓN: Actualizar URL con parámetros de búsqueda
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

  // 🔥 FUNCIÓN: Ordenamiento local - SOLO LOS CRITERIOS DEL COMPONENTE ORDENAMIENTO
  const ordenarJobs = (opcion: string, lista: Job[]): Job[] => {
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
        // Si no tienes calificación en Job, puedes usar un valor por defecto o eliminar esta opción
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

  // Cargar trabajos al iniciar
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        console.log('📥 [LOAD] Cargando jobs iniciales...');

        const jobs = await getJobs();
        console.log('📥 [LOAD] Jobs cargados:', jobs.length);
        console.log('🔍 [LOAD] Primer job especialidad:', jobs[0]?.especialidad);
        console.log('🔍 [LOAD] Primer job especialidades array:', jobs[0]?.especialidades);
        
        // Debug: contar jobs con diferentes tipos de especialidades
        const conEspecialidadString = jobs.filter(job => job.especialidad).length;
        const conEspecialidadArray = jobs.filter(job => job.especialidades && job.especialidades.length > 0).length;
        console.log(`🔍 [LOAD] Jobs con especialidad string: ${conEspecialidadString}`);
        console.log(`🔍 [LOAD] Jobs con especialidades array: ${conEspecialidadArray}`);
        
        setAllJobs(jobs);

        // Verificar si hay query en URL
        const queryFromURL = searchParams.get('q');
        console.log('🔍 [LOAD] queryFromURL:', queryFromURL);

        if (queryFromURL && queryFromURL.trim() !== "") {
          // Hay búsqueda en URL - establecer término y ejecutar búsqueda automática
          console.log('✅ [LOAD] Query encontrada en URL:', queryFromURL);
          setTerminoBusqueda(queryFromURL);
          // Ejecutar búsqueda automática con el término de la URL
          handleSearch(queryFromURL, [], false); // false = no actualizar URL (ya está en URL)
        } else {
          // No hay búsqueda - mostrar todos ordenados
          console.log('✅ [LOAD] Mostrando todos los jobs ordenados');
          const jobsOrdenados = ordenarJobs(criterioOrdenamiento, jobs);
          setTrabajosParaMostrar(jobsOrdenados);
          setEstadoBusqueda("idle");
        }

      } catch (err) {
        console.error('❌ [LOAD] Error loading jobs:', err);
        setError('Error al cargar los trabajos');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [searchParams]);

  // 🔥 EFECTO: Re-ordenar cuando cambia el criterio de ordenamiento
  useEffect(() => {
    console.log('🔄 [EFECTO-ORDEN] Criterio cambiado:', criterioOrdenamiento);
    console.log('🔄 [EFECTO-ORDEN] Jobs actuales:', trabajosParaMostrar.length);

    if (trabajosParaMostrar.length > 0) {
      const resultadosOrdenados = ordenarJobs(criterioOrdenamiento, trabajosParaMostrar);
      setTrabajosParaMostrar(resultadosOrdenados);
      console.log('🔄 [EFECTO-ORDEN] Re-ordenamiento completado');
    }
  }, [criterioOrdenamiento]);

  // Hook de paginación
  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems
  } = usePagination(trabajosParaMostrar, itemsPerPage);

  // 🔥 Handler de búsqueda - ACTUALIZADO para buscar en ambos tipos de especialidades
  const handleSearch = async (searchTerm: string, resultados?: Job[], actualizarUrl: boolean = true) => {
    console.log('🔍 [BUSQUEDA-PAGE] Iniciando búsqueda:', searchTerm);
    console.log('🔍 [BUSQUEDA-PAGE] Resultados recibidos del autocompletado:', resultados?.length);
    console.log('🔍 [BUSQUEDA-PAGE] Actualizar URL:', actualizarUrl);

    setError(null);
    setTerminoBusqueda(searchTerm);
    setBuscando(true);

    try {
      let resultadosFinales: Job[] = [];

      // DECISIÓN: ¿Usar resultados del autocompletado o búsqueda local?
      if (resultados && resultados.length > 0) {
        // ✅ USAR resultados del autocompletado (backend)
        resultadosFinales = resultados;
        console.log('✅ [BUSQUEDA-PAGE] Usando resultados del autocompletado:', resultadosFinales.length);
        console.log('✅ [BUSQUEDA-PAGE] Ejemplo de especialidad en resultados:', resultadosFinales[0]?.especialidad);
      } else if (searchTerm.trim() === "") {
        // ✅ Búsqueda vacía - mostrar todos
        console.log('🔄 [BUSQUEDA-PAGE] Búsqueda vacía, mostrando todos los jobs');
        resultadosFinales = allJobs;
      } else {
        // ✅ Búsqueda local MEJORADA - busca en ambos tipos de especialidades
        console.log('🔄 [BUSQUEDA-PAGE] Realizando búsqueda local mejorada...');
        const terminoLower = searchTerm.toLowerCase();
        
        resultadosFinales = allJobs.filter(job => {
          // Buscar en especialidad (string)
          const enEspecialidadString = job.especialidad && 
            job.especialidad.toLowerCase().includes(terminoLower);
          
          // Buscar en array de especialidades
          const enEspecialidadesArray = job.especialidades && 
            job.especialidades.some(esp => 
              esp.nombre.toLowerCase().includes(terminoLower)
            );
          
          // Buscar en otros campos
          const enOtrosCampos = 
            job.title?.toLowerCase().includes(terminoLower) ||
            job.company?.toLowerCase().includes(terminoLower) ||
            job.service?.toLowerCase().includes(terminoLower) ||
            job.location?.toLowerCase().includes(terminoLower);

          const coincide = enEspecialidadString || enEspecialidadesArray || enOtrosCampos;
          
          if (coincide) {
            console.log(`✅ [BUSQUEDA-PAGE] Coincidencia local:`, {
              title: job.title,
              especialidad: job.especialidad,
              especialidades: job.especialidades,
              encontradoEn: [
                enEspecialidadString && 'especialidad-string',
                enEspecialidadesArray && 'especialidades-array',
                enOtrosCampos && 'otros-campos'
              ].filter(Boolean)
            });
          }
          
          return coincide;
        });
        
        console.log('✅ [BUSQUEDA-PAGE] Resultados búsqueda local mejorada:', resultadosFinales.length);
      }

      // 🔥 ORDENAR los resultados
      console.log('🔄 [BUSQUEDA-PAGE] Ordenando resultados...');
      const resultadosOrdenados = ordenarJobs(criterioOrdenamiento, resultadosFinales);

      // 🔥 ACTUALIZAR estado principal
      setTrabajosParaMostrar(resultadosOrdenados);
      console.log('✅ [BUSQUEDA-PAGE] Jobs para mostrar actualizados:', resultadosOrdenados.length);

      // 🔥 ACTUALIZAR URL si es necesario
      if (actualizarUrl) {
        actualizarURL(searchTerm);
      }

      // Actualizar estado de búsqueda
      if (searchTerm.trim() === "") {
        setEstadoBusqueda("idle");
        console.log('🔗 [BUSQUEDA-PAGE] Búsqueda limpiada');
      } else {
        setEstadoBusqueda("success");
        console.log('🔗 [BUSQUEDA-PAGE] Búsqueda completada');
      }

      // Reiniciar paginación
      handlePageChange(1);
      console.log('✅ [BUSQUEDA-PAGE] Búsqueda completada exitosamente');

    } catch (error) {
      console.error('❌ [BUSQUEDA-PAGE] Error en búsqueda:', error);
      setError('Error al realizar la búsqueda');

      // En caso de error, mostrar todos los jobs
      const todosOrdenados = ordenarJobs(criterioOrdenamiento, allJobs);
      setTrabajosParaMostrar(todosOrdenados);
    } finally {
      setBuscando(false);
    }
  };

  const handleViewDetails = (job: Job) => {
    console.log('Ver detalles de:', job);
    // Aquí puedes implementar la navegación a los detalles
  };

  // Handler para limpiar búsqueda - ACTUALIZADO para limpiar URL
  const handleClearSearch = () => {
    console.log('🧹 Limpiando búsqueda...');
    setTerminoBusqueda("");
    setError(null);
    setEstadoBusqueda("idle");

    // Mostrar todos los jobs ordenados
    const todosOrdenados = ordenarJobs(criterioOrdenamiento, allJobs);
    setTrabajosParaMostrar(todosOrdenados);

    // Reiniciar paginación
    handlePageChange(1);

    // 🔥 LIMPIAR URL
    actualizarURL("");
  };

  // Handler para cambio de ordenamiento desde el componente Ordenamiento
  const handleSortChange = (nuevoCriterio: string) => {
    console.log('🔄 [SORT-HANDLER] Cambiando criterio a:', nuevoCriterio);
    setCriterioOrdenamiento(nuevoCriterio);
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
              valorInicial={terminoBusqueda}
              campoBusqueda="all"
              mostrarHistorial={true}
            />
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
              valorInicial={terminoBusqueda}
              campoBusqueda="all"
              mostrarHistorial={true}
            />
          </div>

          <div className="text-center py-8">
            <p className="text-xl text-gray-600 mb-4">{error}</p>
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
            {terminoBusqueda && estadoBusqueda === "success"
              ? `Resultados para "${terminoBusqueda}"`
              : 'Ofertas de Trabajo Disponibles'
            }
          </h1>
          {terminoBusqueda && estadoBusqueda === "loading" && (
            <p className="text-lg text-gray-600">Buscando "{terminoBusqueda}"...</p>
          )}
        </div>

        {/* Búsqueda principal con el componente mejorado */}
        <div className="mb-6">
          <BusquedaAutocompletado
            onSearch={handleSearch}
            datos={allJobs}
            placeholder="Buscar por especialidad, servicio, empresa o ubicación..."
            valorInicial={terminoBusqueda}
            campoBusqueda="all"
            maxResultados={50}
            mostrarHistorial={true}
          />
        </div>

        {/* Información de resultados y ordenamiento */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-lg text-blue-600 font-medium">
              {buscando ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Buscando "{terminoBusqueda}"...
                </div>
              ) : (
                `Mostrando ${currentItems.length} de ${totalItems} Ofertas Disponibles${terminoBusqueda && estadoBusqueda === "success" ? ` para "${terminoBusqueda}"` : ''}`
              )}
            </div>

            {/* SOLO COMPONENTE DE ORDENAMIENTO - SIN SELECT ADICIONAL */}
            {!buscando && trabajosParaMostrar.length > 0 && (
              <Ordenamiento
                sortValue={criterioOrdenamiento}
                onSortChange={handleSortChange}
              />
            )}
          </div>

          {/* Indicador de ordenamiento activo */}
          {!buscando && trabajosParaMostrar.length > 0 && criterioOrdenamiento !== "Fecha (Reciente)" && (
            <div className="mt-2 text-sm text-gray-600">
              Ordenado por: <span className="font-medium">{criterioOrdenamiento}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
            <button
              onClick={handleClearSearch}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        <div className="results-area">
          {/* LOADING EN ÁREA DE RESULTADOS */}
          {buscando ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-lg text-gray-600">Buscando resultados para "{terminoBusqueda}"...</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600 mb-4">
                {terminoBusqueda && estadoBusqueda === "success"
                  ? `No se encontraron resultados para "${terminoBusqueda}"`
                  : 'No hay ofertas de trabajo disponibles en este momento'
                }
              </p>
              {terminoBusqueda && (
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver todas las ofertas
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {currentItems.map((job, index) => (
                <JobCard
                  key={`${job.title}-${job.company}-${index}-${currentPage}`}
                  {...job}
                  onViewDetails={() => handleViewDetails(job)}
                />
              ))}
            </div>
          )}
        </div>

        {!buscando && currentItems.length > 0 && totalPages > 1 && (
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