'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { Job } from "../paginacion/types/job";
import "./busqueda.css";
import { Trash2 } from "lucide-react";


type EstadoSugerencias = "idle" | "loading" | "error" | "success";
type EstadoBusqueda = "idle" | "loading" | "success" | "error";

interface BusquedaAutocompletadoProps {
    onSearch: (searchTerm: string, resultados: Job[]) => void;
    datos?: Job[];
    placeholder?: string;
    valorInicial?: string;
    campoBusqueda?: keyof Job | "all";
    maxResultados?: number;
    mostrarHistorial?: boolean;
    apiConfig?: {
        endpoint: string;
        campoResultado: string;
    };
}

interface EspecialidadBackend {
    id_especialidad: number;
    nombre: string;
    fecha_asignacion?: string;
}

interface ApiResponse {
    success: boolean;
    data: EspecialidadBackend[];
    message?: string;
    count?: number;
    searchTerm?: string;
}

class BusquedaService {
    private static API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    static async searchJobsInBackend(query: string, jobsReales: Job[], endpoint?: string): Promise<Job[]> {
        try {
            console.log('🔍 [SERVICE] Buscando especialidades en backend:', query);
            console.log('📊 [SERVICE] Jobs reales disponibles:', jobsReales.length);

            if (!query.trim()) {
                return [];
            }

            // 1. Buscar especialidades en el backend para sugerencias
            const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/autocomplete`;
            const response = await fetch(`${apiEndpoint}?q=${encodeURIComponent(query)}&limit=50`);

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data: ApiResponse = await response.json();
            console.log('📦 [SERVICE] Respuesta del backend (sugerencias):', data);

            // 2. ✅ BÚSQUEDA MEJORADA: Buscar en múltiples campos
            const queryLower = query.toLowerCase().trim();
            console.log('🎯 Buscando en múltiples campos con:', queryLower);

            const jobsFiltrados = jobsReales.filter(job => {
                // Buscar en especialidad (string)
                const enEspecialidad = job.especialidad &&
                    job.especialidad.toLowerCase().includes(queryLower);

                // Buscar en array de especialidades
                const enEspecialidadesArray = job.especialidades &&
                    job.especialidades.some(esp =>
                        esp.nombre.toLowerCase().includes(queryLower)
                    );

                // Buscar en otros campos relevantes
                const enService = job.service &&
                    job.service.toLowerCase().includes(queryLower);

                const enTitle = job.title &&
                    job.title.toLowerCase().includes(queryLower);

                const enCompany = job.company &&
                    job.company.toLowerCase().includes(queryLower);

                const coincide = enEspecialidad || enEspecialidadesArray || enService || enTitle || enCompany;

                if (coincide) {
                    console.log(`✅ COINCIDENCIA:`, {
                        especialidad: job.especialidad,
                        especialidades: job.especialidades,
                        title: job.title,
                        service: job.service
                    });
                }

                return coincide;
            });

            console.log('✅ Jobs encontrados:', jobsFiltrados.length);

            // 3. DEBUG: Mostrar resultados
            if (jobsFiltrados.length > 0) {
                console.log('📋 Jobs que coinciden:');
                jobsFiltrados.forEach(job => {
                    console.log(`   - ${job.title} | ${job.company} | Especialidad: ${job.especialidad}`);
                });
            } else {
                console.log('❌ No se encontraron jobs');
                // Mostrar debug info
                const debugInfo = jobsReales.slice(0, 3).map(job => ({
                    title: job.title,
                    especialidad: job.especialidad,
                    especialidades: job.especialidades
                }));
                console.log('🔍 Debug primeros 3 jobs:', debugInfo);
            }

            return jobsFiltrados;

        } catch (error) {
            console.error('❌ [SERVICE] Error en búsqueda backend:', error);
            throw error;
        }
    }

    private static validarCaracteres(texto: string): boolean {
        const validCharsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]+$/;
        return validCharsRegex.test(texto);
    }

    static async getHistorial(endpoint?: string): Promise<string[]> {
        try {
            const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/history`;
            const response = await fetch(apiEndpoint);

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    return data.data || data.historial || [];
                }
            }
            return [];
        } catch (error) {
            console.error('❌ [SERVICE] Error obteniendo historial:', error);
            return [];
        }
    }

    static async clearHistorial(endpoint?: string): Promise<boolean> {
        try {
            const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/history`;
            const response = await fetch(apiEndpoint, {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                return data.success || false;
            }
            return false;
        } catch (error) {
            console.error('❌ [SERVICE] Error limpiando historial:', error);
            return false;
        }
    }

    static async getAutocompleteSuggestions(query: string, endpoint?: string): Promise<string[]> {
        try {
            console.log('🔍 [SUGERENCIAS] Buscando sugerencias para:', query);

            if (!this.validarCaracteres(query)) {
                return [];
            }

            const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/autocomplete`;
            const response = await fetch(
                `${apiEndpoint}?q=${encodeURIComponent(query)}&limit=6`
            );

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data: ApiResponse = await response.json();
            console.log('🔍 [SUGERENCIAS] Respuesta:', data);

            if (data.success && data.data && Array.isArray(data.data)) {
                const sugerencias = data.data
                    .map((item: EspecialidadBackend) => item.nombre)
                    .filter((nombre: string) => nombre && nombre.trim())
                    .slice(0, 6);

                console.log('🔍 [SUGERENCIAS] Sugerencias:', sugerencias);
                return sugerencias;
            }

            console.log('⚠️ [SUGERENCIAS] No hay sugerencias');
            return [];
        } catch (error) {
            console.error('❌ [SERVICE] Error obteniendo sugerencias:', error);
            return [];
        }
    }
}

export default function BusquedaAutocompletado({
    onSearch,
    datos = [],
    placeholder = "Buscar por especialidad...",
    valorInicial = "",
    campoBusqueda = "all",
    maxResultados = 50,
    mostrarHistorial = true,
    apiConfig
}: BusquedaAutocompletadoProps) {
    const [query, setQuery] = useState(valorInicial);
    const [sugerencias, setSugerencias] = useState<string[]>([]);
    const [estadoSugerencias, setEstadoSugerencias] = useState<EstadoSugerencias>("idle");
    const [estadoBusqueda, setEstadoBusqueda] = useState<EstadoBusqueda>("idle");
    const [mensaje, setMensaje] = useState("");
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [mostrarHistorialLocal, setMostrarHistorialLocal] = useState(false);
    const [resultados, setResultados] = useState<Job[]>([]);
    const [historial, setHistorial] = useState<string[]>([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminoBusquedaAnterior = useRef("");

    const caracteresValidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]*$/;

    // Sincronizar con valorInicial
    useEffect(() => {
        console.log('🔄 [AUTOCOMPLETADO] valorInicial actualizado:', valorInicial);
        if (valorInicial !== query) {
            setQuery(valorInicial);
        }
    }, [valorInicial]);

    // Cargar historial del backend
    useEffect(() => {
        if (!mostrarHistorial) return;

        const cargarHistorialBackend = async () => {
            try {
                setCargandoHistorial(true);
                const terminos = await BusquedaService.getHistorial(apiConfig?.endpoint);
                setHistorial(terminos);
                console.log('📚 [HISTORIAL] Historial cargado:', terminos);
            } catch (error) {
                console.error('Error cargando historial del backend:', error);
                // Fallback a localStorage
                try {
                    const stored = localStorage.getItem("historialBusquedas");
                    if (stored) {
                        setHistorial(JSON.parse(stored));
                    }
                } catch (localError) {
                    console.error('Error con localStorage:', localError);
                }
            } finally {
                setCargandoHistorial(false);
            }
        };

        cargarHistorialBackend();
    }, [mostrarHistorial, apiConfig?.endpoint]);

    // Debug: verificar jobs con especialidades
    useEffect(() => {
        console.log('🔍 [DEBUG] Total jobs:', datos.length);
        console.log('🔍 [DEBUG] Jobs con especialidad string:', datos.filter(job => job.especialidad).length);
        console.log('🔍 [DEBUG] Jobs con especialidades array:', datos.filter(job => job.especialidades).length);

        const jobsConEspecialidad = datos.filter(job => job.especialidad);
        if (jobsConEspecialidad.length > 0) {
            console.log('🔍 [DEBUG] Ejemplos de especialidad string:',
                jobsConEspecialidad.slice(0, 3).map(job => job.especialidad)
            );
        }
    }, [datos]);

    const limpiarHistorialBackend = useCallback(async () => {
        try {
            const success = await BusquedaService.clearHistorial(apiConfig?.endpoint);
            if (success) {
                setHistorial([]);
                setMostrarHistorialLocal(false);
                localStorage.removeItem("historialBusquedas");
                console.log('✅ Historial limpiado correctamente');
            } else {
                console.error('❌ Error al limpiar historial en el backend');
                setMensaje("Error al limpiar el historial");
            }
        } catch (error) {
            console.error('❌ Error limpiando historial:', error);
            setMensaje("Error de conexión al limpiar historial");
        }
    }, [apiConfig?.endpoint]);

    const normalizarTexto = useCallback((texto: string): string => {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[´,'"“"‘’,\-]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }, []);

    const buscarTrabajosLocal = useCallback((texto: string, jobs: Job[]): Job[] => {
        if (!texto.trim()) return jobs;

        const textoNormalizado = normalizarTexto(texto);

        return jobs.filter(job => {
            if (campoBusqueda === "all") {
                // Búsqueda en especialidad (string)
                const enEspecialidad = job.especialidad &&
                    normalizarTexto(job.especialidad).includes(textoNormalizado);

                // Búsqueda en array de especialidades
                const enEspecialidadesArray = job.especialidades &&
                    job.especialidades.some(esp =>
                        normalizarTexto(esp.nombre).includes(textoNormalizado)
                    );

                return (
                    enEspecialidad ||
                    enEspecialidadesArray ||
                    (job.service && normalizarTexto(job.service).includes(textoNormalizado)) ||
                    (job.title && normalizarTexto(job.title).includes(textoNormalizado)) ||
                    (job.company && normalizarTexto(job.company).includes(textoNormalizado)) ||
                    (job.location && normalizarTexto(job.location).includes(textoNormalizado))
                );
            } else if (campoBusqueda === "especialidad") {
                // Búsqueda específica en especialidad (string y array)
                const enEspecialidad = job.especialidad &&
                    normalizarTexto(job.especialidad).includes(textoNormalizado);

                const enEspecialidadesArray = job.especialidades &&
                    job.especialidades.some(esp =>
                        normalizarTexto(esp.nombre).includes(textoNormalizado)
                    );

                return enEspecialidad || enEspecialidadesArray;
            } else {
                // Buscar en campo específico
                const campoValor = job[campoBusqueda];
                return campoValor && normalizarTexto(String(campoValor)).includes(textoNormalizado);
            }
        }).slice(0, maxResultados);
    }, [normalizarTexto, campoBusqueda, maxResultados]);
    
    const guardarEnHistorial = useCallback((texto: string) => {
        if (!mostrarHistorial) return;

        const textoNormalizado = texto.trim();
        if (!textoNormalizado) return;

        const nuevoHistorial = Array.from(
            new Set([textoNormalizado, ...historial])
        ).slice(0, 10);

        setHistorial(nuevoHistorial);
        try {
            localStorage.setItem("historialBusquedas", JSON.stringify(nuevoHistorial));
        } catch (error) {
            console.error("Error guardando historial en localStorage:", error);
        }
    }, [historial, mostrarHistorial]);

    const buscarSugerenciasBackend = useCallback(async (texto: string): Promise<string[]> => {
        try {
            if (!caracteresValidos.test(texto)) {
                return [];
            }

            console.log('🔍 [SUGERENCIAS] Buscando sugerencias para:', texto);

            const sugerenciasBackend = await BusquedaService.getAutocompleteSuggestions(texto, apiConfig?.endpoint);
            console.log('🔍 [SUGERENCIAS] Sugerencias del backend:', sugerenciasBackend);

            if (sugerenciasBackend.length > 0) {
                return sugerenciasBackend;
            }

            // Fallback a búsqueda local para sugerencias
            console.log('🔄 [SUGERENCIAS] Usando fallback a búsqueda local para sugerencias');
            const resultadosLocales = buscarTrabajosLocal(texto, datos);
            const terminosUnicos = Array.from(
                new Set(
                    resultadosLocales
                        .map(job => {
                            // ACTUALIZADO: Extraer especialidad para sugerencias
                            const especialidad = job.especialidad ? [job.especialidad] : [];
                            if (campoBusqueda === "all") {
                                return [...especialidad, job.service, job.title, job.company].filter(Boolean);
                            } else if (campoBusqueda === "especialidad") {
                                return especialidad;
                            } else {
                                return [job[campoBusqueda]];
                            }
                        })
                        .flat()
                        .filter(Boolean)
                        .map(term => String(term))
                )
            );
            return terminosUnicos.slice(0, 6);

        } catch (error) {
            console.error('❌ [SUGERENCIAS] Error conectando al backend:', error);

            // Fallback completo a búsqueda local
            console.log('🔄 [SUGERENCIAS] Usando fallback local por error');
            const resultadosLocales = buscarTrabajosLocal(texto, datos);
            const terminosUnicos = Array.from(
                new Set(
                    resultadosLocales
                        .map(job => {
                            // ACTUALIZADO: Extraer especialidad para sugerencias
                            const especialidad = job.especialidad ? [job.especialidad] : [];
                            if (campoBusqueda === "all") {
                                return [...especialidad, job.service, job.title, job.company].filter(Boolean);
                            } else if (campoBusqueda === "especialidad") {
                                return especialidad;
                            } else {
                                return [job[campoBusqueda]];
                            }
                        })
                        .flat()
                        .filter(Boolean)
                        .map(term => String(term))
                )
            );
            return terminosUnicos.slice(0, 6);
        }
    }, [buscarTrabajosLocal, datos, campoBusqueda, apiConfig?.endpoint]);

    const ejecutarBusquedaCompleta = useCallback(async (texto: string, guardarEnHistorialFlag: boolean = true) => {
        const textoLimpio = texto.trim();

        // Validaciones
        if (textoLimpio.length > 80) {
            setMensaje("La búsqueda no puede exceder 80 caracteres");
            setEstadoBusqueda("error");
            return;
        }

        if (!caracteresValidos.test(textoLimpio)) {
            setMensaje("Solo se permiten caracteres alfabéticos y los especiales: ´ , - , comilla simple y comilla doble");
            setEstadoBusqueda("error");
            return;
        }

        if (textoLimpio.length < 2) {
            setMensaje("La búsqueda debe tener al menos 2 caracteres");
            setEstadoBusqueda("error");
            return;
        }

        console.log('✅ [BÚSQUEDA COMPLETA] Ejecutando búsqueda para:', textoLimpio);

        setEstadoBusqueda("loading");
        setBusquedaRealizada(true);
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);

        terminoBusquedaAnterior.current = textoLimpio;

        if (guardarEnHistorialFlag && mostrarHistorial) {
            guardarEnHistorial(textoLimpio);
        }

        try {
            console.log('🔍 [BÚSQUEDA] Buscando jobs reales por especialidad...');

            // BUSCAR JOBS REALES RELACIONADOS CON LA ESPECIALIDAD
            const resultadosBackend = await BusquedaService.searchJobsInBackend(textoLimpio, datos, apiConfig?.endpoint);

            console.log('🔍 [BÚSQUEDA] Resultados backend (jobs reales):', resultadosBackend);

            if (resultadosBackend.length > 0) {
                // USAR jobs reales encontrados por especialidad
                console.log('✅ [BÚSQUEDA] Usando jobs reales relacionados con la especialidad');
                setResultados(resultadosBackend);
                setEstadoBusqueda("success");
                onSearch(textoLimpio, resultadosBackend);
            } else {
                // Fallback a búsqueda local tradicional
                console.log('🔄 [BÚSQUEDA] No hay jobs por especialidad, usando búsqueda local tradicional');
                const resultadosLocales = buscarTrabajosLocal(textoLimpio, datos);
                setResultados(resultadosLocales);
                setEstadoBusqueda(resultadosLocales.length > 0 ? "success" : "success");
                onSearch(textoLimpio, resultadosLocales);
            }

        } catch (error) {
            console.error("Error en búsqueda backend, usando búsqueda local:", error);

            if (error instanceof Error) {
                setMensaje(error.message);
            } else {
                setMensaje("Error al conectar con el servidor");
            }

            setEstadoBusqueda("error");

            // Fallback a búsqueda local
            const resultadosLocales = buscarTrabajosLocal(textoLimpio, datos);
            console.log('🔍 [BÚSQUEDA] Resultados locales:', resultadosLocales);
            setResultados(resultadosLocales);
            onSearch(textoLimpio, resultadosLocales);
        }
    }, [datos, onSearch, buscarTrabajosLocal, guardarEnHistorial, mostrarHistorial, apiConfig?.endpoint]);

    const seleccionarSugerencia = useCallback(async (texto: string) => {
        setQuery(texto);
        setSugerencias([]);
        setMensaje("");
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);
        await ejecutarBusquedaCompleta(texto, true);
    }, [ejecutarBusquedaCompleta]);

    const ejecutarBusqueda = useCallback(async () => {
        await ejecutarBusquedaCompleta(query, true);
    }, [query, ejecutarBusquedaCompleta]);

    const limpiarBusqueda = useCallback(() => {
        setQuery("");
        setSugerencias([]);
        setMensaje("");
        setEstadoSugerencias("idle");
        setEstadoBusqueda("idle");
        setResultados([]);
        setMostrarSugerencias(false);

        if (historial.length > 0 && mostrarHistorial) {
            setMostrarHistorialLocal(true);
        } else {
            setMostrarHistorialLocal(false);
        }

        setBusquedaRealizada(false);
        terminoBusquedaAnterior.current = "";

        onSearch("", datos);
        inputRef.current?.focus();
    }, [datos, onSearch, historial, mostrarHistorial]);

    const manejarKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            ejecutarBusqueda();
        } else if (e.key === 'Escape') {
            setMostrarSugerencias(false);
            setMostrarHistorialLocal(false);
            inputRef.current?.blur();
        }
    }, [ejecutarBusqueda]);

    // Efecto para búsqueda en tiempo real y sugerencias
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        const texto = query.trim();

        const actualizarVisualizacion = () => {
            const textoLimpio = texto.trim();

            if (!textoLimpio) {
                setSugerencias([]);
                setMensaje("");
                setEstadoSugerencias("idle");
                setMostrarSugerencias(false);

                // Mostrar historial cuando no hay texto
                if (historial.length > 0 && !busquedaRealizada && mostrarHistorial) {
                    setMostrarHistorialLocal(true);
                }
                return;
            }

            if (!caracteresValidos.test(texto)) {
                console.log('❌ [BLOQUEO] Carácter inválido detectado');
                setMensaje("Solo se permiten caracteres alfabéticos y los especiales: ´ , - , comilla simple y comilla doble");
                setSugerencias([]);
                setEstadoSugerencias("error");
                setMostrarSugerencias(true);
                setMostrarHistorialLocal(false);
                return;
            }

            if (textoLimpio.length >= 2 && !busquedaRealizada) {
                setMostrarHistorialLocal(false);
                setMostrarSugerencias(true);
            } else {
                setSugerencias([]);
                setMensaje("");
                setEstadoSugerencias("idle");
                setMostrarSugerencias(false);
                setMostrarHistorialLocal(false);
            }
        };

        actualizarVisualizacion();

        if (texto.length >= 2 && !busquedaRealizada) {
            setEstadoSugerencias("loading");

            debounceRef.current = setTimeout(async () => {
                try {
                    console.log('🔍 [EFFECT] Buscando sugerencias para:', texto);
                    const sugerenciasBackend = await buscarSugerenciasBackend(texto);
                    console.log('🔍 [EFFECT] Sugerencias encontradas:', sugerenciasBackend);

                    setSugerencias(sugerenciasBackend);
                    setEstadoSugerencias(sugerenciasBackend.length > 0 ? "success" : "success");

                    if (sugerenciasBackend.length === 0) {
                        setMensaje(`No se encontraron especialidades para "${texto}"`);
                    } else {
                        setMensaje("");
                    }

                } catch (error) {
                    console.error('❌ [EFFECT] Error buscando sugerencias:', error);
                    setEstadoSugerencias("error");
                    setMensaje("Error al buscar especialidades");
                    setSugerencias([]);
                }
            }, 300);
        } else {
            setSugerencias([]);
            setEstadoSugerencias("idle");
            setMensaje("");
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, busquedaRealizada, historial.length, buscarSugerenciasBackend, mostrarHistorial]);

    // Efecto para cerrar sugerencias al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setMostrarSugerencias(false);
                setMostrarHistorialLocal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="busqueda-container" ref={containerRef}>
            <div className="contenedor-busqueda">
                <div className="busqueda-barra">
                    <Search className="icono-busqueda" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => {
                            const nuevoValor = e.target.value;
                            setQuery(nuevoValor);

                            if (nuevoValor === "") {
                                setBusquedaRealizada(false);
                                setEstadoBusqueda("idle");
                                onSearch("", datos);
                                if (historial.length > 0 && mostrarHistorial) {
                                    setMostrarHistorialLocal(true);
                                }
                            }

                            if (busquedaRealizada && nuevoValor !== terminoBusquedaAnterior.current) {
                                setBusquedaRealizada(false);
                                setEstadoBusqueda("idle");
                            }
                        }}
                        onKeyDown={manejarKeyDown}
                        onFocus={() => {
                            if (!busquedaRealizada) {
                                if (!query.trim() && historial.length > 0 && mostrarHistorial) {
                                    setMostrarHistorialLocal(true);
                                }
                                if (query.length >= 2) {
                                    setMostrarSugerencias(true);
                                }
                            }
                        }}
                        maxLength={80}
                        className="busqueda-input"
                    />
                    {query && (
                        <button
                            className="btn-limpiar"
                            onClick={limpiarBusqueda}
                            type="button"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <button
                        className="btn-buscar"
                        onClick={ejecutarBusqueda}
                        disabled={!query.trim() || query.trim().length < 2}
                        type="button"
                    >
                        {estadoBusqueda === "loading" ? "Buscando..." : "Buscar"}
                    </button>
                </div>

                <div className={`contador-caracteres ${query.length > 70 ? 'alerta' : ''}`}>
                    {query.length}/80 caracteres
                </div>

                {estadoBusqueda === "error" && mensaje && (
                    <div className="mensaje-error-global">
                        {mensaje}
                    </div>
                )}

                {!busquedaRealizada && (
                    <>
                        {mostrarHistorialLocal && historial.length > 0 && (
                            <ul className="caja-sugerencias">
                                <li className="sugerencias-header">
                                    Búsquedas recientes
                                    {cargandoHistorial && (
                                        <span className="cargando-indicador">Cargando...</span>
                                    )}
                                </li>

                                {historial.map((item, i) => (
                                    <li
                                        key={i}
                                        className="item-historial"
                                        onClick={() => seleccionarSugerencia(item)}
                                    >
                                        <Clock className="icono-historial" size={16} />
                                        {item}
                                    </li>
                                ))}

                                <li
                                    className="item-limpiar-todo"
                                    onClick={limpiarHistorialBackend}
                                >
                                    <Trash2 size={14} />
                                    Limpiar historial
                                </li>
                            </ul>
                        )}

                        {mostrarSugerencias && query.length >= 2 && (
                            <>
                                {estadoSugerencias === "loading" && (
                                    <div className="caja-sugerencias cargando">
                                        <div className="spinner"></div>
                                        Buscando especialidades...
                                    </div>
                                )}

                                {estadoSugerencias !== "loading" && (
                                    <ul className="caja-sugerencias">
                                        <li className="sugerencias-header">
                                            Especialidades sugeridas
                                        </li>
                                        {sugerencias.map((s, i) => (
                                            <li key={i} onClick={() => seleccionarSugerencia(s)}>
                                                <Search className="icono-sugerencia" size={16} />
                                                {s}
                                            </li>
                                        ))}
                                        {sugerencias.length === 0 && mensaje && (
                                            <li className="mensaje-sugerencia">
                                                <Search className="icono-sugerencia" size={16} />
                                                {mensaje}
                                            </li>
                                        )}
                                    </ul>
                                )}

                                {estadoSugerencias === "error" && mensaje && (
                                    <ul className="caja-sugerencias">
                                        <li className="mensaje-error">
                                            <Search className="icono-sugerencia" size={16} />
                                            {mensaje}
                                        </li>
                                    </ul>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}