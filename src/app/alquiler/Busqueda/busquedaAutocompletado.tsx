"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { Job } from "../paginacion/types/job";
import "./busqueda.css";
import { Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type EstadoSugerencias = "idle" | "loading" | "error" | "success";
type EstadoBusqueda = "idle" | "loading" | "success" | "error";

interface BusquedaAutocompletadoProps {
    onSearch: (searchTerm: string, resultados: Job[]) => void;
    datos?: Job[];
    placeholder?: string;
    valorInicial?: string;
}

interface EspecialidadBackend {
    id_especialidad: number;
    nombre: string;
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

    static async searchJobsInBackend(query: string): Promise<Job[]> {
        try {
            console.log('🔍 [SERVICE] Buscando especialidades en backend:', query);

            if (!query.trim()) {
                return [];
            }

            // Validar caracteres según el backend
            if (!this.validarCaracteres(query)) {
                throw new Error('Caracteres inválidos en la búsqueda');
            }

            const response = await fetch(
                `${this.API_BASE}/borbotones/search/autocomplete?q=${encodeURIComponent(query)}&limit=50`
            );

            console.log('🔗 [SERVICE] URL de búsqueda:', `${this.API_BASE}/borbotones/search/autocomplete?q=${encodeURIComponent(query)}&limit=50`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ [SERVICE] Error response:', errorText);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data: ApiResponse = await response.json();
            console.log('📦 [SERVICE] Respuesta de especialidades:', data);

            if (data.success && data.data && Array.isArray(data.data)) {
                console.log('✅ [SERVICE] Especialidades encontradas:', data.data.length);
                return this.convertEspecialidadesToJobs(data.data);
            }

            console.log('⚠️ [SERVICE] No hay resultados de especialidades');
            return [];

        } catch (error) {
            console.error('❌ [SERVICE] Error en búsqueda backend:', error);
            throw error;
        }
    }

    private static validarCaracteres(texto: string): boolean {
        const validCharsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]+$/;
        return validCharsRegex.test(texto);
    }

    private static convertEspecialidadesToJobs(especialidades: EspecialidadBackend[]): Job[] {
        console.log('🔄 [SERVICE] Convirtiendo especialidades a jobs:', especialidades);

        const jobs: Job[] = especialidades.map((especialidad: EspecialidadBackend) => {
            const nombreServicio = especialidad.nombre || "Servicio no disponible";

            const job: Job = {
                title: nombreServicio,
                company: "Profesionales disponibles",
                service: nombreServicio,
                location: "Varias ubicaciones",
                postedDate: new Date().toLocaleDateString('es-ES'),
                salaryRange: "Consultar",
                employmentType: "Servicio",
                employmentTypeColor: "bg-blue-100 text-blue-800"
            };

            console.log(`🔄 [SERVICE] Job convertido:`, job);
            return job;
        });

        console.log('🔄 [SERVICE] Total de jobs convertidos:', jobs.length);
        return jobs;
    }

    static async getHistorial(): Promise<string[]> {
        try {
            const response = await fetch(`${this.API_BASE}/borbotones/search/history`);

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

    static async clearHistorial(): Promise<boolean> {
        try {
            const response = await fetch(`${this.API_BASE}/borbotones/search/history`, {
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

    static async getAutocompleteSuggestions(query: string): Promise<string[]> {
        try {
            console.log('🔍 [SUGERENCIAS] Buscando sugerencias para:', query);

            // Validar caracteres según el backend
            if (!this.validarCaracteres(query)) {
                return [];
            }

            const response = await fetch(
                `${this.API_BASE}/borbotones/search/autocomplete?q=${encodeURIComponent(query)}&limit=6`
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
    placeholder = "Buscar por servicio o especialidad...",
    valorInicial = ""
}: BusquedaAutocompletadoProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(valorInicial);
    const [sugerencias, setSugerencias] = useState<string[]>([]);
    const [estadoSugerencias, setEstadoSugerencias] = useState<EstadoSugerencias>("idle");
    const [estadoBusqueda, setEstadoBusqueda] = useState<EstadoBusqueda>("idle");
    const [mensaje, setMensaje] = useState("");
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [resultados, setResultados] = useState<Job[]>([]);
    const [historial, setHistorial] = useState<string[]>([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminoBusquedaAnterior = useRef("");

    // Actualizado según las validaciones del backend
    const caracteresValidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]*$/;

    // Función para actualizar la URL con el término de búsqueda
    const actualizarURL = useCallback((searchTerm: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm.trim()) {
            params.set('q', searchTerm.trim());
        } else {
            params.delete('q');
        }

        router.push(`?${params.toString()}`, { scroll: false });
        console.log('🔗 [URL] URL actualizada:', searchTerm);
    }, [router, searchParams]);

    // Sincronizar con parámetros de URL al cargar
    useEffect(() => {
        const urlQuery = searchParams.get('q');
        if (urlQuery && urlQuery !== query) {
            setQuery(urlQuery);
            // Ejecutar búsqueda automáticamente si hay query en URL
            setTimeout(() => {
                ejecutarBusquedaCompleta(urlQuery, false);
            }, 100);
        }
    }, [searchParams]);

    useEffect(() => {
        console.log('🔄 [AUTOCOMPLETADO] valorInicial actualizado:', valorInicial);
        if (valorInicial !== query) {
            setQuery(valorInicial);
        }
    }, [valorInicial]);

    // Cargar historial del backend
    useEffect(() => {
        const cargarHistorialBackend = async () => {
            try {
                setCargandoHistorial(true);
                const terminos = await BusquedaService.getHistorial();
                setHistorial(terminos);
                console.log('📚 [HISTORIAL] Historial cargado:', terminos);
            } catch (error) {
                console.error('Error cargando historial del backend:', error);
                // Fallback a localStorage si el backend falla
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
    }, []);

    const limpiarHistorialBackend = useCallback(async () => {
        try {
            const success = await BusquedaService.clearHistorial();
            if (success) {
                setHistorial([]);
                setMostrarHistorial(false);
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
    }, []);

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
            return (
                (job.service && normalizarTexto(job.service).includes(textoNormalizado)) ||
                (job.title && normalizarTexto(job.title).includes(textoNormalizado))
            );
        });
    }, [normalizarTexto]);

    const guardarEnHistorial = useCallback((texto: string) => {
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
    }, [historial]);

    const buscarSugerenciasBackend = useCallback(async (texto: string): Promise<string[]> => {
        try {
            if (!caracteresValidos.test(texto)) {
                return [];
            }

            console.log('🔍 [SUGERENCIAS] Buscando sugerencias para:', texto);

            const sugerenciasBackend = await BusquedaService.getAutocompleteSuggestions(texto);
            console.log('🔍 [SUGERENCIAS] Sugerencias del backend:', sugerenciasBackend);

            if (sugerenciasBackend.length > 0) {
                return sugerenciasBackend;
            }

            // Fallback a búsqueda local si no hay sugerencias del backend
            console.log('🔄 [SUGERENCIAS] Usando fallback a búsqueda local');
            const resultadosLocales = buscarTrabajosLocal(texto, datos);
            const terminosUnicos = Array.from(
                new Set(
                    resultadosLocales
                        .map(job => job.service || job.title)
                        .filter(Boolean)
                        .map(term => term as string)
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
                        .map(job => job.service || job.title)
                        .filter(Boolean)
                        .map(term => term as string)
                )
            );
            return terminosUnicos.slice(0, 6);
        }
    }, [buscarTrabajosLocal, datos]);

    const ejecutarBusquedaCompleta = useCallback(async (texto: string, guardarEnHistorialFlag: boolean = true) => {
        const textoLimpio = texto.trim();

        // Validaciones según el backend
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
        setMostrarHistorial(false);

        terminoBusquedaAnterior.current = textoLimpio;

        if (guardarEnHistorialFlag) {
            guardarEnHistorial(textoLimpio);
        }

        // Actualizar la URL antes de la búsqueda
        actualizarURL(textoLimpio);

        try {
            console.log('🔍 [BÚSQUEDA] Conectando al backend...');
            const resultadosBackend = await BusquedaService.searchJobsInBackend(textoLimpio);

            console.log('🔍 [BÚSQUEDA] Resultados:', resultadosBackend);

            setResultados(resultadosBackend);
            setEstadoBusqueda("success");
            onSearch(textoLimpio, resultadosBackend);

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
    }, [datos, onSearch, buscarTrabajosLocal, guardarEnHistorial, actualizarURL]);

    const seleccionarSugerencia = useCallback(async (texto: string) => {
        setQuery(texto);
        setSugerencias([]);
        setMensaje("");
        setMostrarSugerencias(false);
        setMostrarHistorial(false);
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

        if (historial.length > 0) {
            setMostrarHistorial(true);
        } else {
            setMostrarHistorial(false);
        }

        setBusquedaRealizada(false);
        terminoBusquedaAnterior.current = "";

        // Actualizar URL al limpiar (eliminar parámetro q)
        actualizarURL("");

        onSearch("", datos);
        inputRef.current?.focus();
    }, [datos, onSearch, historial, actualizarURL]);

    const manejarKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            ejecutarBusqueda();
        } else if (e.key === 'Escape') {
            setMostrarSugerencias(false);
            setMostrarHistorial(false);
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
                if (historial.length > 0 && !busquedaRealizada) {
                    
                }
                return;
            }

            if (!caracteresValidos.test(texto)) {
                console.log('❌ [BLOQUEO] Carácter inválido detectado');
                setMensaje("Solo se permiten caracteres alfabéticos y los especiales: ´ , - , comilla simple y comilla doble");
                setSugerencias([]);
                setEstadoSugerencias("error");
                setMostrarSugerencias(true);
                setMostrarHistorial(false);
                return;
            }

            if (textoLimpio.length >= 2 && !busquedaRealizada) {
                setMostrarHistorial(false);
                setMostrarSugerencias(true);
            } else {
                setSugerencias([]);
                setMensaje("");
                setEstadoSugerencias("idle");
                setMostrarSugerencias(false);
                setMostrarHistorial(false);
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
                        setMensaje(`No se encontraron servicios para "${texto}"`);
                    } else {
                        setMensaje("");
                    }

                } catch (error) {
                    console.error('❌ [EFFECT] Error buscando sugerencias:', error);
                    setEstadoSugerencias("error");
                    setMensaje("Error al buscar servicios");
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
    }, [query, busquedaRealizada, historial.length, buscarSugerenciasBackend]);

    // Efecto para cerrar sugerencias al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setMostrarSugerencias(false);
                setMostrarHistorial(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        
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
                                if (historial.length > 0) {
                                    setMostrarHistorial(true);
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
                                if (!query.trim() && historial.length > 0) {
                                    setMostrarHistorial(true);
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
                        {mostrarHistorial && historial.length > 0 && (
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
                                        Buscando servicios...
                                    </div>
                                )}

                                {estadoSugerencias !== "loading" && (
                                    <ul className="caja-sugerencias">
                                        <li className="sugerencias-header">
                                            Sugerencias de servicios
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
    );
}