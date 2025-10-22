'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { Job } from "../paginacion/types/job";
import styles from './busqueda.module.css';
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

//http://localhost:5000
//https://alquiler-back.vercel.app
class BusquedaService {
    private static API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://alquiler-back.vercel.app';

    static async searchJobsInBackend(query: string, jobsReales: Job[], endpoint?: string): Promise<Job[]> {
        try {
            console.log('🔍 [SERVICE] Buscando en backend:', query);
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

            // 2. ✅ BÚSQUEDA MEJORADA: Buscar en múltiples campos (SIN especialidad)
            const queryLower = query.toLowerCase().trim();
            console.log('🎯 Buscando en múltiples campos con:', queryLower);

            const jobsFiltrados = jobsReales.filter(job => {
                // Buscar en otros campos relevantes (SIN especialidad)
                const enService = job.service &&
                    job.service.toLowerCase().includes(queryLower);

                const enTitle = job.title &&
                    job.title.toLowerCase().includes(queryLower);

                const enCompany = job.company &&
                    job.company.toLowerCase().includes(queryLower);

                const enLocation = job.location &&
                    job.location.toLowerCase().includes(queryLower);

                const coincide = enService || enTitle || enCompany || enLocation;

                if (coincide) {
                    console.log(`✅ COINCIDENCIA:`, {
                        title: job.title,
                        service: job.service,
                        company: job.company,
                        location: job.location
                    });
                }

                return coincide;
            });

            console.log('✅ Jobs encontrados:', jobsFiltrados.length);

            // 3. DEBUG: Mostrar resultados
            if (jobsFiltrados.length > 0) {
                console.log('📋 Jobs que coinciden:');
                jobsFiltrados.forEach(job => {
                    console.log(`   - ${job.title} | ${job.company} | ${job.service}`);
                });
            } else {
                console.log('❌ No se encontraron jobs');
                // Mostrar debug info
                const debugInfo = jobsReales.slice(0, 3).map(job => ({
                    title: job.title,
                    service: job.service,
                    company: job.company,
                    location: job.location
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
    placeholder = "Buscar por título, servicio, empresa...",
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
    const [cargandoHistorial, setCargandoHistorial] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

    // 🔥 NUEVO: Estado para controlar loading en área de resultados
    const [loadingResultados, setLoadingResultados] = useState(false);
    // 🔥 NUEVO: Estado para mensaje de no resultados
    const [mensajeNoResultados, setMensajeNoResultados] = useState("");

    // 🔥 CORRECCIÓN: Separar los debounce refs para evitar conflictos
    const debounceSugerenciasRef = useRef<NodeJS.Timeout | null>(null);
    const debounceBusquedaRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminoBusquedaAnterior = useRef("");
    const historialCargado = useRef(false);
    // 🔥 NUEVO: Ref para controlar búsquedas en curso
    const busquedaEnCurso = useRef(false);

    const caracteresValidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]*$/;

    // 🔥 EFECTO: Limpiar historial automáticamente al recargar
    useEffect(() => {
        const limpiarHistorialAlRecargar = async () => {
            if (!mostrarHistorial || historialCargado.current) return;

            console.log('🧹 [AUTOCOMPLETADO] Limpiando historial por recarga de página');

            try {
                // Limpiar historial del backend
                await BusquedaService.clearHistorial(apiConfig?.endpoint);

                // Limpiar historial local
                setHistorial([]);
                localStorage.removeItem("historialBusquedas");

                // Marcar como cargado para evitar limpiezas múltiples
                historialCargado.current = true;

                console.log('✅ [AUTOCOMPLETADO] Historial limpiado correctamente');
            } catch (error) {
                console.error('❌ [AUTOCOMPLETADO] Error limpiando historial:', error);
                // Fallback: limpiar solo el local
                setHistorial([]);
                localStorage.removeItem("historialBusquedas");
                historialCargado.current = true;
            }
        };

        // Ejecutar inmediatamente al montar (recarga)
        limpiarHistorialAlRecargar();

        // También limpiar cuando se detecte una recarga de página
        const handleBeforeUnload = () => {
            // Preparar para la próxima recarga
            historialCargado.current = false;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [mostrarHistorial, apiConfig?.endpoint]);

    // Sincronizar con valorInicial
    useEffect(() => {
        console.log('🔄 [AUTOCOMPLETADO] valorInicial actualizado:', valorInicial);
        if (valorInicial !== query) {
            setQuery(valorInicial);
        }
    }, [valorInicial]);

    // Cargar historial del backend (SOLO si no se ha limpiado recientemente)
    useEffect(() => {
        if (!mostrarHistorial || historialCargado.current) return;

        const cargarHistorialBackend = async () => {
            try {
                setCargandoHistorial(true);
                const terminos = await BusquedaService.getHistorial(apiConfig?.endpoint);

                // Solo establecer historial si no está vacío y no hemos limpiado recientemente
                if (terminos.length > 0 && !historialCargado.current) {
                    setHistorial(terminos);
                    console.log('📚 [HISTORIAL] Historial cargado:', terminos);
                } else {
                    console.log('📚 [HISTORIAL] Historial vacío o ya limpiado');
                    setHistorial([]);
                }

                historialCargado.current = true;
            } catch (error) {
                console.error('Error cargando historial del backend:', error);
                // Fallback a localStorage
                try {
                    const stored = localStorage.getItem("historialBusquedas");
                    if (stored && !historialCargado.current) {
                        setHistorial(JSON.parse(stored));
                    }
                } catch (localError) {
                    console.error('Error con localStorage:', localError);
                } finally {
                    historialCargado.current = true;
                }
            } finally {
                setCargandoHistorial(false);
            }
        };

        cargarHistorialBackend();
    }, [mostrarHistorial, apiConfig?.endpoint]);

    // Efecto para controlar la visibilidad del historial y sugerencias
    useEffect(() => {
        const texto = query.trim();

        // CONDICIONES PARA MOSTRAR HISTORIAL - asegurar que devuelvan boolean
        const debeMostrarHistorial = Boolean(
            inputFocused &&
            texto.length === 0 &&
            historial.length > 0 &&
            mostrarHistorial
        );

        // CONDICIONES PARA MOSTRAR SUGERENCIAS - asegurar que devuelvan boolean
        const debeMostrarSugerencias = Boolean(
            inputFocused &&
            texto.length >= 1 &&
            (estadoSugerencias === "loading" || sugerencias.length > 0 || mensajeNoResultados)
        );

        setMostrarHistorialLocal(debeMostrarHistorial);
        setMostrarSugerencias(debeMostrarSugerencias);

    }, [query, inputFocused, historial, mostrarHistorial, estadoSugerencias, sugerencias, mensajeNoResultados]);

    const limpiarHistorialBackend = useCallback(async () => {
        try {
            const success = await BusquedaService.clearHistorial(apiConfig?.endpoint);
            if (success) {
                setHistorial([]);
                setMostrarHistorialLocal(false);
                localStorage.removeItem("historialBusquedas");
                historialCargado.current = true;
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
                // Búsqueda en múltiples campos (SIN especialidad)
                return (
                    (job.service && normalizarTexto(job.service).includes(textoNormalizado)) ||
                    (job.title && normalizarTexto(job.title).includes(textoNormalizado)) ||
                    (job.company && normalizarTexto(job.company).includes(textoNormalizado)) ||
                    (job.location && normalizarTexto(job.location).includes(textoNormalizado))
                );
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

            // Extraer términos únicos de los campos disponibles (SIN especialidad)
            const terminosUnicos = Array.from(
                new Set(
                    resultadosLocales
                        .flatMap(job => [
                            job.title,
                            job.service,
                            job.company,
                            job.location
                        ])
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

            // Extraer términos únicos de los campos disponibles (SIN especialidad)
            const terminosUnicos = Array.from(
                new Set(
                    resultadosLocales
                        .flatMap(job => [
                            job.title,
                            job.service,
                            job.company,
                            job.location
                        ])
                        .filter(Boolean)
                        .map(term => String(term))
                )
            );
            return terminosUnicos.slice(0, 6);
        }
    }, [buscarTrabajosLocal, datos, apiConfig?.endpoint]);

    const ejecutarBusquedaCompleta = useCallback(async (texto: string, guardarEnHistorialFlag: boolean = true) => {
        // 🔥 CORRECCIÓN: Verificar si ya hay una búsqueda en curso
        if (busquedaEnCurso.current) {
            console.log('⏸️ [BÚSQUEDA] Ya hay una búsqueda en curso, omitiendo...');
            return;
        }

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
            setEstadoBusqueda("idle");
            setResultados([]);
            setLoadingResultados(false);
            setMensajeNoResultados(""); // 🔥 Limpiar mensaje de no resultados
            onSearch("", []);
            return;
        }

        console.log('✅ [BÚSQUEDA COMPLETA] Ejecutando búsqueda para:', textoLimpio);

        // 🔥 CORRECCIÓN: Marcar que hay una búsqueda en curso
        busquedaEnCurso.current = true;
        setEstadoBusqueda("loading");
        setLoadingResultados(true);
        setMostrarHistorialLocal(false);
        setMensajeNoResultados(""); // 🔥 Limpiar mensaje anterior

        terminoBusquedaAnterior.current = textoLimpio;

        if (guardarEnHistorialFlag && mostrarHistorial) {
            guardarEnHistorial(textoLimpio);
        }

        try {
            console.log('🔍 [BÚSQUEDA] Buscando jobs reales...');

            const resultadosBackend = await BusquedaService.searchJobsInBackend(textoLimpio, datos, apiConfig?.endpoint);

            console.log('🔍 [BÚSQUEDA] Resultados backend (jobs reales):', resultadosBackend);

            if (resultadosBackend.length > 0) {
                setResultados(resultadosBackend);
                setEstadoBusqueda("success");
                setMensajeNoResultados(""); // 🔥 Limpiar mensaje si hay resultados
                onSearch(textoLimpio, resultadosBackend);
            } else {
                const resultadosLocales = buscarTrabajosLocal(textoLimpio, datos);
                console.log('🔍 [BÚSQUEDA] Resultados locales:', resultadosLocales);

                if (resultadosLocales.length > 0) {
                    setResultados(resultadosLocales);
                    setEstadoBusqueda("success");
                    setMensajeNoResultados(""); // 🔥 Limpiar mensaje si hay resultados
                    onSearch(textoLimpio, resultadosLocales);
                } else {
                    // 🔥 NUEVO: Pasar array vacío y dejar que la página maneje el mensaje
                    setResultados([]);
                    setEstadoBusqueda("success");
                    onSearch(textoLimpio, []); // 🔥 Pasar array vacío
                    console.log('❌ [BÚSQUEDA] No se encontraron resultados');
                }
            }

        } catch (error) {
            console.error("Error en búsqueda backend, usando búsqueda local:", error);

            if (error instanceof Error) {
                setMensaje(error.message);
            } else {
                setMensaje("Error al conectar con el servidor");
            }

            setEstadoBusqueda("error");
            onSearch(textoLimpio, []); // 🔥 En caso de error, pasar array vacío
        } finally {
            // 🔥 CORRECCIÓN: Liberar el flag de búsqueda en curso
            busquedaEnCurso.current = false;
            setLoadingResultados(false);
        }
    }, [datos, onSearch, buscarTrabajosLocal, guardarEnHistorial, mostrarHistorial, apiConfig?.endpoint]);

    const seleccionarSugerencia = useCallback(async (texto: string) => {
        setQuery(texto);
        setSugerencias([]);
        setMensaje("");
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);
        setMensajeNoResultados(""); // 🔥 Limpiar mensaje al seleccionar sugerencia
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
        setMostrarHistorialLocal(false);
        setLoadingResultados(false);
        setMensajeNoResultados(""); // 🔥 Limpiar mensaje al limpiar búsqueda
        terminoBusquedaAnterior.current = "";
        // 🔥 CORRECCIÓN: Resetear el flag de búsqueda en curso
        busquedaEnCurso.current = false;

        onSearch("", datos);
        inputRef.current?.focus();
    }, [datos, onSearch]);

    const manejarKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            ejecutarBusqueda();
        } else if (e.key === 'Escape') {
            setMostrarSugerencias(false);
            setMostrarHistorialLocal(false);
            setInputFocused(false);
            inputRef.current?.blur();
        }
    }, [ejecutarBusqueda]);

    // 🔥 Efecto solo para sugerencias (se ejecuta con cada carácter)
    useEffect(() => {
        // 🔥 CORRECCIÓN: Usar el ref específico para sugerencias
        if (debounceSugerenciasRef.current) {
            clearTimeout(debounceSugerenciasRef.current);
        }

        const texto = query.trim();

        const actualizarVisualizacion = () => {
            const textoLimpio = texto.trim();

            if (!textoLimpio) {
                setSugerencias([]);
                setMensaje("");
                setEstadoSugerencias("idle");
                setMensajeNoResultados(""); // 🔥 Limpiar mensaje
                return;
            }

            if (!caracteresValidos.test(texto)) {
                console.log('❌ [BLOQUEO] Carácter inválido detectado');
                setMensaje("Solo se permiten caracteres alfabéticos y los especiales: ´ , - , comilla simple y comilla doble");
                setSugerencias([]);
                setEstadoSugerencias("error");
                setMensajeNoResultados(""); // 🔥 Limpiar mensaje
                return;
            }
        };

        actualizarVisualizacion();

        if (texto.length >= 1 && inputFocused) {
            setEstadoSugerencias("loading");
            setMensajeNoResultados(""); // 🔥 Limpiar mensaje anterior

            // 🔥 CORRECCIÓN: Usar el ref específico para sugerencias
            debounceSugerenciasRef.current = setTimeout(async () => {
                try {
                    console.log('🔍 [SUGERENCIAS] Buscando sugerencias para:', texto);
                    const sugerenciasBackend = await buscarSugerenciasBackend(texto);
                    console.log('🔍 [SUGERENCIAS] Sugerencias encontradas:', sugerenciasBackend);

                    setSugerencias(sugerenciasBackend);
                    setEstadoSugerencias(sugerenciasBackend.length > 0 ? "success" : "success");

                    if (sugerenciasBackend.length === 0) {
                        // 🔥 NUEVO: Mensaje personalizado para sugerencias
                        const mensajeSugerencias = `No se encontraron coincidencias para "${texto}"`;
                        setMensajeNoResultados(mensajeSugerencias);
                        setMensaje(mensajeSugerencias);
                    } else {
                        setMensaje("");
                        setMensajeNoResultados(""); // 🔥 Limpiar mensaje si hay sugerencias
                    }

                } catch (error) {
                    console.error('❌ [SUGERENCIAS] Error buscando sugerencias:', error);
                    setEstadoSugerencias("error");
                    setMensaje("Error al buscar sugerencias");
                    setSugerencias([]);
                    setMensajeNoResultados(""); // 🔥 Limpiar mensaje en error
                }
            }, 400); // 🔥 AUMENTAR el debounce a 400ms para escribir rápido
        } else {
            setSugerencias([]);
            setEstadoSugerencias("idle");
            setMensaje("");
            setMensajeNoResultados(""); // 🔥 Limpiar mensaje
        }

        return () => {
            // 🔥 CORRECCIÓN: Limpiar solo el ref de sugerencias
            if (debounceSugerenciasRef.current) {
                clearTimeout(debounceSugerenciasRef.current);
            }
        };
    }, [query, inputFocused, buscarSugerenciasBackend]);

    // 🔥 Efecto separado para búsqueda automática (se ejecuta con cada carácter NUEVO)
    useEffect(() => {
        // 🔥 CORRECCIÓN: Usar el ref específico para búsqueda
        if (debounceBusquedaRef.current) {
            clearTimeout(debounceBusquedaRef.current);
        }

        const texto = query.trim();

        // Solo ejecutar búsqueda automática si:
        // - Hay texto
        // - El input está enfocado  
        // - El texto es DIFERENTE al anterior (nuevo carácter)
        // - No hay búsqueda en curso
        if (texto.length >= 1 && inputFocused && texto !== terminoBusquedaAnterior.current && !busquedaEnCurso.current) {
            console.log('🚀 [BÚSQUEDA-AUTO] Programando búsqueda automática para:', texto);

            // 🔥 CORRECCIÓN: Usar debounce también para búsquedas automáticas
            debounceBusquedaRef.current = setTimeout(() => {
                console.log('📊 [BÚSQUEDA-AUTO] Texto anterior:', terminoBusquedaAnterior.current);

                // Actualizar referencia ANTES de ejecutar la búsqueda
                terminoBusquedaAnterior.current = texto;
                setLoadingResultados(true);
                ejecutarBusquedaCompleta(texto, false);
            }, 500); // 🔥 AUMENTAR el debounce a 500ms para búsquedas
        }

        return () => {
            // 🔥 CORRECCIÓN: Limpiar solo el ref de búsqueda
            if (debounceBusquedaRef.current) {
                clearTimeout(debounceBusquedaRef.current);
            }
        };
    }, [query, inputFocused, ejecutarBusquedaCompleta]);

    // Efecto para cerrar sugerencias al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setMostrarSugerencias(false);
                setMostrarHistorialLocal(false);
                setInputFocused(false);
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
                                setEstadoBusqueda("idle");
                                setLoadingResultados(false);
                                setMensajeNoResultados(""); // 🔥 Limpiar mensaje
                                onSearch("", datos);
                                terminoBusquedaAnterior.current = "";
                                // 🔥 CORRECCIÓN: Resetear flag de búsqueda en curso
                                busquedaEnCurso.current = false;
                            }
                        }}
                        onKeyDown={manejarKeyDown}
                        onFocus={() => {
                            setInputFocused(true);
                            if (query.trim().length >= 1) {
                                console.log('🖱️ [CLICK] Cargando sugerencias para texto existente:', query);
                                setEstadoSugerencias("loading");

                                setTimeout(async () => {
                                    try {
                                        const sugerenciasBackend = await buscarSugerenciasBackend(query);
                                        setSugerencias(sugerenciasBackend);
                                        setEstadoSugerencias(sugerenciasBackend.length > 0 ? "success" : "success");

                                        if (sugerenciasBackend.length === 0) {
                                            setMensajeNoResultados(`No se encontraron coincidencias para "${query}"`);
                                        } else {
                                            setMensajeNoResultados("");
                                        }
                                    } catch (error) {
                                        console.error('❌ Error cargando sugerencias al hacer click:', error);
                                        setEstadoSugerencias("error");
                                        setMensajeNoResultados("");
                                    }
                                }, 200);
                            }
                        }}
                        onBlur={() => {
                            setTimeout(() => {
                                setInputFocused(false);
                            }, 200);
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
                        disabled={!query.trim() || query.trim().length < 2 || busquedaEnCurso.current}
                        type="button"
                    >
                        Buscar
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

                {/* 🔥 NUEVO: Mostrar loading en área de resultados */}
                {loadingResultados && (
                    <div className="loading-resultados">
                        <div className="spinner-resultados"></div>
                        <p>Buscando resultados...</p>
                    </div>
                )}

                {/* HISTORIAL - Solo se muestra cuando se cumplen todas las condiciones */}
                {mostrarHistorialLocal && (
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

                {/* SUGERENCIAS - Solo se muestra cuando se cumplen todas las condiciones */}
                {mostrarSugerencias && (
                    <>
                        {estadoSugerencias === "loading" && (
                            <div className="caja-sugerencias cargando">
                                <div className="spinner"></div>
                                Buscando ...
                            </div>
                        )}

                        {estadoSugerencias !== "loading" && (
                            <ul className="caja-sugerencias">
                                <li className="sugerencias-header">
                                    Sugerencias
                                </li>
                                {sugerencias.map((s, i) => (
                                    <li key={i} onClick={() => seleccionarSugerencia(s)}>
                                        <Search className="icono-sugerencia" size={16} />
                                        {s}
                                    </li>
                                ))}
                                {sugerencias.length === 0 && mensajeNoResultados && (
                                    <li className="mensaje-sugerencia">
                                        <div className="icono-info">ℹ️</div>
                                        {mensajeNoResultados}
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
            </div>
        </div>
    );
}