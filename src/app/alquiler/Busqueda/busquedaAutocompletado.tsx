'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { Job } from "../../../types/job";
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

function getApiRoot(): string {
    return 'https://alquiler-back.vercel.app/api';
}

class BusquedaService {
    private static API_BASE = getApiRoot();

    static async searchJobsInBackend(query: string, jobsReales: Job[], endpoint?: string): Promise<Job[]> {
        if (!query.trim()) return [];
        
        try {
            const url = endpoint ? 
                `${this.API_BASE}/${endpoint}?search=${encodeURIComponent(query)}` :
                `${this.API_BASE}/search?q=${encodeURIComponent(query)}`;
            
            const response = await fetch(url);
            const data: ApiResponse = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Error en la búsqueda');
            }
            
            return jobsReales.filter(job => 
                job.title.toLowerCase().includes(query.toLowerCase()) ||
                job.service.toLowerCase().includes(query.toLowerCase()) ||
                job.company.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 50);
        } catch (error) {
            console.error('Error en searchJobsInBackend:', error);
            return [];
        }
    }

    private static validarCaracteres(texto: string): boolean {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]*$/.test(texto);
    }

    static async getHistorial(endpoint?: string): Promise<string[]> {
        try {
            const url = endpoint ? 
                `${this.API_BASE}/${endpoint}/historial` :
                `${this.API_BASE}/historial`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error al obtener historial:', error);
            return [];
        }
    }

    static async clearHistorial(endpoint?: string): Promise<boolean> {
        try {
            const url = endpoint ? 
                `${this.API_BASE}/${endpoint}/historial` :
                `${this.API_BASE}/historial`;
            
            const response = await fetch(url, { method: 'DELETE' });
            const data = await response.json();
            
            return data.success;
        } catch (error) {
            console.error('Error al limpiar historial:', error);
            return false;
        }
    }

    static async getAutocompleteSuggestions(query: string, endpoint?: string): Promise<string[]> {
        if (!query.trim() || !this.validarCaracteres(query)) return [];
        
        try {
            const url = endpoint ? 
                `${this.API_BASE}/${endpoint}/sugerencias?q=${encodeURIComponent(query)}` :
                `${this.API_BASE}/sugerencias?q=${encodeURIComponent(query)}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            return data.success ? data.data.map((item: any) => item.nombre || item.titulo) : [];
        } catch (error) {
            console.error('Error al obtener sugerencias:', error);
            return [];
        }
    }
}

function capitalizarPrimera(texto: string): string {
    texto = texto.trim();
    return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : '';
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
    // Estados
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
    const [loadingResultados, setLoadingResultados] = useState(false);
    const [mensajeNoResultados, setMensajeNoResultados] = useState("");

    // Referencias
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);
    const historialCargado = useRef(false);
    const busquedaEnCurso = useRef(false);

    const caracteresValidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]*$/;

    const guardarEnHistorial = useCallback(async (query: string) => {
        if (!query.trim()) return;
        
        try {
            setCargandoHistorial(true);
            const historalActual = [...historial];
            
            // Eliminar duplicados y mover la búsqueda al principio
            const index = historalActual.indexOf(query);
            if (index > -1) {
                historalActual.splice(index, 1);
            }
            historalActual.unshift(query);
            
            // Mantener solo las últimas 10 búsquedas
            const nuevoHistorial = historalActual.slice(0, 10);
            setHistorial(nuevoHistorial);
            
            // Guardar en localStorage
            localStorage.setItem("historialBusquedas", JSON.stringify(nuevoHistorial));
            
        } catch (error) {
            console.error('Error al guardar en historial:', error);
        } finally {
            setCargandoHistorial(false);
        }
    }, [historial]);

    // Cargar historial inicial
    useEffect(() => {
        const cargarHistorialGuardado = () => {
            try {
                const historialGuardado = localStorage.getItem("historialBusquedas");
                if (historialGuardado) {
                    const parsed = JSON.parse(historialGuardado);
                    if (Array.isArray(parsed)) {
                        setHistorial(parsed);
                    }
                }
                historialCargado.current = true;
            } catch (error) {
                console.error('Error al cargar historial:', error);
            }
        };

        if (mostrarHistorial && !historialCargado.current) {
            cargarHistorialGuardado();
        }
    }, [mostrarHistorial]);

    // Cleanup
    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Manejo de queries
    const handleQueryChange = useCallback((value: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const query = capitalizarPrimera(value);
        setQuery(query);

        // No mostrar sugerencias para consultas muy cortas
        if (query.length < 2) {
            setSugerencias([]);
            setMostrarSugerencias(false);
            setEstadoSugerencias("idle");
            return;
        }

        // Debounce para búsqueda de sugerencias
        timeoutRef.current = setTimeout(async () => {
            if (!isMounted.current) return;

            try {
                setEstadoSugerencias("loading");
                const sugs = await BusquedaService.getAutocompleteSuggestions(query, apiConfig?.endpoint);
                if (isMounted.current) {
                    setSugerencias(Array.isArray(sugs) ? sugs : []);
                    setMostrarSugerencias(true);
                    setEstadoSugerencias("success");
                }
            } catch (error) {
                if (isMounted.current) {
                    console.error('Error obteniendo sugerencias:', error);
                    setEstadoSugerencias("error");
                    setSugerencias([]);
                }
            }
        }, 300);
    }, [apiConfig?.endpoint]);

    const ejecutarBusqueda = useCallback(async () => {
        if (busquedaEnCurso.current) {
            console.log('⏸️ Ya hay una búsqueda en curso');
            return;
        }

        try {
            busquedaEnCurso.current = true;
            setLoadingResultados(true);
            setEstadoBusqueda("loading");

            const results = await BusquedaService.searchJobsInBackend(query, datos, apiConfig?.endpoint);
            
            if (isMounted.current) {
                setResultados(results);
                onSearch(query, results);
                setEstadoBusqueda("success");
                if (mostrarHistorial) {
                    guardarEnHistorial(query);
                }
            }
        } catch (error) {
            if (isMounted.current) {
                console.error('Error en búsqueda:', error);
                setEstadoBusqueda("error");
                setMensaje("Error en la búsqueda");
            }
        } finally {
            if (isMounted.current) {
                setLoadingResultados(false);
                busquedaEnCurso.current = false;
            }
        }
    }, [query, datos, apiConfig?.endpoint, onSearch, mostrarHistorial]);

    const handleSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        ejecutarBusqueda();
        setMostrarSugerencias(false);
    }, [ejecutarBusqueda]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setMostrarSugerencias(false);
            setMostrarHistorialLocal(false);
        }
    }, []);

    // Click outside handler
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
        <div className="relative w-full" ref={containerRef}>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setMostrarHistorialLocal(true)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
                >
                    <Search className="w-5 h-5" />
                </button>
            </form>

            {/* Sugerencias o historial */}
            {(mostrarSugerencias || mostrarHistorialLocal) && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                    {mostrarHistorialLocal && historial.length > 0 && (
                        <div className="p-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500">Búsquedas recientes</span>
                                <button
                                    onClick={async () => {
                                        await BusquedaService.clearHistorial(apiConfig?.endpoint);
                                        setHistorial([]);
                                        localStorage.removeItem("historialBusquedas");
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            {historial.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setQuery(item);
                                        setMostrarHistorialLocal(false);
                                        ejecutarBusqueda();
                                    }}
                                    className="flex items-center w-full p-2 hover:bg-gray-100 rounded text-left"
                                >
                                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}

                    {Array.isArray(sugerencias) && sugerencias.length > 0 && (
                        <div className="p-2">
                            {sugerencias.map((sugerencia, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setQuery(sugerencia);
                                        setMostrarSugerencias(false);
                                        ejecutarBusqueda();
                                    }}
                                    className="flex items-center w-full p-2 hover:bg-gray-100 rounded text-left"
                                >
                                    <Search className="w-4 h-4 mr-2 text-gray-400" />
                                    {sugerencia}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}