'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { Job } from "../paginacion/types/job";
import "./busqueda.css";
import { Trash2 } from "lucide-react";
import { useSearchHistory } from './hooks/useHistorialBusqueda';

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

// Helper: normaliza NEXT_PUBLIC_API_URL evitando duplicar '/api'
function getApiRoot(): string {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

class BusquedaService {
    private static API_BASE = getApiRoot();

    // Búsqueda local robusta como fallback principal
    static busquedaLocalInteligente(query: string, jobs: Job[]): Job[] {
        if (!query.trim()) return [];

        const queryLower = query.toLowerCase().trim();
        console.log('🔄 [LOCAL] Buscando localmente:', queryLower);

        const resultados = jobs.filter(job => {
            const enService = job.service?.toLowerCase().includes(queryLower);
            const enTitle = job.title?.toLowerCase().includes(queryLower);
            const enCompany = job.company?.toLowerCase().includes(queryLower);
            const enEspecialidad = job.especialidad?.toLowerCase().includes(queryLower);

            return enService || enTitle || enCompany || enEspecialidad;
        });

        console.log(`✅ [LOCAL] ${resultados.length} resultados encontrados`);
        return resultados.slice(0, 50);
    }

    // Búsqueda principal con fallback automático
    static async searchJobsOptimized(query: string, jobsReales: Job[], endpoint?: string): Promise<Job[]> {
        try {
            console.log('🎯 [BÚSQUEDA] Buscando trabajos para:', query);

            if (!query.trim()) {
                return [];
            }

            // iNTENTAR BACKEND PRIMERO
            try {
                console.log('🚀 [BACKEND] Intentando conexión con backend...');

                const payload = {
                    queryOriginal: query,
                    estrategias: [query.toLowerCase()],
                    campos: ['title', 'especialidad', 'company', 'service', 'description'],
                    config: {
                        caseInsensitive: true,
                        ignoreAccents: true,
                        fuzzyMatch: true,
                        partialMatch: true
                    }
                };

                const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ [BACKEND] Respuesta recibida:', data);

                    if (data.success && data.data && Array.isArray(data.data)) {
                        console.log(`✅ [BACKEND] ${data.data.length} resultados del backend`);
                        return data.data.slice(0, 50);
                    }
                }

                console.log('⚠️ [BACKEND] Respuesta no válida, usando búsqueda local');
                throw new Error('Backend response not valid');

            } catch (backendError) {
                console.log('🔄 [BACKEND] Error o timeout, usando búsqueda local:', backendError);
                // 🔥 FALLBACK AUTOMÁTICO A BÚSQUEDA LOCAL
                return this.busquedaLocalInteligente(query, jobsReales);
            }

        } catch (error) {
            console.error('❌ [BÚSQUEDA] Error general, usando búsqueda local:', error);
            // 🔥 FALLBACK FINAL A BÚSQUEDA LOCAL
            return this.busquedaLocalInteligente(query, jobsReales);
        }
    }

    // Búsqueda por especialidad con fallback automático
    static async searchByEspecialidad(especialidad: string, jobsReales: Job[]): Promise<Job[]> {
        if (!especialidad.trim()) {
            return [];
        }

        console.log('🎯 [ESPECIALIDAD] Buscando por especialidad:', especialidad);

        try {
            const apiEndpoint = `${this.API_BASE}/borbotones/search/especialidad`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    especialidad: especialidad,
                    estrategias: [especialidad.toLowerCase()]
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && Array.isArray(data.data)) {
                    console.log(`✅ [ESPECIALIDAD-BACKEND] ${data.data.length} resultados`);
                    return data.data;
                }
            }

            throw new Error('Backend response not valid');

        } catch (backendError) {
            console.log('🔄 [ESPECIALIDAD] Usando búsqueda local optimizada');
            // 🔥 FALLBACK AUTOMÁTICO A BÚSQUEDA LOCAL
            return this.busquedaLocalInteligente(especialidad, jobsReales);
        }
    }

    // Sugerencias con fallback automático robusto
    static async getAutocompleteSuggestions(query: string, jobsReales: Job[], endpoint?: string): Promise<string[]> {
        try {
            console.log('🔍 [SUGERENCIAS] Buscando sugerencias para:', query);

            const qTrim = String(query || '').trim();
            if (qTrim.length < 1) {
                return [];
            }

            // 🔥 INTENTAR BACKEND PRIMERO
            try {
                const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/autocomplete`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch(
                    `${apiEndpoint}?q=${encodeURIComponent(query)}&limit=6`,
                    { signal: controller.signal }
                );

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data: ApiResponse = await response.json();
                    console.log('✅ [SUGERENCIAS-BACKEND] Respuesta recibida:', data);

                    if (data.success && data.data && Array.isArray(data.data)) {
                        const sugerencias = data.data
                            .map((item: EspecialidadBackend) => item.nombre)
                            .filter((nombre: string) => nombre && nombre.trim())
                            .slice(0, 6);

                        console.log('✅ [SUGERENCIAS-BACKEND] Sugerencias:', sugerencias);
                        return sugerencias;
                    }
                }

                console.log('⚠️ [SUGERENCIAS-BACKEND] Respuesta no válida, usando fallback local');
                throw new Error('Backend response not valid');

            } catch (backendError) {
                console.log('🔄 [SUGERENCIAS-BACKEND] Error o timeout, usando fallback local:', backendError);
                // 🔥 FALLBACK AUTOMÁTICO A SUGERENCIAS LOCALES
                return this.getFallbackSuggestions(query, jobsReales);
            }

        } catch (error) {
            console.error('❌ [SUGERENCIAS] Error general, usando fallback local:', error);
            // 🔥 FALLBACK FINAL A SUGERENCIAS LOCALES
            return this.getFallbackSuggestions(query, jobsReales);
        }
    }

    // Fallback mejorado para eliminar duplicidad
    private static getFallbackSuggestions(query: string, jobs: Job[]): string[] {
        console.log('🔄 [SUGERENCIAS-LOCAL] Generando sugerencias locales para:', query);

        const queryLower = query.toLowerCase();

        // Usar Set para evitar duplicados desde el principio
        const todasLasSugerencias = new Set<string>();

        // 🔥 EXTRAER SERVICIOS INDIVIDUALES
        jobs.forEach(job => {
            if (job.service) {
                job.service
                    .split(',')
                    .map(servicio => servicio.trim())
                    .filter(servicio =>
                        servicio &&
                        servicio.toLowerCase().includes(queryLower) &&
                        servicio.length > 0
                    )
                    .forEach(servicio => todasLasSugerencias.add(servicio));
            }
        });

        // 🔥 EXTRAER OTROS CAMPOS (SOLO SI NO ESTÁN YA EN LOS SERVICIOS)
        jobs.forEach(job => {
            // Título - solo agregar si no es similar a servicios existentes
            if (job.title &&
                job.title.toLowerCase().includes(queryLower) &&
                !this.estaContenidoEnServicios(job.title, Array.from(todasLasSugerencias))) {
                todasLasSugerencias.add(job.title);
            }

            // Especialidad - solo agregar si no es similar a servicios existentes
            if (job.especialidad &&
                job.especialidad.toLowerCase().includes(queryLower) &&
                !this.estaContenidoEnServicios(job.especialidad, Array.from(todasLasSugerencias))) {
                todasLasSugerencias.add(job.especialidad);
            }

            // Empresa - solo agregar si no es similar a servicios existentes
            if (job.company &&
                job.company.toLowerCase().includes(queryLower) &&
                !this.estaContenidoEnServicios(job.company, Array.from(todasLasSugerencias))) {
                todasLasSugerencias.add(job.company);
            }
        });

        const sugerenciasFinales = Array.from(todasLasSugerencias).slice(0, 8);

        console.log('✅ [SUGERENCIAS-LOCAL] Sugerencias sin duplicados:', sugerenciasFinales);
        return sugerenciasFinales;
    }

    //  Método para verificar si un término ya está contenido en servicios
    private static estaContenidoEnServicios(termino: string, servicios: string[]): boolean {
        const terminoLower = termino.toLowerCase();

        return servicios.some(servicio =>
            servicio.toLowerCase().includes(terminoLower) ||
            terminoLower.includes(servicio.toLowerCase())
        );
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
    const [resultados, setResultados] = useState<Job[]>([]);
    const [loadingResultados, setLoadingResultados] = useState(false);
    const [mensajeNoResultados, setMensajeNoResultados] = useState("");
    const [inputFocused, setInputFocused] = useState(false);

    const debounceSugerenciasRef = useRef<NodeJS.Timeout | null>(null);
    const debounceBusquedaRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminoBusquedaAnterior = useRef("");
    const busquedaEnCurso = useRef(false);

    const caracteresValidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]*$/;



    // USAR HOOK DE HISTORIAL
    const {
        historial,
        cargandoHistorial,
        mostrarHistorialLocal,
        setMostrarHistorialLocal,
        guardarEnHistorial,
        limpiarHistorialBackend,
        seleccionarDelHistorial
    } = useSearchHistory({
        mostrarHistorial,
        apiConfig
    });



    // Normaliza texto: primera letra en mayúscula, mantiene el resto
    const capitalizarPrimera = (texto: string) => {
        const t = texto ? String(texto).trim() : "";
        if (!t) return "";
        return t.charAt(0).toUpperCase() + t.slice(1);
    };

    // NUEVA FUNCIÓN: Normalizar texto para búsqueda
    const normalizarTexto = useCallback((texto: string): string => {
        if (!texto) return "";

        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remover acentos
            .replace(/[´,'"“"‘’,\-]/g, '')   // Remover caracteres especiales
            .replace(/\s+/g, ' ')           // Normalizar espacios
            .trim()
            .toLowerCase();
    }, []);

    // Sincronizar con valorInicial
    useEffect(() => {
        console.log('🔄 [AUTOCOMPLETADO] valorInicial actualizado:', valorInicial);
        if (valorInicial !== query) {
            setQuery(valorInicial);
        }
    }, [valorInicial]);



    // Efecto para controlar la visibilidad del historial y sugerencias
    useEffect(() => {
        const texto = query.trim();

        const debeMostrarHistorial = Boolean(
            inputFocused &&
            texto.length === 0 &&
            historial.length > 0 &&
            mostrarHistorial
        );

        const debeMostrarSugerencias = Boolean(
            inputFocused &&
            texto.length >= 1 &&
            (estadoSugerencias === "loading" || sugerencias.length > 0 || mensajeNoResultados)
        );

        setMostrarHistorialLocal(debeMostrarHistorial);
        setMostrarSugerencias(debeMostrarSugerencias);

    }, [query, inputFocused, historial, mostrarHistorial, estadoSugerencias, sugerencias, mensajeNoResultados, setMostrarHistorialLocal]);



    // MODIFICADO: Búsqueda local simple
    const buscarTrabajosLocal = useCallback((texto: string, jobs: Job[]): Job[] => {
        if (!texto.trim()) return jobs;

        const textoNormalizado = normalizarTexto(texto);

        return jobs.filter(job => {
            if (campoBusqueda === "all") {
                // 🔥 BÚSQUEDA MEJORADA: Incluir búsqueda en servicios individuales
                const serviciosIndividuales = job.service
                    ? job.service.split(',').map(s => normalizarTexto(s.trim()))
                    : [];

                const enServiciosIndividuales = serviciosIndividuales.some(servicio =>
                    servicio.includes(textoNormalizado)
                );

                return (
                    enServiciosIndividuales ||
                    (job.service && normalizarTexto(job.service).includes(textoNormalizado)) ||
                    (job.title && normalizarTexto(job.title).includes(textoNormalizado)) ||
                    (job.company && normalizarTexto(job.company).includes(textoNormalizado)) ||
                    (job.especialidad && normalizarTexto(job.especialidad).includes(textoNormalizado))
                );
            } else {
                // Buscar en campo específico
                const campoValor = job[campoBusqueda];

                // SI ES EL CAMPO SERVICE, BUSCAR EN SERVICIOS INDIVIDUALES TAMBIÉN
                if (campoBusqueda === 'service' && campoValor) {
                    const serviciosIndividuales = String(campoValor)
                        .split(',')
                        .map(s => normalizarTexto(s.trim()));

                    return serviciosIndividuales.some(servicio =>
                        servicio.includes(textoNormalizado)
                    );
                }

                return campoValor && normalizarTexto(String(campoValor)).includes(textoNormalizado);
            }
        }).slice(0, maxResultados);
    }, [normalizarTexto, campoBusqueda, maxResultados]);

    // 🔥 MODIFICADO: Búsqueda principal con fallback automático
    const ejecutarBusquedaCompleta = useCallback(async (texto: string, guardarEnHistorialFlag: boolean = true, esEspecialidad: boolean = false) => {
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
            setMensajeNoResultados("");
            onSearch("", []);
            return;
        }

        console.log('🚀 [BÚSQUEDA] Ejecutando búsqueda para:', textoLimpio);

        busquedaEnCurso.current = true;
        setEstadoBusqueda("loading");
        setMostrarSugerencias(true);
        setLoadingResultados(true);
        setMostrarHistorialLocal(false);
        setMensajeNoResultados("");

        terminoBusquedaAnterior.current = textoLimpio;

        if (guardarEnHistorialFlag && mostrarHistorial) {
            guardarEnHistorial(textoLimpio);
        }

        try {
            console.log('🔍 [BÚSQUEDA] Buscando trabajos...');

            let resultadosFinales: Job[] = [];

            if (esEspecialidad) {
                // BÚSQUEDA CON FALLBACK AUTOMÁTICO
                resultadosFinales = await BusquedaService.searchByEspecialidad(textoLimpio, datos);
            } else {
                // BÚSQUEDA CON FALLBACK AUTOMÁTICO
                resultadosFinales = await BusquedaService.searchJobsOptimized(textoLimpio, datos, apiConfig?.endpoint);
            }

            console.log('📊 [BÚSQUEDA] Resultados encontrados:', resultadosFinales.length);

            if (resultadosFinales.length > 0) {
                setResultados(resultadosFinales);
                setEstadoBusqueda("success");
                setMensajeNoResultados("");
                onSearch(textoLimpio, resultadosFinales);
            } else {
                setResultados([]);
                setEstadoBusqueda("success");
                onSearch(textoLimpio, []);
                setMensajeNoResultados(`No se encontraron resultados para "${textoLimpio}"`);
                console.log('❌ [BÚSQUEDA] No se encontraron resultados');
            }

        } catch (error) {
            console.error("❌ [BÚSQUEDA] Error:", error);

            // FALLBACK FINAL: Búsqueda local como último recurso
            console.log('🔄 [BÚSQUEDA] Usando búsqueda local como fallback final');
            const resultadosLocales = buscarTrabajosLocal(textoLimpio, datos);

            setResultados(resultadosLocales);
            setEstadoBusqueda(resultadosLocales.length > 0 ? "success" : "success");
            onSearch(textoLimpio, resultadosLocales);

            if (resultadosLocales.length === 0) {
                setMensajeNoResultados(`No se encontraron resultados para "${textoLimpio}"`);
            }

        } finally {
            busquedaEnCurso.current = false;
            setLoadingResultados(false);
        }
    }, [datos, onSearch, buscarTrabajosLocal, guardarEnHistorial, mostrarHistorial, apiConfig?.endpoint, setMostrarHistorialLocal]);

    // MODIFICADO: Sugerencias con fallback automático
    const buscarSugerencias = useCallback(async (texto: string): Promise<string[]> => {
        try {
            if (!caracteresValidos.test(texto)) {
                return [];
            }

            console.log('🔍 [SUGERENCIAS] Buscando sugerencias para:', texto);

            // 🔥 USAR SERVICIO CON FALLBACK AUTOMÁTICO
            const sugerenciasOptimizadas = await BusquedaService.getAutocompleteSuggestions(
                texto,
                datos,
                apiConfig?.endpoint
            );

            console.log('✅ [SUGERENCIAS] Sugerencias encontradas:', sugerenciasOptimizadas);

            // SI EL BACKEND NO DEVUELVE NADA, USAR FALLBACK LOCAL MEJORADO
            if (sugerenciasOptimizadas.length === 0) {
                console.log('🔄 [SUGERENCIAS] Usando fallback local mejorado');
                return generarSugerenciasLocales(texto);
            }

            return sugerenciasOptimizadas;

        } catch (error) {
            console.error('❌ [SUGERENCIAS] Error:', error);

            // FALLBACK LOCAL MEJORADO
            console.log('🔄 [SUGERENCIAS] Usando fallback local por error');
            return generarSugerenciasLocales(texto);
        }
    }, [datos, apiConfig?.endpoint]);

    // NUEVA FUNCIÓN: Generar sugerencias locales con servicios separados
    const generarSugerenciasLocales = useCallback((texto: string): string[] => {
        const textoLower = texto.toLowerCase();

        // NUEVO: Usar Set para evitar duplicados
        const todasLasSugerencias = new Set<string>();

        // EXTRAER SERVICIOS INDIVIDUALES
        datos.forEach(job => {
            if (job.service) {
                job.service
                    .split(',')
                    .map(servicio => servicio.trim())
                    .filter(servicio =>
                        servicio &&
                        servicio.toLowerCase().includes(textoLower) &&
                        servicio.length > 0
                    )
                    .forEach(servicio => todasLasSugerencias.add(servicio));
            }
        });

        // FUNCIÓN PARA VERIFICAR DUPLICIDAD
        const estaContenidoEnServicios = (termino: string): boolean => {
            const terminoLower = termino.toLowerCase();
            const serviciosArray = Array.from(todasLasSugerencias);

            return serviciosArray.some(servicio =>
                servicio.toLowerCase().includes(terminoLower) ||
                terminoLower.includes(servicio.toLowerCase())
            );
        };

        // EXTRAER OTROS CAMPOS (SOLO SI NO ESTÁN YA EN LOS SERVICIOS)
        datos.forEach(job => {
            // Título - solo agregar si no es similar a servicios existentes
            if (job.title &&
                job.title.toLowerCase().includes(textoLower) &&
                !estaContenidoEnServicios(job.title)) {
                todasLasSugerencias.add(job.title);
            }

            // Especialidad - solo agregar si no es similar a servicios existentes
            if (job.especialidad &&
                job.especialidad.toLowerCase().includes(textoLower) &&
                !estaContenidoEnServicios(job.especialidad)) {
                todasLasSugerencias.add(job.especialidad);
            }

            // Empresa - solo agregar si no es similar a servicios existentes
            if (job.company &&
                job.company.toLowerCase().includes(textoLower) &&
                !estaContenidoEnServicios(job.company)) {
                todasLasSugerencias.add(job.company);
            }
        });

        const sugerenciasFinales = Array.from(todasLasSugerencias).slice(0, 8);

        console.log('🔍 [SUGERENCIAS-LOCAL] Servicios individuales encontrados:', Array.from(todasLasSugerencias));
        console.log('✅ [SUGERENCIAS-LOCAL] Sugerencias finales sin duplicados:', sugerenciasFinales);

        return sugerenciasFinales;
    }, [datos]);


    
    // SELECCIONAR SUGERENCIA
    const seleccionarSugerencia = useCallback(async (texto: string) => {
        console.log('🎯 [SUGERENCIA] Seleccionada:', texto);

        setQuery(texto);
        setSugerencias([]);
        setMensaje("");
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);
        setMensajeNoResultados("");

        await ejecutarBusquedaCompleta(texto, true, false);
    }, [ejecutarBusquedaCompleta]);

    // SELECCIONAR DEL HISTORIAL
    const manejarSeleccionHistorial = useCallback(async (texto: string) => {
    const textoSeleccionado = seleccionarDelHistorial(texto) || "";
    setQuery(textoSeleccionado);
    setSugerencias([]);
    setMensaje("");
    setMostrarSugerencias(false);
    setMensajeNoResultados("");

    if (textoSeleccionado) {
        await ejecutarBusquedaCompleta(textoSeleccionado, true, false);
    }
}, [seleccionarDelHistorial, ejecutarBusquedaCompleta]);


    const ejecutarBusqueda = useCallback(async () => {
        await ejecutarBusquedaCompleta(query, true, false);
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
        setMensajeNoResultados("");
        terminoBusquedaAnterior.current = "";
        busquedaEnCurso.current = false;

        onSearch("", datos);
        inputRef.current?.focus();
    }, [datos, onSearch, setMostrarHistorialLocal]);

    const manejarKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setMostrarSugerencias(false);
            setMostrarHistorialLocal(false);
            ejecutarBusqueda();
        } else if (e.key === 'Escape') {
            setMostrarSugerencias(false);
            setMostrarHistorialLocal(false);
            setInputFocused(false);
            inputRef.current?.blur();
        }
    }, [ejecutarBusqueda, setMostrarHistorialLocal]);

    // EFECTO PARA SUGERENCIAS
    useEffect(() => {
        if (debounceSugerenciasRef.current) {
            clearTimeout(debounceSugerenciasRef.current);
        }

        const texto = query.trim();

        if (texto.length >= 1 && inputFocused) {
            setEstadoSugerencias("loading");
            setMostrarSugerencias(true);

            debounceSugerenciasRef.current = setTimeout(async () => {
                try {
                    console.log('🔍 [SUGERENCIAS] Buscando para:', texto);
                    const sugerenciasBackend = await buscarSugerencias(texto);

                    if (query.trim() === texto) {
                        setSugerencias(sugerenciasBackend);
                        setEstadoSugerencias(sugerenciasBackend.length > 0 ? "success" : "success");
                        setMostrarSugerencias(true);

                        if (sugerenciasBackend.length === 0) {
                            setMensajeNoResultados(`No se encontraron coincidencias para "${texto}"`);
                        } else {
                            setMensajeNoResultados("");
                        }
                    }
                } catch (error) {
                    console.error('❌ [SUGERENCIAS] Error:', error);
                    setEstadoSugerencias("error");
                    setSugerencias([]);
                }
            }, 400);
        } else {
            setSugerencias([]);
            setEstadoSugerencias("idle");
            setMostrarSugerencias(false);
        }

        return () => {
            if (debounceSugerenciasRef.current) {
                clearTimeout(debounceSugerenciasRef.current);
            }
        };
    }, [query, inputFocused, buscarSugerencias]);

    // EFECTO PARA BÚSQUEDA AUTOMÁTICA
    useEffect(() => {
        if (debounceBusquedaRef.current) {
            clearTimeout(debounceBusquedaRef.current);
        }

        const texto = query.trim();

        if (texto.length >= 2 && inputFocused && texto !== terminoBusquedaAnterior.current && !busquedaEnCurso.current) {
            console.log('🚀 [BÚSQUEDA-AUTO] Programando búsqueda automática:', texto);

            debounceBusquedaRef.current = setTimeout(() => {
                if (query.trim() === texto) {
                    console.log('📊 [BÚSQUEDA-AUTO] Ejecutando búsqueda para:', texto);
                    terminoBusquedaAnterior.current = texto;
                    setLoadingResultados(true);
                    ejecutarBusquedaCompleta(texto, false, false);
                }
            }, 700);
        }

        return () => {
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
    }, [setMostrarHistorialLocal]);

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
                                setMensajeNoResultados("");
                                onSearch("", datos);
                                terminoBusquedaAnterior.current = "";
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
                                        const sugerenciasBackend = await buscarSugerencias(query);
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

                {/* Mostrar loading en área de resultados */}
                {loadingResultados && (
                    <div className="loading-resultados">
                        <div className="spinner-resultados"></div>
                        <p>Buscando resultados...</p>
                    </div>
                )}

                {/* HISTORIAL */}
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
                                onClick={() => manejarSeleccionHistorial(item)}
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

                {/* SUGERENCIAS */}
                {mostrarSugerencias && (
                    <>
                        {estadoSugerencias === "loading" && (
                            <div className="caja-sugerencias cargando">
                                <div className="spinner"></div>
                                Buscando sugerencias...
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