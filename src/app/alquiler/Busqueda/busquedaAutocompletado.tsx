'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { Job } from "../paginacion/types/job";
import "./busqueda.css";
import { Trash2 } from "lucide-react";

type EstadoSugerencias = "idle" | "loading" | "error" | "success";
type EstadoBusqueda = "idle" | "loading" | "success" | "error";

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

            const queryNormalizado = this.normalizarQueryGoogle(query);
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

                if (data.success && data.data && Array.isArray(data.data)) {
                    console.log(`✅ [BACKEND-INICIO] ${data.data.length} resultados del backend`);
                    return data.data.slice(0, 50);
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
            const especialidadNormalizada = this.normalizarQueryGoogle(especialidad);
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

            const queryNormalizado = this.normalizarQueryGoogle(query);

            const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/autocomplete`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const url = `${apiEndpoint}?q=${encodeURIComponent(queryNormalizado)}&limit=6&inicioPalabra=true`;

            const response = await fetch(url, { signal: controller.signal });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data: ApiResponse = await response.json();
                console.log('✅ [SUGERENCIAS-BACKEND-INICIO] Respuesta recibida:', data);

                if (data.success && data.data && Array.isArray(data.data)) {
                    const sugerencias = data.data
                        .map((item: EspecialidadBackend) => item.nombre)
                        .filter((nombre: string) => nombre && nombre.trim())
                        .slice(0, 10);

                    console.log('✅ [SUGERENCIAS-BACKEND-INICIO] Sugerencias:', sugerencias);
                    return sugerencias;
                }
            }

            console.log('⚠️ [SUGERENCIAS-BACKEND-INICIO] Respuesta no válida');
            throw new Error('Backend response not valid');

        } catch (error) {
            console.log('❌ [SUGERENCIAS-BACKEND-INICIO] Error:', error);
            throw error;
        }
    }

    static async getHistorialBackend(endpoint?: string): Promise<string[]> {
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
            console.error('❌ [BACKEND] Error obteniendo historial:', error);
            throw error;
        }
    }

    static async clearHistorialBackend(endpoint?: string): Promise<boolean> {
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
            console.error('❌ [BACKEND] Error limpiando historial:', error);
            throw error;
        }
    }

    private static normalizarQueryGoogle(texto: string): string {
        if (!texto) return "";

        const textoConEspacios = texto.replace(/[@#$%^&*()_+=[\]{}|\\:;"'<>?/]/g, ' ');
        const textoSinTildes = textoConEspacios
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[´`]/g, '');
        const textoMinusculas = textoSinTildes.toLowerCase();
        const textoLimpio = textoMinusculas.replace(/\s+/g, ' ').trim();

        console.log('🔍 [BACKEND-NORMALIZACIÓN]', {
            original: texto,
            final: textoLimpio
        });

        return textoLimpio;
    }
}

// ============================================================================
// SERVICIO LOCAL UNIFICADO - SOLO COMO FALLBACK
// ============================================================================

class LocalService {
    static buscarTrabajos(query: string, jobs: Job[], campoBusqueda: keyof Job | "all" = "all"): Job[] {
        console.log('🔍 [LOCAL-FALLBACK] Buscando localmente:', query);

        if (!query.trim()) return [];

        const queryNormalizado = this.normalizarQueryGoogle(query);
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

        const queryNormalizado = this.normalizarQueryGoogle(query);
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

    private static normalizarQueryGoogle(texto: string): string {
        if (!texto) return "";
        const textoConEspacios = texto.replace(/[@#$%^&*()_+=[\]{}|\\:;"'<>?/]/g, ' ');
        const textoSinTildes = textoConEspacios
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[´`]/g, '');
        const textoMinusculas = textoSinTildes.toLowerCase();
        const textoLimpio = textoMinusculas.replace(/\s+/g, ' ').trim();
        return textoLimpio;
    }
}

// ============================================================================
// SERVICIO PRINCIPAL - PRIORIDAD AL BACKEND
// ============================================================================

class BusquedaService {
    private static API_BASE = getApiRoot();

    // 🔥 FUNCIÓN: Calcular puntaje de relevancia DESDE FRONTEND
    private static calcularRelevancia(job: Job, query: string): number {
        const queryNormalizado = this.normalizarQueryGoogle(query);
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
    private static ordenarPorRelevancia(resultados: Job[], query: string): Job[] {
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

    // Métodos de normalización existentes...
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

    private static normalizarQueryGoogle(texto: string): string {
        if (!texto) return "";
        const textoConEspacios = texto.replace(/[@#$%^&*()_+=[\]{}|\\:;"'<>?/]/g, ' ');
        const textoSinTildes = textoConEspacios
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[´`]/g, '');
        const textoMinusculas = textoSinTildes.toLowerCase();
        const textoLimpio = textoMinusculas.replace(/\s+/g, ' ').trim();
        return textoLimpio;
    }

    // 🔥 MODIFICADO: Ordenar resultados del backend por relevancia DESDE FRONTEND
    static async searchJobsOptimized(query: string, jobsReales: Job[], endpoint?: string): Promise<Job[]> {
        try {
            console.log('🔍 [SERVICE-BACKEND-PRIORITY] Buscando primero en backend:', query);

            if (!query.trim()) {
                return [];
            }

            // 1. INTENTAR BACKEND PRIMERO SIEMPRE
            const resultadosBackend = await BackendService.searchJobsBackend(query, endpoint);

            if (resultadosBackend && resultadosBackend.length > 0) {
                console.log(`✅ [BACKEND-PRIORITY] ${resultadosBackend.length} resultados del backend`);

                // 🔥 ORDENAR POR RELEVANCIA DESDE FRONTEND
                const resultadosOrdenados = this.ordenarPorRelevancia(resultadosBackend, query);
                console.log('📊 [RELEVANCIA] Resultados ordenados por relevancia desde frontend');

                return resultadosOrdenados;
            }

            // 2. Si backend responde pero sin resultados, devolver array vacío
            console.log('ℹ️ [BACKEND-PRIORITY] Backend respondió sin resultados');
            return [];

        } catch (error) {
            console.log('🔄 [BACKEND-PRIORITY] Backend falló, usando local como fallback:', error);

            // 3. SOLO EN CASO DE ERROR, usar búsqueda local Y TAMBIÉN ORDENAR
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

    // 🔥 MODIFICADO: Prioridad absoluta a sugerencias del backend
    static async getAutocompleteSuggestions(query: string, jobsReales: Job[], endpoint?: string): Promise<string[]> {
        try {
            console.log('🔍 [SUGERENCIAS-BACKEND-PRIORITY] Buscando sugerencias en backend:', query);

            // 1. INTENTAR BACKEND PRIMERO SIEMPRE
            const sugerenciasBackend = await BackendService.getAutocompleteSuggestionsBackend(query, endpoint);

            if (sugerenciasBackend && sugerenciasBackend.length > 0) {
                console.log('✅ [SUGERENCIAS-BACKEND-PRIORITY] Sugerencias del backend:', sugerenciasBackend);
                return sugerenciasBackend;
            }

            // 2. Si backend responde pero sin sugerencias, devolver array vacío
            console.log('ℹ️ [SUGERENCIAS-BACKEND-PRIORITY] Backend respondió sin sugerencias');
            return [];

        } catch (error) {
            console.log('🔄 [SUGERENCIAS-BACKEND-PRIORITY] Backend falló, usando local como fallback:', error);

            // 3. SOLO EN CASO DE ERROR, usar sugerencias locales
            return LocalService.getSugerencias(query, jobsReales);
        }
    }

    static async getHistorial(endpoint?: string): Promise<string[]> {
        try {
            return await BackendService.getHistorialBackend(endpoint);
        } catch (error) {
            console.error('❌ [SERVICE] Error obteniendo historial del backend, usando localStorage:', error);
            try {
                const stored = localStorage.getItem("historialBusquedas");
                return stored ? JSON.parse(stored) : [];
            } catch (localError) {
                console.error('❌ [SERVICE] Error con localStorage:', localError);
                return [];
            }
        }
    }

    static async clearHistorial(endpoint?: string): Promise<boolean> {
        try {
            const success = await BackendService.clearHistorialBackend(endpoint);
            if (success) {
                localStorage.removeItem("historialBusquedas");
            }
            return success;
        } catch (error) {
            console.error('❌ [SERVICE] Error limpiando historial del backend:', error);
            try {
                localStorage.removeItem("historialBusquedas");
                return true;
            } catch (localError) {
                console.error('❌ [SERVICE] Error limpiando localStorage:', localError);
                return false;
            }
        }
    }
}

// ============================================================================
// COMPONENTE PRINCIPAL - SOLO BACKEND, FALLBACK LOCAL
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
    const [mostrarHistorialLocal, setMostrarHistorialLocal] = useState(false);
    const [resultados, setResultados] = useState<Job[]>([]);
    const [historial, setHistorial] = useState<string[]>([]);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [loadingResultados, setLoadingResultados] = useState(false);
    const [mensajeNoResultados, setMensajeNoResultados] = useState("");

    const debounceSugerenciasRef = useRef<NodeJS.Timeout | null>(null);
    const debounceBusquedaRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminoBusquedaAnterior = useRef("");
    const historialCargado = useRef(false);
    const busquedaEnCurso = useRef(false);
    const desactivarBusquedaAutomatica = useRef(false);

    // Normaliza texto: primera letra en mayúscula, mantiene el resto
    const capitalizarPrimera = (texto: string) => {
        const t = texto ? String(texto).trim() : "";
        if (!t) return "";
        return t.charAt(0).toUpperCase() + t.slice(1);
    };

    // 🔥 FUNCIÓN: Normalización estilo Google
    const normalizarQueryGoogle = useCallback((texto: string): string => {
        if (!texto) return "";

        const textoConEspacios = texto.replace(/[@#$%^&*()_+=[\]{}|\\:;"'<>?/]/g, ' ');
        const textoSinTildes = textoConEspacios
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[´`]/g, '');
        const textoMinusculas = textoSinTildes.toLowerCase();
        const textoLimpio = textoMinusculas.replace(/\s+/g, ' ').trim();

        return textoLimpio;
    }, []);

    // 🔥 FUNCIÓN: Detectar si hay caracteres especiales
    const tieneCaracteresEspeciales = useCallback((texto: string): boolean => {
        return /[@#$%^&*()_+=[\]{}|\\:;"'<>?/]/.test(texto);
    }, []);

    // 🔥 MEJORADO: Guardar en historial sin duplicados
    const guardarEnHistorial = useCallback((texto: string) => {
        if (!mostrarHistorial) return;

        const textoNormalizado = texto.trim();

        if (!textoNormalizado ||
            textoNormalizado.length < 2 ||
            textoNormalizado.length > 50) {
            return;
        }

        console.log('💾 [HISTORIAL] Guardando búsqueda:', textoNormalizado);

        const historialLimpio = historial
            .map(item => item.trim())
            .filter(item => item.length > 0);

        const nuevoHistorial = [
            textoNormalizado,
            ...historialLimpio.filter(item =>
                item.toLowerCase() !== textoNormalizado.toLowerCase()
            )
        ].slice(0, 10);

        setHistorial(nuevoHistorial);
        try {
            localStorage.setItem("historialBusquedas", JSON.stringify(nuevoHistorial));
        } catch (error) {
            console.error("❌ [HISTORIAL] Error guardando en localStorage:", error);
        }
    }, [historial, mostrarHistorial]);

    // 🔥 MODIFICADO: Ahora acepta actualizarUrl como parámetro
    const ejecutarBusquedaCompleta = useCallback(async (
        texto: string,
        guardarEnHistorialFlag: boolean = true,
        esEspecialidad: boolean = false,
        actualizarUrl: boolean = true  // 🔥 NUEVO PARÁMETRO
    ) => {
        if (busquedaEnCurso.current) {
            console.log('⏸️ [BÚSQUEDA] Ya hay una búsqueda en curso, omitiendo...');
            return;
        }

        const textoLimpio = texto.trim();
        console.log('🚀 [BÚSQUEDA-COMPLETA] Iniciando búsqueda para:', textoLimpio, 'actualizarUrl:', actualizarUrl);

        if (textoLimpio.length > 80) {
            setMensaje("La búsqueda no puede exceder 80 caracteres");
            setEstadoBusqueda("error");
            setLoadingResultados(false);
            return;
        }

        if (textoLimpio.length < 2) {
            setMensaje("La búsqueda debe tener al menos 2 caracteres");
            setEstadoBusqueda("idle");
            setResultados([]);
            setLoadingResultados(false);
            setMensajeNoResultados("");
            onSearch("", [], actualizarUrl);
            return;
        }

        busquedaEnCurso.current = true;

        setLoadingResultados(true);
        setEstadoBusqueda("loading");
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);

        if (tieneCaracteresEspeciales(textoLimpio)) {
            setMensajeNoResultados("Los caracteres especiales se ignoran en la búsqueda");
        } else {
            setMensajeNoResultados("");
        }

        terminoBusquedaAnterior.current = textoLimpio;

        if (guardarEnHistorialFlag && mostrarHistorial) {
            guardarEnHistorial(textoLimpio);
        }

        try {
            console.log('🔍 [BÚSQUEDA] Buscando trabajos...');

            let resultadosFinales: Job[] = [];

            if (esEspecialidad) {
                resultadosFinales = await BusquedaService.searchByEspecialidad(textoLimpio, datos);
            } else {
                resultadosFinales = await BusquedaService.searchJobsOptimized(textoLimpio, datos, apiConfig?.endpoint);
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

        } finally {
            setLoadingResultados(false);
            busquedaEnCurso.current = false;
        }
    }, [datos, onSearch, guardarEnHistorial, mostrarHistorial, apiConfig?.endpoint, tieneCaracteresEspeciales]);

    // 🔥 CORREGIDO: Selección de sugerencia AHORA actualiza URL
    const seleccionarSugerencia = useCallback(async (texto: string) => {
        console.log('🎯 [SUGERENCIA] Iniciando selección...');

        desactivarBusquedaAutomatica.current = true;

        if (debounceBusquedaRef.current) {
            clearTimeout(debounceBusquedaRef.current);
            debounceBusquedaRef.current = null;
        }

        setQuery(texto);
        setSugerencias([]);
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);

        inputRef.current?.focus();

        console.log('🚀 [SUGERENCIA] Ejecutando búsqueda automática...');
        // 🔥 CORRECCIÓN: actualizarUrl = true para sugerencias
        await ejecutarBusquedaCompleta(texto, true, false, true);

        setTimeout(() => {
            desactivarBusquedaAutomatica.current = false;
            console.log('🔄 [AUTO] Reactivado después de selección');
        }, 4000);

    }, [ejecutarBusquedaCompleta]);

    // 🔥 MODIFICADO: Manejar cambio en el input
    const manejarCambioInput = useCallback((nuevoValor: string) => {
        setQuery(nuevoValor);

        if (tieneCaracteresEspeciales(nuevoValor) && nuevoValor.trim().length > 0) {
            setMensajeNoResultados("Los caracteres especiales se ignoran en la búsqueda");
        } else {
            setMensajeNoResultados("");
        }

        if (nuevoValor === "") {
            setEstadoBusqueda("idle");
            setLoadingResultados(false);
            setMensajeNoResultados("");
            onSearch("", [], true); // 🔥 Limpiar también actualiza URL
            terminoBusquedaAnterior.current = "";
            busquedaEnCurso.current = false;
        }
    }, [tieneCaracteresEspeciales, onSearch]);

    // 🔥 MODIFICADO: buscarSugerencias - SOLO BACKEND, FALLBACK LOCAL
    const buscarSugerencias = useCallback(async (texto: string): Promise<string[]> => {
        try {
            console.log('🔍 [SUGERENCIAS] Buscando sugerencias para:', texto);

            if (texto.trim().length < 1) {
                console.log('⏸️ [SUGERENCIAS] Texto muy corto, omitiendo búsqueda');
                return [];
            }

            // 🔥 PRIORIDAD ABSOLUTA AL BACKEND
            const sugerenciasOptimizadas = await BusquedaService.getAutocompleteSuggestions(
                texto,
                datos,
                apiConfig?.endpoint
            );

            console.log('📥 [SUGERENCIAS] Sugerencias recibidas:', sugerenciasOptimizadas);

            // 🔥 FILTRAR SUGERENCIAS POR INICIO (tanto backend como fallback)
            const sugerenciasFiltradas = sugerenciasOptimizadas.filter(sugerencia => {
                if (!sugerencia || !sugerencia.trim()) return false;

                const sugerenciaNormalizada = normalizarQueryGoogle(sugerencia);
                const textoNormalizado = normalizarQueryGoogle(texto);

                if (sugerenciaNormalizada.startsWith(textoNormalizado)) {
                    return true;
                }

                const palabrasSugerencia = sugerenciaNormalizada.split(' ');
                return palabrasSugerencia.some(palabra =>
                    palabra.startsWith(textoNormalizado)
                );
            });

            console.log('🎯 [SUGERENCIAS] Sugerencias filtradas por inicio:', sugerenciasFiltradas);

            // 🔥 ORDENAR POR RELEVANCIA
            const sugerenciasOrdenadas = sugerenciasFiltradas.sort((a, b) => {
                const aNormalizado = normalizarQueryGoogle(a);
                const bNormalizado = normalizarQueryGoogle(b);
                const textoNormalizado = normalizarQueryGoogle(texto);

                const aEmpiezaExacto = aNormalizado.startsWith(textoNormalizado);
                const bEmpiezaExacto = bNormalizado.startsWith(textoNormalizado);

                if (aEmpiezaExacto && !bEmpiezaExacto) return -1;
                if (!aEmpiezaExacto && bEmpiezaExacto) return 1;

                if (a.length !== b.length) return a.length - b.length;

                return aNormalizado.localeCompare(bNormalizado);
            });

            return sugerenciasOrdenadas.slice(0, 6);

        } catch (error) {
            console.error('❌ [SUGERENCIAS] Error:', error);
            return [];
        }
    }, [datos, apiConfig?.endpoint, normalizarQueryGoogle]);

    // 🔥 MODIFICADO: Efecto para sugerencias - SOLO BACKEND
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

    // 🔥 MODIFICADO: Efecto para búsqueda automática - SOLO BACKEND
    useEffect(() => {
        if (debounceBusquedaRef.current) {
            clearTimeout(debounceBusquedaRef.current);
        }

        const texto = query.trim();

        if (desactivarBusquedaAutomatica.current) {
            console.log('⏸️ [BÚSQUEDA-AUTO] Desactivada temporalmente');
            return;
        }

        if (texto.length >= 2 && inputFocused && texto !== terminoBusquedaAnterior.current &&
            !busquedaEnCurso.current) {

            console.log('🚀 [BÚSQUEDA-AUTO] Programando búsqueda para:', texto);

            debounceBusquedaRef.current = setTimeout(() => {
                if (query.trim() === texto && !desactivarBusquedaAutomatica.current) {
                    console.log('📊 [BÚSQUEDA-AUTO] Ejecutando búsqueda automática SIN actualizar URL');
                    terminoBusquedaAnterior.current = texto;
                    setLoadingResultados(true);
                    // 🔥 Búsqueda automática NO actualiza URL
                    ejecutarBusquedaCompleta(texto, false, false, false);
                }
            }, 500);
        }

        return () => {
            if (debounceBusquedaRef.current) {
                clearTimeout(debounceBusquedaRef.current);
            }
        };
    }, [query, inputFocused, ejecutarBusquedaCompleta]);

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

    // 🔥 MODIFICADO: Búsqueda manual SÍ actualiza URL
    const ejecutarBusqueda = useCallback(async () => {
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
        setMostrarHistorialLocal(false);
        setLoadingResultados(false);
        setMensajeNoResultados("");
        terminoBusquedaAnterior.current = "";
        busquedaEnCurso.current = false;

        desactivarBusquedaAutomatica.current = false;

        // 🔥 Limpiar también actualiza URL
        onSearch("", [], true);
        inputRef.current?.focus();

        console.log('🧹 [LIMPIAR] Búsqueda limpiada y automática reactivada');
    }, [onSearch]);

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
    }, [ejecutarBusqueda]);

    // Efecto para cargar historial
    useEffect(() => {
        if (!mostrarHistorial || historialCargado.current) return;

        const cargarHistorial = async () => {
            try {
                setCargandoHistorial(true);
                const terminos = await BusquedaService.getHistorial(apiConfig?.endpoint);

                if (terminos.length > 0) {
                    const historialUnico: string[] = Array.from(
                        new Set(
                            terminos
                                .map((term: string) => term.trim())
                                .filter((term: string) => term.length > 0)
                        )
                    ).slice(0, 10) as string[];

                    setHistorial(historialUnico);
                    console.log('📚 [HISTORIAL] Historial cargado:', historialUnico);
                } else {
                    try {
                        const stored = localStorage.getItem("historialBusquedas");
                        if (stored) {
                            const historialLocal: string[] = JSON.parse(stored);
                            const historialUnico: string[] = Array.from(
                                new Set(
                                    historialLocal
                                        .map((term: string) => term.trim())
                                        .filter((term: string) => term.length > 0)
                                )
                            ).slice(0, 10);
                            setHistorial(historialUnico);
                            console.log('📚 [HISTORIAL] Historial cargado desde localStorage:', historialUnico);
                        }
                    } catch (localError) {
                        console.error('Error con localStorage:', localError);
                    }
                }

                historialCargado.current = true;
            } catch (error) {
                console.error('❌ Error cargando historial:', error);
                try {
                    const stored = localStorage.getItem("historialBusquedas");
                    if (stored) {
                        const historialLocal: string[] = JSON.parse(stored);
                        const historialUnico: string[] = Array.from(
                            new Set(
                                historialLocal
                                    .map((term: string) => term.trim())
                                    .filter((term: string) => term.length > 0)
                            )
                        ).slice(0, 10);
                        setHistorial(historialUnico);
                        console.log('📚 [HISTORIAL] Historial cargado desde localStorage (fallback):', historialUnico);
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

        cargarHistorial();
    }, [mostrarHistorial, apiConfig?.endpoint]);

    // Efecto para controlar la visibilidad del historial y sugerencias
    useEffect(() => {
        const texto = query.trim();
        const esSoloEspacios = query.length > 0 && texto.length === 0;

        const debeMostrarHistorial = Boolean(
            inputFocused &&
            !esSoloEspacios &&
            texto.length === 0 &&
            historial.length > 0 &&
            mostrarHistorial
        );

        const debeMostrarSugerencias = Boolean(
            inputFocused &&
            !esSoloEspacios &&
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
                console.log('✅ [HISTORIAL] Historial limpiado correctamente por el usuario');
            } else {
                console.error('❌ [HISTORIAL] Error al limpiar historial en el backend');
                setMensaje("Error al limpiar el historial");
            }
        } catch (error) {
            console.error('❌ [HISTORIAL] Error limpiando historial:', error);
            setMensaje("Error de conexión al limpiar historial");
        }
    }, [apiConfig?.endpoint]);

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
                    {tieneCaracteresEspeciales(query) && <span className="caracteres-invalidos"> - Caracteres especiales se ignoran</span>}
                </div>

                {/* Mostrar loading en área de resultados */}
                {loadingResultados && (
                    <div className="cargando">
                        <div className="spinner"></div>
                        <span>Buscando resultados...</span>
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