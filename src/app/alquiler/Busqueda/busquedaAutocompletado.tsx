'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { Job } from "../paginacion/types/job";
import "./busqueda.css";
import { Trash2 } from "lucide-react";

import { normalizarGoogle, normalizarQueryBusqueda, analizarCaracteresQuery, tieneCaracteresProblema, generarHashTexto } from "./normalizacion";

import { useSearchHistory } from './hooks/useHistorialBusqueda';

type EstadoSugerencias = "idle" | "loading" | "error" | "success";
type EstadoBusqueda = "idle" | "loading" | "success" | "error" | "sinResultados";

interface BusquedaAutocompletadoProps {
    onSearch: (searchTerm: string, resultados: Job[], actualizarUrl?: boolean) => void;
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

// ============================================================================
// SERVICIO DE BACKEND
// ============================================================================

class BackendService {
    private static API_BASE = getApiRoot();

    static async searchJobsBackend(query: string, endpoint?: string): Promise<Job[]> {
        try {
            console.log('🚀 [BACKEND-INICIO] Buscando por inicio de palabra:', query);

            const queryNormalizado = query;
            const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

            if (tokens.length === 0) {
                return [];
            }

            console.log('🔄 [BACKEND-INICIO] Tokens para búsqueda:', tokens);
            const payload = {
                queryOriginal: query,
                queryNormalizado: queryNormalizado,
                tokens: tokens,
                estrategias: tokens,
                campos: ['title', 'company', 'service', 'description'],
                config: {
                    caseInsensitive: true,
                    ignoreAccents: true,
                    fuzzyMatch: false,
                    partialMatch: false,
                    buscarPorInicioPalabra: true,
                    buscarEnServiciosIndividuales: true
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
                console.log('✅ [BACKEND-INICIO] Respuesta recibida:', data);

                // 🔥 MODIFICADO: Si success es true pero data está vacío, devolver array vacío
                if (data.success && data.data && Array.isArray(data.data)) {
                    console.log(`✅ [BACKEND-INICIO] ${data.data.length} resultados del backend`);
                    return data.data.slice(0, 50);
                } else if (data.success) {
                    // Backend respondió con éxito pero sin datos
                    console.log('ℹ️ [BACKEND-INICIO] Backend respondió sin datos');
                    return [];
                }
            }

            console.log('⚠️ [BACKEND-INICIO] Respuesta no válida');
            throw new Error('Backend response not valid');

        } catch (error) {
            console.log('❌ [BACKEND-INICIO] Error:', error);
            throw error;
        }
    }

    static async searchByEspecialidadBackend(especialidad: string): Promise<Job[]> {
        if (!especialidad.trim()) {
            return [];
        }

        console.log('🎯 [ESPECIALIDAD-BACKEND-INICIO] Buscando por especialidad:', especialidad);

        try {
            const especialidadNormalizada = normalizarQueryBusqueda(especialidad);
            const tokens = especialidadNormalizada.split(' ').filter(token => token.length > 0);

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
                    especialidadNormalizada: especialidadNormalizada,
                    tokens: tokens,
                    estrategias: tokens,
                    buscarPorInicioPalabra: true,
                    buscarEnServiciosIndividuales: true
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && Array.isArray(data.data)) {
                    console.log(`✅ [ESPECIALIDAD-BACKEND-INICIO] ${data.data.length} resultados`);
                    return data.data;
                }
            }

            throw new Error('Backend response not valid');

        } catch (error) {
            console.log('❌ [ESPECIALIDAD-BACKEND-INICIO] Error:', error);
            throw error;
        }
    }

    static async getAutocompleteSuggestionsBackend(query: string, endpoint?: string): Promise<string[]> {
        try {
            console.log('🔍 [SUGERENCIAS-BACKEND-INICIO] Buscando sugerencias para:', query);

            const queryNormalizado = normalizarQueryBusqueda(query);

            const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/autocomplete`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const url = `${apiEndpoint}?q=${encodeURIComponent(queryNormalizado)}&limit=6&inicioPalabra=true`;

            const response = await fetch(url, { signal: controller.signal });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data: ApiResponse = await response.json();
                console.log('✅ [SUGERENCIAS-BACKEND-INICIO] Respuesta completa del backend:', data);

                // 🔥 CLAVE: Si success es true, devolver data (aunque esté vacío)
                if (data.success) {
                    if (data.data && Array.isArray(data.data)) {
                        const sugerencias = data.data
                            .map((item: EspecialidadBackend) => item.nombre)
                            .filter((nombre: string) => nombre && nombre.trim())
                            .slice(0, 10);

                        console.log('📋 [SUGERENCIAS-BACKEND-INICIO] Sugerencias procesadas:', sugerencias);
                        return sugerencias; // ← Puede ser array vacío
                    } else {
                        console.log('ℹ️ [SUGERENCIAS-BACKEND-INICIO] Backend: success=true pero data no es array');
                        return []; // ← Array vacío explícito
                    }
                } else {
                    console.log('❌ [SUGERENCIAS-BACKEND-INICIO] Backend: success=false');
                    throw new Error('Backend response not successful');
                }
            }

            console.log('⚠️ [SUGERENCIAS-BACKEND-INICIO] Respuesta HTTP no ok:', response.status);
            throw new Error(`HTTP ${response.status}`);

        } catch (error) {
            console.log('❌ [SUGERENCIAS-BACKEND-INICIO] Error:', error);
            throw error; // ← Propagar el error para que el servicio principal lo maneje
        }
    }
}

// ============================================================================
// SERVICIO LOCAL UNIFICADO - SOLO COMO FALLBACK
// ============================================================================

class LocalService {
    static buscarTrabajos(query: string, jobs: Job[], campoBusqueda: keyof Job | "all" = "all"): Job[] {
        console.log('🔍 [LOCAL-FALLBACK] Buscando localmente:', query);

        if (!query.trim()) return [];

        const queryNormalizado = normalizarQueryBusqueda(query);
        const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

        if (tokens.length === 0) return [];

        return jobs.filter(job => {
            if (campoBusqueda === "all") {
                const tituloNormalizado = job.title ? this.normalizarTexto(job.title) : "";
                const empresaNormalizada = job.company ? this.normalizarTexto(job.company) : "";
                const serviciosNormalizados = job.service ? this.normalizarTexto(job.service) : "";

                const campos = [tituloNormalizado, empresaNormalizada, serviciosNormalizados];

                return tokens.every(token =>
                    campos.some(campoTexto => {
                        if (!campoTexto) return false;
                        const palabras = campoTexto.split(' ');
                        return palabras.some(palabra => palabra.startsWith(token));
                    })
                );
            } else {
                const campoValor = job[campoBusqueda];
                if (!campoValor) return false;

                const campoNormalizado = this.normalizarTexto(String(campoValor));
                const palabras = campoNormalizado.split(' ');

                return tokens.every(token =>
                    palabras.some(palabra =>
                        palabra.startsWith(token) && token.length >= 2
                    )
                );
            }
        }).slice(0, 50);
    }

    static getSugerencias(query: string, jobs: Job[]): string[] {
        console.log('💡 [SUGERENCIAS-LOCAL-FALLBACK] Generando sugerencias locales para:', query);

        if (!query.trim() || query.trim().length < 2) {
            console.log('⏸️ [SUGERENCIAS-LOCAL-FALLBACK] Query muy corta, omitiendo');
            return [];
        }

        const queryNormalizado = normalizarQueryBusqueda(query);
        const sugerencias = new Set<string>();

        jobs.forEach(job => {
            if (job.service) {
                const servicios = job.service.split(',').map(s => s.trim());

                servicios.forEach(servicio => {
                    const servicioNormalizado = this.normalizarTexto(servicio);

                    if (servicioNormalizado.startsWith(queryNormalizado)) {
                        sugerencias.add(servicio);
                        return;
                    }

                    const palabrasServicio = servicioNormalizado.split(' ');
                    const coincideEnPalabra = palabrasServicio.some(palabra =>
                        palabra.startsWith(queryNormalizado)
                    );

                    if (coincideEnPalabra) {
                        sugerencias.add(servicio);
                    }
                });
            }
        });

        jobs.forEach(job => {
            const campos = ['title', 'company'] as const;
            campos.forEach(campo => {
                if (job[campo]) {
                    const valorCampo = String(job[campo]);
                    const campoNormalizado = this.normalizarTexto(valorCampo);

                    if (campoNormalizado.startsWith(queryNormalizado)) {
                        sugerencias.add(valorCampo);
                        return;
                    }

                    const palabrasCampo = campoNormalizado.split(' ');
                    const coincideEnPalabra = palabrasCampo.some(palabra =>
                        palabra.startsWith(queryNormalizado)
                    );

                    if (coincideEnPalabra) {
                        sugerencias.add(valorCampo);
                    }
                }
            });
        });

        const sugerenciasArray = Array.from(sugerencias);

        const sugerenciasOrdenadas = sugerenciasArray.sort((a, b) => {
            const aNormalizado = this.normalizarTexto(a);
            const bNormalizado = this.normalizarTexto(b);

            const aEmpiezaExacto = aNormalizado.startsWith(queryNormalizado);
            const bEmpiezaExacto = bNormalizado.startsWith(queryNormalizado);

            if (aEmpiezaExacto && !bEmpiezaExacto) return -1;
            if (!aEmpiezaExacto && bEmpiezaExacto) return 1;

            if (a.length !== b.length) return a.length - b.length;

            return aNormalizado.localeCompare(bNormalizado);
        });

        const sugerenciasFinales = sugerenciasOrdenadas.slice(0, 10);
        console.log('✅ [SUGERENCIAS-LOCAL-FALLBACK] Sugerencias locales encontradas:', sugerenciasFinales);
        return sugerenciasFinales;
    }

    private static normalizarTexto(texto: string): string {
        if (!texto) return "";
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[´'"]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }
}

// ============================================================================
// SERVICIO PRINCIPAL - PRIORIDAD AL BACKEND
// ============================================================================

class BusquedaService {
    private static API_BASE = getApiRoot();

    // 🔥 FUNCIÓN: Calcular puntaje de relevancia DESDE FRONTEND
    private static calcularRelevancia(job: Job, query: string): number {
        const queryNormalizado = normalizarQueryBusqueda(query);
        const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

        let puntaje = 0;

        if (!job.title) return puntaje;

        const tituloNormalizado = this.normalizarTexto(job.title);
        const empresaNormalizada = job.company ? this.normalizarTexto(job.company) : "";
        const serviciosNormalizados = job.service ? this.normalizarTexto(job.service) : "";

        console.log('🔍 [RELEVANCIA] Calculando para:', {
            titulo: job.title,
            query: query,
            tituloNormalizado: tituloNormalizado,
            queryNormalizado: queryNormalizado
        });

        // 🔥 MÁXIMA PRIORIDAD: Coincidencia EXACTA del nombre completo
        if (tituloNormalizado === queryNormalizado) {
            puntaje += 1000;
            console.log('🎯 [RELEVANCIA] Coincidencia EXACTA +1000');
        }

        // 🔥 ALTA PRIORIDAD: El query contiene el nombre completo
        if (tituloNormalizado.includes(queryNormalizado)) {
            puntaje += 500;
            console.log('🎯 [RELEVANCIA] Query contiene nombre completo +500');
        }

        // 🔥 ALTA PRIORIDAD: El nombre contiene el query completo
        if (queryNormalizado.includes(tituloNormalizado)) {
            puntaje += 400;
            console.log('🎯 [RELEVANCIA] Nombre contiene query +400');
        }

        // 🔥 COINCIDENCIA DE TODAS LAS PALABRAS EN ORDEN
        const palabrasTitulo = tituloNormalizado.split(' ');
        const todasLasPalabrasCoinciden = tokens.every(token =>
            palabrasTitulo.some(palabra => palabra.includes(token))
        );

        if (todasLasPalabrasCoinciden) {
            puntaje += 300;
            console.log('🎯 [RELEVANCIA] Todas las palabras coinciden +300');
        }

        // 🔥 COINCIDENCIA POR PALABRAS INDIVIDUALES
        tokens.forEach(token => {
            // Coincidencia exacta de palabra en título
            if (tituloNormalizado.includes(token)) {
                puntaje += 50;
                console.log(`🎯 [RELEVANCIA] Coincidencia palabra "${token}" en título +50`);
            }

            // 🔥 BONUS: Coincidencia al INICIO de palabra en título
            if (palabrasTitulo.some(palabra => palabra.startsWith(token))) {
                puntaje += 30;
                console.log(`🎯 [RELEVANCIA] Inicio de palabra "${token}" en título +30`);
            }

            // Coincidencia en empresa
            if (empresaNormalizada.includes(token)) {
                puntaje += 20;
                console.log(`🎯 [RELEVANCIA] Coincidencia en empresa "${token}" +20`);
            }

            // Coincidencia en servicios
            if (serviciosNormalizados.includes(token)) {
                puntaje += 10;
                console.log(`🎯 [RELEVANCIA] Coincidencia en servicios "${token}" +10`);
            }
        });

        // 🔥 BONUS: Orden correcto de las palabras
        const tituloConEspacios = ` ${tituloNormalizado} `;
        let ordenCorrecto = true;
        let posicionAnterior = -1;

        for (const token of tokens) {
            const posicion = tituloConEspacios.indexOf(` ${token}`);
            if (posicion > posicionAnterior) {
                posicionAnterior = posicion;
            } else {
                ordenCorrecto = false;
                break;
            }
        }

        if (ordenCorrecto && tokens.length > 1) {
            puntaje += 100;
            console.log('🎯 [RELEVANCIA] Orden correcto de palabras +100');
        }

        console.log(`📊 [RELEVANCIA] Puntaje final para "${job.title}": ${puntaje}`);
        return puntaje;
    }

    // 🔥 FUNCIÓN: Ordenar resultados por relevancia DESDE FRONTEND
    public static ordenarPorRelevancia(resultados: Job[], query: string): Job[] {
        if (!query.trim() || resultados.length === 0) {
            return resultados;
        }

        console.log('🎯 [RELEVANCIA] Ordenando resultados por relevancia...');

        const resultadosConPuntaje = resultados.map(job => ({
            job,
            puntaje: this.calcularRelevancia(job, query)
        }));

        // Orden descendente (mayor relevancia primero)
        resultadosConPuntaje.sort((a, b) => {
            if (b.puntaje !== a.puntaje) {
                return b.puntaje - a.puntaje;
            }

            // 🔥 DESEMPATE: Si mismo puntaje, priorizar mejor rating
            const ratingA = a.job.rating || 0;
            const ratingB = b.job.rating || 0;
            return ratingB - ratingA;
        });

        const resultadosOrdenados = resultadosConPuntaje.map(item => item.job);

        console.log('📋 [RELEVANCIA] Resultados ordenados:');
        resultadosConPuntaje.forEach((item, index) => {
            console.log(`   ${index + 1}. "${item.job.title}" - Puntaje: ${item.puntaje}`);
        });

        return resultadosOrdenados;
    }

    private static normalizarTexto(texto: string): string {
        if (!texto) return "";
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[´'"]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    // 🔥 NUEVO: Búsqueda de trabajos con fallback automático similar
    static async searchJobsOptimized(query: string, jobsReales: Job[], endpoint?: string): Promise<Job[]> {
        try {
            console.log('🔍 [SERVICE-BACKEND-PRIORITY] Buscando primero en backend:', query);

            if (!query.trim()) {
                return [];
            }

            const queryNormalizado = query;
            console.log('✅ [SERVICE] Query ya normalizado desde componente:', queryNormalizado);

            const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

            if (tokens.length === 0) {
                return [];
            }

            // 1. INTENTAR BACKEND PRIMERO
            const resultadosBackend = await BackendService.searchJobsBackend(queryNormalizado, endpoint);

            if (resultadosBackend && resultadosBackend.length > 0) {
                console.log(`✅ [BACKEND-PRIORITY] ${resultadosBackend.length} resultados del backend`);
                const resultadosOrdenados = this.ordenarPorRelevancia(resultadosBackend, query);
                return resultadosOrdenados;
            }

            // 2. Si backend responde pero sin resultados (array vacío), usar FALLBACK LOCAL AUTOMÁTICO
            console.log('🔄 [BACKEND-PRIORITY] Backend respondió sin resultados, usando fallback local');
            const resultadosLocales = LocalService.buscarTrabajos(query, jobsReales);
            return this.ordenarPorRelevancia(resultadosLocales, query);

        } catch (error) {
            console.log('🔄 [BACKEND-PRIORITY] Backend falló, usando local como fallback:', error);
            const resultadosLocales = LocalService.buscarTrabajos(query, jobsReales);
            return this.ordenarPorRelevancia(resultadosLocales, query);
        }
    }
    static async searchByEspecialidad(especialidad: string, jobsReales: Job[]): Promise<Job[]> {
        if (!especialidad.trim()) {
            return [];
        }

        console.log('🎯 [ESPECIALIDAD-BACKEND-PRIORITY] Buscando por especialidad:', especialidad);

        try {
            const resultadosBackend = await BackendService.searchByEspecialidadBackend(especialidad);
            return resultadosBackend;
        } catch (backendError) {
            console.log('🔄 [ESPECIALIDAD-BACKEND-PRIORITY] Backend falló, usando local como fallback');
            return LocalService.buscarTrabajos(especialidad, jobsReales);
        }
    }

    static async getAutocompleteSuggestions(query: string, jobsReales: Job[], endpoint?: string): Promise<string[]> {
        try {
            console.log('🔍 [SUGERENCIAS-BACKEND-PRIORITY] Buscando sugerencias en backend:', query);

            // 1. INTENTAR BACKEND PRIMERO SIEMPRE
            const sugerenciasBackend = await BackendService.getAutocompleteSuggestionsBackend(query, endpoint);

            console.log('📊 [SUGERENCIAS-BACKEND-PRIORITY] Respuesta backend:', {
                tieneSugerencias: sugerenciasBackend && sugerenciasBackend.length > 0,
                cantidad: sugerenciasBackend?.length || 0,
                sugerencias: sugerenciasBackend
            });

            // 2. SI el backend responde con array vacío (success:true pero data:[]), usar FALLBACK LOCAL
            if (sugerenciasBackend && sugerenciasBackend.length === 0) {
                console.log('🔄 [SUGERENCIAS-BACKEND-PRIORITY] Backend respondió con array VACÍO, usando FALLBACK LOCAL');
                const sugerenciasLocales = LocalService.getSugerencias(query, jobsReales);
                console.log('💡 [SUGERENCIAS-LOCAL] Sugerencias locales encontradas:', sugerenciasLocales);
                return sugerenciasLocales;
            }

            // 3. SI el backend tiene sugerencias, usarlas
            if (sugerenciasBackend && sugerenciasBackend.length > 0) {
                console.log('✅ [SUGERENCIAS-BACKEND-PRIORITY] Usando sugerencias del backend');
                return sugerenciasBackend;
            }

            // 4. Por seguridad, si llegamos aquí, usar local
            console.log('🔄 [SUGERENCIAS-BACKEND-PRIORITY] Caso inesperado, usando fallback local');
            return LocalService.getSugerencias(query, jobsReales);

        } catch (error) {
            console.log('🔄 [SUGERENCIAS-BACKEND-PRIORITY] Backend falló, usando local como fallback:', error);
            const sugerenciasLocales = LocalService.getSugerencias(query, jobsReales);
            console.log('💡 [SUGERENCIAS-LOCAL] Sugerencias locales por error:', sugerenciasLocales);
            return sugerenciasLocales;
        }
    }
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

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

    // 🔥 REFERENCIAS SEPARADAS PARA COMPORTAMIENTO AMAZON
    const debounceSugerenciasRef = useRef<NodeJS.Timeout | null>(null);
    const debounceResultadosRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminoBusquedaAnteriorSugerencias = useRef("");
    const terminoBusquedaAnteriorResultados = useRef("");
    const busquedaEnCurso = useRef(false);
    const desactivarBusquedaAutomatica = useRef(false);

    // 🔥 NUEVAS REFERENCIAS para búsqueda local - AÑADE ESTO
    const debounceSugerenciasLocalesRef = useRef<NodeJS.Timeout | null>(null);
    const debounceResultadosLocalesRef = useRef<NodeJS.Timeout | null>(null);
    // USAR HOOK DE HISTORIAL
    const {
        historial,
        cargandoHistorial,
        mostrarHistorialLocal,
        setMostrarHistorialLocal,
        guardarEnHistorial,
        limpiarHistorialBackend,
        eliminarDelHistorial,
        seleccionarDelHistorial,
        indiceSeleccionado,
        setIndiceSeleccionado,
        seleccionarPorIndice
    } = useSearchHistory({
        mostrarHistorial,
        apiConfig
    });

    // 🔥 MODIFICADO: Flujo exacto solicitado - Primero analizarCaracteresQuery, luego normalizarGoogle
    const ejecutarBusquedaCompleta = useCallback(async (
        texto: string,
        guardarEnHistorialFlag: boolean = true,
        esEspecialidad: boolean = false,
        actualizarUrl: boolean = true
    ) => {

        // 🛑 DETENER BÚSQUEDAS REPETIDAS
        if (busquedaEnCurso.current) {
            console.log('⏸️ [BÚSQUEDA] Ya hay una búsqueda en curso, omitiendo...');
            return;
        }


        // Esto es síncrono. La próxima vez que se renderice, esto será 'true'.
        busquedaEnCurso.current = true;
        const textoLimpio = texto.trim();

        // Hay que cancelarlos para que no compitan.
        if (debounceSugerenciasRef.current) {
            clearTimeout(debounceSugerenciasRef.current);
        }
        if (debounceResultadosRef.current) {
            clearTimeout(debounceResultadosRef.current);
        }
        if (debounceSugerenciasLocalesRef.current) {
            clearTimeout(debounceSugerenciasLocalesRef.current);
        }

        if (guardarEnHistorialFlag && mostrarHistorial) {
            guardarEnHistorial(textoLimpio);
        }

        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);
        setLoadingResultados(true);
        setEstadoBusqueda("loading");



        console.log('🚀 [BÚSQUEDA-COMPLETA] Iniciando búsqueda para:', textoLimpio, 'actualizarUrl:', actualizarUrl);

        // 🔥 PASO 1: ANALIZAR CARACTERES PROBLEMA
        const analisis = analizarCaracteresQuery(textoLimpio);


        if (analisis.tieneProblema) {
            console.log('🚫 [BÚSQUEDA] Caracteres problema detectados - Mostrando mensaje de no resultados');

            // 🔥 MOSTRAR MENSAJE COMO SI FUERA BÚSQUEDA SIN RESULTADOS
            setMensajeNoResultados(`No se encontraron resultados para "${textoLimpio}"`);
            setEstadoBusqueda("sinResultados");
            setLoadingResultados(false);
            setResultados([]);

            // Informar al padre con array vacío
            onSearch(textoLimpio, [], actualizarUrl);
            busquedaEnCurso.current = false;
            return; // 🔥 SALIR - NO PASA A NORMALIZACIÓN
        }



        // 🔥 PASO 2: SI NO HAY CARACTERES PROBLEMA, ENTONCES NORMALIZAR
        let queryParaBuscar: string;

        try {
            // 🔥 ESTO ES LO QUE QUERÍAS - Primero analizar, luego normalizar si pasa
            queryParaBuscar = normalizarQueryBusqueda(textoLimpio);
            console.log('✅ [BÚSQUEDA] Query normalizado:', queryParaBuscar, '← Original:', textoLimpio);
        } catch (error) {
            // 🔥 POR SEGURIDAD - aunque analizarCaracteresQuery ya filtró, por si acaso
            console.log('🚫 [BÚSQUEDA] Error en normalización:', error);
            setMensajeNoResultados(`No se encontraron resultados para "${textoLimpio}"`);
            setEstadoBusqueda("sinResultados");
            setLoadingResultados(false);
            setResultados([]);
            onSearch(textoLimpio, [], actualizarUrl);
            busquedaEnCurso.current = false;
            return;
        }

        // 🔥 CONTINUAR CON VALIDACIONES NORMALES (longitud, etc.)
        if (textoLimpio.length > 80) {
            setMensaje("La búsqueda no puede exceder 80 caracteres");
            setEstadoBusqueda("error");
            setLoadingResultados(false);
            busquedaEnCurso.current = false;
            return;
        }

        if (textoLimpio.length < 2) {
            setMensaje("La búsqueda debe tener al menos 2 caracteres");
            setEstadoBusqueda("idle");
            setResultados([]);
            setLoadingResultados(false);
            setMensajeNoResultados("");
            onSearch("", [], actualizarUrl);
            busquedaEnCurso.current = false;
            return;
        }


        if (analisis.tieneSeparadores) {
            setMensajeNoResultados(analisis.mensaje || "Búsqueda con separadores");
        }

        terminoBusquedaAnteriorResultados.current = textoLimpio;



        try {
            console.log('🔍 [BÚSQUEDA] Buscando trabajos con query normalizado:', queryParaBuscar);

            let resultadosFinales: Job[] = [];

            if (esEspecialidad) {
                resultadosFinales = await BusquedaService.searchByEspecialidad(textoLimpio, datos);
            } else {
                // 🔥 ENVIAR EL QUERY NORMALIZADO AL SERVICIO
                resultadosFinales = await BusquedaService.searchJobsOptimized(queryParaBuscar, datos, apiConfig?.endpoint);
            }

            console.log('📊 [BÚSQUEDA] Resultados encontrados:', resultadosFinales.length);

            setResultados(resultadosFinales);
            setEstadoBusqueda("success");

            if (resultadosFinales.length > 0) {
                setMensajeNoResultados("");
                onSearch(textoLimpio, resultadosFinales, actualizarUrl);
            } else {
                setMensajeNoResultados(`No se encontraron resultados para "${textoLimpio}"`);
                onSearch(textoLimpio, [], actualizarUrl);
            }

        } catch (error) {
            console.error("❌ [BÚSQUEDA] Error:", error);
            setEstadoBusqueda("error");
            setMensajeNoResultados(`Error en la búsqueda para "${textoLimpio}"`);
            onSearch(textoLimpio, [], actualizarUrl);
            busquedaEnCurso.current = false;

        } finally {
            setLoadingResultados(false);
            busquedaEnCurso.current = false;
        }
    }, [datos, onSearch, guardarEnHistorial, mostrarHistorial, apiConfig?.endpoint,setMostrarSugerencias,
    setMostrarHistorialLocal,
    setLoadingResultados,
    setEstadoBusqueda,
    setMensajeNoResultados,
    setResultados,
    setMensaje]);

    // 🔥 CORREGIDO: Selección de sugerencia AHORA actualiza URL
    const seleccionarSugerencia = useCallback(async (texto: string) => {
        console.log('🎯 [SUGERENCIA] Iniciando selección...');

        desactivarBusquedaAutomatica.current = true;

        // Limpiar todos los timeouts
        if (debounceSugerenciasRef.current) {
            clearTimeout(debounceSugerenciasRef.current);
            debounceSugerenciasRef.current = null;
        }
        if (debounceResultadosRef.current) {
            clearTimeout(debounceResultadosRef.current);
            debounceResultadosRef.current = null;
        }

        setQuery(texto);
        setSugerencias([]);
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);

        // 🔥 PIERDE EL FOCUS DESPUÉS DE SELECCIONAR
        inputRef.current?.blur();
        setInputFocused(false);

        console.log('🚀 [SUGERENCIA] Ejecutando búsqueda desde sugerencia...');
        await ejecutarBusquedaCompleta(texto, true, false, true);

        setTimeout(() => {
            desactivarBusquedaAutomatica.current = false;
            console.log('🔄 [AMAZON] Búsqueda dinámica reactivada después de selección');
        }, 3000);

    }, [ejecutarBusquedaCompleta]);

    // ============================================================================
    // 🔥 NUEVO: useEffect PARA SUGERENCIAS LOCALES EN TIEMPO REAL
    // ============================================================================
    useEffect(() => {

        if (busquedaEnCurso.current) {
            console.log('🚫 [SUGERENCIAS] Omitido, búsqueda completa en curso.');
            return;
        }


        if (debounceSugerenciasLocalesRef.current) {
            clearTimeout(debounceSugerenciasLocalesRef.current);
        }

        const texto = query.trim();
        const textoNormalizado = normalizarGoogle(texto, "sugerencias");

        // Condiciones para mostrar sugerencias locales
        const debeBuscarSugerenciasLocales = Boolean(
            inputFocused &&
            texto.length >= 1 &&
            !busquedaEnCurso.current
        );

        console.log('🔍 [SUGERENCIAS-LOCALES-REAL-TIME] Estado:', {
            texto,
            textoNormalizado,
            inputFocused,
            debeBuscarSugerenciasLocales,
            busquedaEnCurso: busquedaEnCurso.current
        });

        if (debeBuscarSugerenciasLocales) {
            debounceSugerenciasLocalesRef.current = setTimeout(async () => {
                if (busquedaEnCurso.current) {
                    console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
                    return;
                }
                try {
                    if (busquedaEnCurso.current) {
                        console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
                        return;
                    }
                    console.log('🚀 [SUGERENCIAS-LOCALES-REAL-TIME] Buscando sugerencias locales para:', texto);

                    // 🔥 BUSCAR SUGERENCIAS LOCALES DIRECTAMENTE
                    const sugerenciasLocales = LocalService.getSugerencias(texto, datos);

                    console.log('💡 [SUGERENCIAS-LOCALES-REAL-TIME] Resultados locales:', {
                        texto,
                        sugerencias: sugerenciasLocales,
                        cantidad: sugerenciasLocales.length
                    });

                    // ✅ ACTUALIZAR ESTADO DE SUGERENCIAS
                    setSugerencias(sugerenciasLocales);
                    setEstadoSugerencias(sugerenciasLocales.length > 0 ? "success" : "success");

                    if (sugerenciasLocales.length === 0) {
                        setMensajeNoResultados(`No se encontraron sugerencias para "${texto}"`);
                    } else {
                        setMensajeNoResultados("");
                    }

                } catch (error) {
                    console.error('❌ [SUGERENCIAS-LOCALES-REAL-TIME] Error:', error);
                    setEstadoSugerencias("error");
                    setSugerencias([]);
                }
            }, 200); // Debounce más corto para respuesta más rápida
        } else {
            // Si no debe buscar, limpiar sugerencias
            if (texto.length === 0) {
                setSugerencias([]);
                setEstadoSugerencias("idle");
                setMensajeNoResultados("");
            }
        }

        return () => {
            if (debounceSugerenciasLocalesRef.current) {
                clearTimeout(debounceSugerenciasLocalesRef.current);
            }
        };
    }, [query, inputFocused, datos, onSearch]);

    // ============================================================================
    // 🔥 NUEVO: useEffect PARA RESULTADOS LOCALES EN TIEMPO REAL  
    // ============================================================================
    useEffect(() => {

        if (busquedaEnCurso.current) {
            console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
            return;
        }

        if (debounceResultadosLocalesRef.current) {
            clearTimeout(debounceResultadosLocalesRef.current);
        }

        const texto = query.trim();
        const textoNormalizado = normalizarGoogle(texto, "sugerencias");

        // Condiciones para búsqueda local automática
        const debeBuscarResultadosLocales = Boolean(
            inputFocused &&
            texto.length >= 2 && // Desde 2 caracteres para resultados
            !busquedaEnCurso.current &&
            !desactivarBusquedaAutomatica.current
        );

        console.log('🔍 [RESULTADOS-LOCALES-REAL-TIME] Estado:', {
            texto,
            textoNormalizado,
            inputFocused,
            debeBuscarResultadosLocales,
            busquedaEnCurso: busquedaEnCurso.current
        });

        if (debeBuscarResultadosLocales) {
            debounceResultadosLocalesRef.current = setTimeout(async () => {
                if (busquedaEnCurso.current) {
                    console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
                    return;
                }
                try {
                    if (busquedaEnCurso.current) {
                        console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
                        return;
                    }
                    console.log('🚀 [RESULTADOS-LOCALES-REAL-TIME] Buscando resultados locales para:', texto);

                    // 🔥 BUSCAR RESULTADOS LOCALES DIRECTAMENTE
                    const resultadosLocales = LocalService.buscarTrabajos(texto, datos, campoBusqueda);
                    const resultadosOrdenados = BusquedaService.ordenarPorRelevancia(resultadosLocales, texto);

                    console.log('📊 [RESULTADOS-LOCALES-REAL-TIME] Resultados encontrados:', {
                        texto,
                        resultados: resultadosOrdenados.length,
                        items: resultadosOrdenados.map(r => r.title)
                    });

                    // ✅ ACTUALIZAR ESTADO DE RESULTADOS
                    setResultados(resultadosOrdenados);
                    setEstadoBusqueda("success");
                    setLoadingResultados(false);

                    // ✅ ACTUALIZAR PADRE (pero sin guardar en historial)
                    onSearch(texto, resultadosOrdenados, false);

                    if (resultadosOrdenados.length === 0) {
                        setMensajeNoResultados(`No se encontraron resultados para "${texto}"`);
                    } else {
                        setMensajeNoResultados("");
                    }

                } catch (error) {
                    console.error('❌ [RESULTADOS-LOCALES-REAL-TIME] Error:', error);
                    setEstadoBusqueda("error");
                    setMensajeNoResultados(`Error en la búsqueda para "${texto}"`);
                    setLoadingResultados(false);
                }
            }, 400); // Debounce para resultados
        }

        return () => {
            if (debounceResultadosLocalesRef.current) {
                clearTimeout(debounceResultadosLocalesRef.current);
            }
        };
    }, [query, inputFocused, datos, campoBusqueda]);

    // 🔥 MODIFICADO: Manejar cambio en el input - solo mensajes informativos
    const manejarCambioInput = useCallback((nuevoValor: string) => {
        setQuery(nuevoValor);

        const textoLimpio = nuevoValor.trim();

        // 🔥 SOLO MOSTRAR MENSAJE INFORMATIVO, NO BLOQUEAR
        const analisis = analizarCaracteresQuery(textoLimpio);

        if (analisis.tieneSeparadores && !analisis.tieneProblema) {
            setMensajeNoResultados(analisis.mensaje || "Búsqueda con separadores");
        } else {
            setMensajeNoResultados("");
        }

        if (nuevoValor === "") {
            setEstadoBusqueda("idle");
            setLoadingResultados(false);
            setMensajeNoResultados("");
            onSearch("", [], true);
            terminoBusquedaAnteriorSugerencias.current = "";
            terminoBusquedaAnteriorResultados.current = "";
            busquedaEnCurso.current = false;
        }
    }, [onSearch]);

    // 🔥 MODIFICADO: buscarSugerencias - SOLO BACKEND, FALLBACK LOCAL
    // ✅ ESTA FUNCIÓN YA MANEJA BACKEND + LOCAL AUTOMÁTICAMENTE
    const buscarSugerencias = useCallback(async (textoNormalizado: string): Promise<string[]> => {
        try {
            console.log('🔍 [AMAZON-SUGERENCIAS] Buscando para texto normalizado:', textoNormalizado);

            if (textoNormalizado.length < 1) {
                console.log('⏸️ [AMAZON-SUGERENCIAS] Texto muy corto');
                
            }

            console.log('🔄 [AMAZON-SUGERENCIAS] Llamando al servicio...');

            // 🔥 ESTE SERVICIO MANEJA BACKEND + LOCAL AUTOMÁTICAMENTE
            const sugerenciasOptimizadas = await BusquedaService.getAutocompleteSuggestions(
                textoNormalizado,
                datos,
                apiConfig?.endpoint
            );

            console.log('✅ [AMAZON-SUGERENCIAS] Respuesta recibida:', {
                texto: textoNormalizado,
                sugerencias: sugerenciasOptimizadas,
                cantidad: sugerenciasOptimizadas.length,
                origen: sugerenciasOptimizadas.length > 0 ? 'BACKEND/LOCAL' : 'VACIO'
            });

            return sugerenciasOptimizadas;

        } catch (error) {
            console.error('❌ [AMAZON-SUGERENCIAS] Error:', error);
            return [];
        }
    }, [datos, apiConfig?.endpoint]);

    // 🔥 CORREGIDO: useEffect de sugerencias para manejar backend + local automáticamente
    useEffect(() => {

        if (busquedaEnCurso.current) {
            console.log('🚫 [RESULTADOS-AUTO] Cancelado, la búsqueda completa ya empezó.');
            return; // NO HAGAS NADA
        }

        if (debounceSugerenciasRef.current) {
            clearTimeout(debounceSugerenciasRef.current);
        }

        const texto = query;

        // 🔥 PRIMERO: Comparación rápida con texto ORIGINAL
        const textoNoCambioOriginal = texto === terminoBusquedaAnteriorSugerencias.current;

        if (textoNoCambioOriginal) {
            console.log('⚡ [SUGERENCIAS] Texto ORIGINAL no cambió - Evitando procesamiento');
            return;
        }

        // 🔍 SEGUNDO: Detección de caracteres problema
        const analisis = analizarCaracteresQuery(texto);
        const tieneCaracteresProblema = analisis.tieneProblema;

        if (tieneCaracteresProblema) {
            console.log('🚫 [SUGERENCIAS] Caracteres problema - NO búsqueda');
            setSugerencias([]);
            setEstadoSugerencias("idle");
            setMostrarSugerencias(false);
            terminoBusquedaAnteriorSugerencias.current = texto;
            return;
        }

        // 📝 TERCERO: Normalización
        const textoNormalizado = normalizarGoogle(texto, "sugerencias");
        const textoAnteriorNormalizado = normalizarGoogle(terminoBusquedaAnteriorSugerencias.current, "sugerencias");

        // 🔥 CUARTO: Comparación con textos NORMALIZADOS
        const textoNoCambioNormalizado = textoNormalizado === textoAnteriorNormalizado;
            terminoBusquedaAnteriorSugerencias.current = texto;

        //if (textoNoCambioNormalizado) {
          //  console.log('⚡ [SUGERENCIAS] Texto NORMALIZADO no cambió - Evitando búsqueda');
           // terminoBusquedaAnteriorSugerencias.current = texto;
            //return;
        //}

        console.log('⚡ [SUGERENCIAS] Ejecutando búsqueda aunque texto normalizado sea igual');
        onSearch(texto, resultados); // aquí disparas la búsqueda normalmente


        const textoSoloEspacios = textoNormalizado.length === 0 && texto.length > 0;
        const tieneTextoParaSugerencias = textoNormalizado.length >= 1;

        console.log('🔍 [SUGERENCIAS] Comparación CORREGIDA:', {
            textoOriginal: JSON.stringify(texto),
            textoNormalizado: JSON.stringify(textoNormalizado),
            textoSoloEspacios,
            tieneTextoParaSugerencias,
            inputFocused
        });

        if (textoSoloEspacios) {
            setSugerencias([]);
            setEstadoSugerencias("idle");
            setMostrarSugerencias(false);
            terminoBusquedaAnteriorSugerencias.current = texto;
        } else if (tieneTextoParaSugerencias && inputFocused) {
            // 🔥 Si llegamos aquí, es porque el texto cambió y hay que buscar
            console.log('🚀 [SUGERENCIAS] Buscando sugerencias para:', textoNormalizado);

            setEstadoSugerencias("loading");
            setMostrarSugerencias(true);
            terminoBusquedaAnteriorSugerencias.current = texto;

            debounceSugerenciasRef.current = setTimeout(async () => {
                if (busquedaEnCurso.current) {
                    console.log('🚫 [RESULTADOS-AUTO] Cancelado, la búsqueda completa ya empezó.');
                    return; // NO HAGAS NADA
                }
                try {
                    // 🔥 ESTA FUNCIÓN YA MANEJA BACKEND + LOCAL AUTOMÁTICAMENTE
                    const sugerenciasFinales = await buscarSugerencias(textoNormalizado);

                    // Verificar que el query no haya cambiado
                    if (query === texto) {
                        setSugerencias(sugerenciasFinales);
                        setEstadoSugerencias("success");
                        setMostrarSugerencias(true);

                        console.log('✅ [SUGERENCIAS-FINAL] Resultado:', {
                            texto: textoNormalizado,
                            sugerencias: sugerenciasFinales,
                            cantidad: sugerenciasFinales.length
                        });

                        if (sugerenciasFinales.length === 0 && textoNormalizado.length >= 2) {
                            setMensajeNoResultados(`No se encontraron sugerencias para "${texto}"`);
                        } else {
                            setMensajeNoResultados("");
                        }
                    }
                } catch (error) {
                    console.error('❌ [SUGERENCIAS] Error:', error);
                    setEstadoSugerencias("error");
                    setSugerencias([]);
                }
            }, 300);
        } else {
            terminoBusquedaAnteriorSugerencias.current = texto;
        }

        return () => {
            if (debounceSugerenciasRef.current) {
                clearTimeout(debounceSugerenciasRef.current);
            }
        };
    }, [query, inputFocused, buscarSugerencias]);

    // 🔥 CORREGIDO: useEffect de resultados para manejar backend + local automáticamente
    // 🔥 CORREGIDO: useEffect de resultados con la MISMA normalización que sugerencias
    useEffect(() => {

        if (busquedaEnCurso.current) {
            console.log('🚫 [RESULTADOS-AUTO] Omitido, "Enter" tiene prioridad.');
            return;
        }

        if (debounceResultadosRef.current) {
            clearTimeout(debounceResultadosRef.current);
        }

        const texto = query.trim();
        if (desactivarBusquedaAutomatica.current) {
            console.log('⏸️ [RESULTADOS] Desactivada temporalmente');
            return;
        }


        if (busquedaEnCurso.current) {
            console.log('🚫 [RESULTADOS-AUTO] Omitido, búsqueda completa en curso.');
            return;
        }

        // 🔥 NUEVO: Usar la MISMA normalización que en sugerencias
        const textoNormalizado = normalizarGoogle(texto, "sugerencias");
        const textoAnteriorNormalizado = normalizarGoogle(terminoBusquedaAnteriorResultados.current, "sugerencias");

        

        const textoSoloEspacios = textoNormalizado.length === 0 && texto.length > 0;
        const tieneTextoParaResultados = textoNormalizado.length >= 2;

        console.log('🔍 [RESULTADOS] Comparación CORREGIDA:', {
            textoOriginal: JSON.stringify(texto),
            textoNormalizado: JSON.stringify(textoNormalizado),
            textoSoloEspacios,
            tieneTextoParaResultados,
            busquedaEnCurso: busquedaEnCurso.current
        });

        // 🔥 MODIFICADO: Usar textoNormalizado para la búsqueda
        if (!textoSoloEspacios &&
            tieneTextoParaResultados &&
            inputFocused &&
            !busquedaEnCurso.current) {

            console.log('🚀 [RESULTADOS] Programando búsqueda automática para:', textoNormalizado);

            debounceResultadosRef.current = setTimeout(async () => {

                if (busquedaEnCurso.current) {
                    console.log('🚫 [RESULTADOS-AUTO] Cancelado, "Enter" se adelantó.');
                    return; // NO HAGAS NADA
                }

                if (desactivarBusquedaAutomatica.current) {
                    console.log('🚫 [RESULTADOS-AUTO] Cancelado, se desactivó la búsqueda.');
                    return;
                }

                if (query.trim() === texto && !desactivarBusquedaAutomatica.current) {
                    console.log('📊 [RESULTADOS] Ejecutando búsqueda automática');


                    // 🔥 USAR LA MISMA FUNCIÓN QUE MANEJA BACKEND + LOCAL
                    if (busquedaEnCurso.current) {
                        console.log('⏸️ [RESULTADOS] Ya hay búsqueda en curso, omitiendo');
                        return;
                    }

                    //busquedaEnCurso.current = true;
                    //terminoBusquedaAnteriorResultados.current = texto;
                    //setLoadingResultados(true);
                    //setEstadoBusqueda("loading");
                    console.log('📊 [RESULTADOS-AUTO] Ejecutando (llamando a función principal)');
                    await ejecutarBusquedaCompleta(query.trim(), false, false, true);

                }
            }, 600);
        } else {
            terminoBusquedaAnteriorResultados.current = texto;
        }

        return () => {
            if (debounceResultadosRef.current) {
                clearTimeout(debounceResultadosRef.current);
            }
        };
    }, [query, inputFocused, datos, onSearch, apiConfig?.endpoint, ejecutarBusquedaCompleta]);

    const manejarFocusInput = useCallback(async () => {
        setInputFocused(true);
        const textoActual = query.trim();

        if (textoActual.length >= 1) {
            console.log('🖱️ [FOCUS] Cargando sugerencias para texto existente:', textoActual);
            setEstadoSugerencias("loading");

            try {
                const sugerenciasBackend = await buscarSugerencias(textoActual);
                setSugerencias(sugerenciasBackend);
                setEstadoSugerencias(sugerenciasBackend.length > 0 ? "success" : "success");

                if (sugerenciasBackend.length === 0) {
                    setMensajeNoResultados(`No se encontraron sugerencias para "${textoActual}"`);
                } else {
                    setMensajeNoResultados("");
                }
            } catch (error) {
                console.error('❌ Error cargando sugerencias al hacer focus:', error);
                setEstadoSugerencias("error");
                setMensajeNoResultados("");
            }
        }
    }, [query, buscarSugerencias]);

    // 🔥 MODIFICADO: Búsqueda manual - pierde focus
    const ejecutarBusqueda = useCallback(async () => {
        console.log('🎯 [BÚSQUEDA-MANUAL] Ejecutando búsqueda manual');

        // 🔥 PIERDE EL FOCUS AL EJECUTAR BÚSQUEDA
        inputRef.current?.blur();
        setInputFocused(false);
        setMostrarSugerencias(true);
        setMostrarHistorialLocal(false);

        await ejecutarBusquedaCompleta(query, true, false, true);
    }, [query, ejecutarBusquedaCompleta]);

    // 🔥 MODIFICADO: Limpiar SÍ actualiza URL
    const limpiarBusqueda = useCallback(() => {
        setQuery("");
        setSugerencias([]);
        setMensaje("");
        setEstadoSugerencias("idle");
        setEstadoBusqueda("idle");
        setResultados([]);
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(true);
        setLoadingResultados(false);
        setMensajeNoResultados("");
        terminoBusquedaAnteriorSugerencias.current = "";
        terminoBusquedaAnteriorResultados.current = "";
        busquedaEnCurso.current = false;

        desactivarBusquedaAutomatica.current = false;

        // 🔥 Limpiar también actualiza URL
        onSearch("", [], true);
        inputRef.current?.focus();

        console.log('🧹 [AMAZON] Búsqueda limpiada');
    }, [onSearch]);

    const manejarKeyDown = useCallback((e: React.KeyboardEvent) => {
        const itemsList = mostrarHistorialLocal ? historial : sugerencias;
        const totalItems = itemsList.length;

        // 🔹 Evitar navegación si no hay elementos
        if ((mostrarHistorialLocal || mostrarSugerencias) && totalItems === 0) return;

        if (mostrarHistorialLocal || mostrarSugerencias) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setIndiceSeleccionado((prev) =>
                    prev < totalItems - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setIndiceSeleccionado((prev) =>
                    prev > 0 ? prev - 1 : totalItems - 1
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();

                if (indiceSeleccionado !== -1) {
                    const terminoSeleccionado = itemsList[indiceSeleccionado];

                    if (mostrarHistorialLocal) {
                        const textoSeleccionado = seleccionarPorIndice(indiceSeleccionado);
                        if (textoSeleccionado) {
                            setQuery(textoSeleccionado);
                            setMostrarHistorialLocal(false);
                            ejecutarBusquedaCompleta(textoSeleccionado, true, false, true);
                        }
                    } else if (mostrarSugerencias) {
                        seleccionarSugerencia(terminoSeleccionado);
                    }
                } else {
                    ejecutarBusqueda();
                }
            } else if (e.key === 'Escape') {
                setMostrarSugerencias(false);
                setMostrarHistorialLocal(false);
                setIndiceSeleccionado(-1);
                setInputFocused(false);
                inputRef.current?.blur();
            } else {
                setIndiceSeleccionado(-1);
            }
        } else {
            if (e.key === 'Enter') {
                ejecutarBusqueda();
            } else if (e.key === 'Escape') {
                limpiarBusqueda();
            }
        }
    }, [
        ejecutarBusqueda,
        limpiarBusqueda,
        mostrarHistorialLocal,
        mostrarSugerencias,
        historial,
        sugerencias,
        indiceSeleccionado,
        setIndiceSeleccionado,
        seleccionarPorIndice,
        seleccionarSugerencia,
        ejecutarBusquedaCompleta
    ]);

    // Efecto para controlar la visibilidad del historial y sugerencias
    useEffect(() => {
        const texto = query.trim();
        const esSoloEspacios = query.length > 0 && texto.length === 0;

        const debeMostrarHistorial = Boolean(
            inputFocused &&
            !esSoloEspacios &&
            texto.length === 0 &&
            mostrarHistorial

        );

        // 🔥 CONDICIÓN CORREGIDA para sugerencias
        const debeMostrarSugerencias = Boolean(
            inputFocused &&
            !esSoloEspacios &&
            texto.length >= 1 &&
            (
                estadoSugerencias === "loading" ||
                estadoSugerencias === "success" ||  // ✅ NUEVO: Estado success
                estadoSugerencias === "error" ||    // ✅ NUEVO: Estado error  
                sugerencias.length > 0 ||
                mensajeNoResultados
            )
        );

        console.log('👀 [VISIBILIDAD] Control de visibilidad:', {
            inputFocused,
            query,
            textoLimpio: texto,
            esSoloEspacios,
            estadoSugerencias,
            sugerenciasCount: sugerencias.length,
            mensajeNoResultados,
            debeMostrarSugerencias
        });

        setMostrarHistorialLocal(debeMostrarHistorial);
        setMostrarSugerencias(debeMostrarSugerencias);

    }, [query, inputFocused, historial, mostrarHistorial, estadoSugerencias, sugerencias, mensajeNoResultados, setMostrarHistorialLocal]);
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

    // Manejar selección del historial
    const manejarSeleccionHistorial = useCallback(async (texto: string) => {
        const textoSeleccionado = seleccionarDelHistorial(texto) || "";
        setQuery(textoSeleccionado);
        setSugerencias([]);
        setMensaje("");
        setMostrarSugerencias(false);
        setMensajeNoResultados("");
        setIndiceSeleccionado(-1);

        if (textoSeleccionado) {
            await ejecutarBusquedaCompleta(textoSeleccionado, true, false, true);
        }
    }, [seleccionarDelHistorial, ejecutarBusquedaCompleta, setIndiceSeleccionado]);

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
                            manejarCambioInput(e.target.value);
                            setMostrarHistorialLocal(false);
                        }}
                        onKeyDown={manejarKeyDown}
                        onFocus={manejarFocusInput}
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
                </div>

                <div className={`contador-caracteres ${query.length > 70 ? 'alerta' : ''}`}>
                    {query.length}/80 caracteres
                    {tieneCaracteresProblema(query) && <span className="caracteres-invalidos"> - Caracteres especiales se ignoran</span>}
                </div>

                {/* Mostrar loading en área de resultados */}
                {loadingResultados && (
                    <div className="cargando">
                        <div className="spinner"></div>
                        <span>Buscando resultados...</span>
                    </div>
                )}

                {/* ✅ HISTORIAL ✅ */}
                {mostrarHistorialLocal && (
                    <ul className="caja-sugerencias">
                        <li className="sugerencias-header"onMouseDown={(e) => e.preventDefault()}>
                            Búsquedas recientes
                            {cargandoHistorial && (
                                <span className="cargando-indicador">Cargando...</span>
                            )}
                        </li>

                        {/* ✅ AQUÍ LA CONDICIÓN PARA MOSTRAR EL MENSAJE */}
                        {!cargandoHistorial && historial.length === 0 ? (
                            <li className="mensaje-historialon" onMouseDown={(e) => e.preventDefault()}>
                                No hay búsquedas recientes
                            </li>
                        ) : (
                            historial.slice(0,5).map((item, i) => (
                                <li
                                    key={i}
                                    className={`item-historial ${i === indiceSeleccionado ? 'seleccionado' : ''}`}
                                    onClick={() => manejarSeleccionHistorial(item)}
                                >
                                    <div className="contenedor-texto-historial">
                                        <Clock className="icono-historial" size={16} />
                                        <span className="texto-historial">{item}</span>
                                    </div>

                                    <button
                                        className="boton-eliminar-historial"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            eliminarDelHistorial(item);
                                        }}
                                        title="Eliminar elemento"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))
                        )}

                        {/* ✅ Solo mostrar limpiar si hay elementos */}
                        {historial.length > 0 && (
                            <li
                                className="item-limpiar-todo"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={limpiarHistorialBackend}
                            >
                                <Trash2 size={14} />
                                Limpiar historial
                            </li>
                        )}
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
                                    <li
                                        key={i}
                                        onClick={() => seleccionarSugerencia(s)}
                                        className={i === indiceSeleccionado ? 'seleccionado' : ''}
                                    >
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