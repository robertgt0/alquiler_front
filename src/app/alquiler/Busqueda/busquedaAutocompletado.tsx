"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Job } from "../paginacion/types/job";
//import "./busqueda.css";

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
            if (!query.trim()) return [];

            if (!this.validarCaracteres(query)) {
                throw new Error('Caracteres inválidos en la búsqueda');
            }

            const response = await fetch(
                `${this.API_BASE}/busqueda?q=${encodeURIComponent(query)}&limit=50`
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ [SERVICE] Error response:', errorText);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data: ApiResponse = await response.json();
            if (data.success && data.data && Array.isArray(data.data)) {
                return this.convertEspecialidadesToJobs(data.data);
            }

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
        return especialidades.map((especialidad: EspecialidadBackend) => {
            const nombreServicio = especialidad.nombre || "Servicio no disponible";
            return {
                title: nombreServicio,
                company: "Profesionales disponibles",
                service: nombreServicio,
                location: "Varias ubicaciones",
                postedDate: new Date().toLocaleDateString('es-ES'),
                salaryRange: "Consultar",
                employmentType: "Servicio",
                employmentTypeColor: "bg-blue-100 text-blue-800"
            };
        });
    }

    static async getHistorial(): Promise<string[]> {
        try {
            const response = await fetch(`${this.API_BASE}/busqueda/historial`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    return data.data || [];
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
            const response = await fetch(`${this.API_BASE}/busqueda/historial`, {
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
            if (!this.validarCaracteres(query)) return [];

            const response = await fetch(
                `${this.API_BASE}/busqueda?q=${encodeURIComponent(query)}&limit=6`
            );

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data: ApiResponse = await response.json();
            if (data.success && data.data && Array.isArray(data.data)) {
                const sugerencias = data.data
                    .map((item: EspecialidadBackend) => item.nombre)
                    .filter((nombre: string) => nombre && nombre.trim())
                    .slice(0, 6);

                return sugerencias;
            }

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

    // Persistencia de resultados

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminoBusquedaAnterior = useRef("");

    const caracteresValidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]*$/;

    const actualizarURL = useCallback((searchTerm: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm.trim()) {
            params.set('q', searchTerm.trim());
        } else {
            params.delete('q');
        }
        router.push(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    useEffect(() => {
        const urlQuery = searchParams.get('q');
        if (urlQuery && urlQuery !== query) {
            setQuery(urlQuery);
            setTimeout(() => {
                ejecutarBusquedaCompleta(urlQuery, false);
            }, 100);
        }
    }, [searchParams]);

    useEffect(() => {
        if (valorInicial !== query) setQuery(valorInicial);
    }, [valorInicial]);

    useEffect(() => {
        const cargarHistorialBackend = async () => {
            try {
                let terminos: string[] = await BusquedaService.getHistorial();

                if (!terminos || terminos.length === 0) {
                    const stored = localStorage.getItem("historialBusquedas");
                    if (stored) terminos = JSON.parse(stored);
                }

                setHistorial(terminos);
                if (terminos.length > 0) setMostrarHistorial(true);
            } catch (error) {
                console.error(error);
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
            }
        } catch {}
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

    const terminos = normalizarTexto(texto)
        .split(/[, ]+/) // divide por coma o espacio
        .filter(Boolean); // elimina vacíos

    return jobs.filter(job => {
        const servicio = job.service ? normalizarTexto(job.service) : "";
        const titulo = job.title ? normalizarTexto(job.title) : "";

        // devuelve true si al menos uno de los términos coincide
        return terminos.some(t => servicio.includes(t) || titulo.includes(t));
    });
}, [normalizarTexto]);


    const guardarEnHistorial = useCallback((texto: string) => {
        const textoNormalizado = texto.trim();
        if (!textoNormalizado) return;

        const nuevoHistorial = Array.from(new Set([textoNormalizado, ...historial])).slice(0, 10);
        setHistorial(nuevoHistorial);
        try {
            localStorage.setItem("historialBusquedas", JSON.stringify(nuevoHistorial));
        } catch {}
    }, [historial]);

    const buscarSugerenciasBackend = useCallback(async (texto: string): Promise<string[]> => {
        if (!caracteresValidos.test(texto)) return [];
        try {
            const sugerenciasBackend = await BusquedaService.getAutocompleteSuggestions(texto);
            if (sugerenciasBackend.length > 0) return sugerenciasBackend;

            const resultadosLocales = buscarTrabajosLocal(texto, datos);
            const terminosUnicos = Array.from(new Set(resultadosLocales.map(job => job.service || job.title).filter(Boolean) as string[]));
            return terminosUnicos.slice(0, 6);

        } catch {
            const resultadosLocales = buscarTrabajosLocal(texto, datos);
            const terminosUnicos = Array.from(new Set(resultadosLocales.map(job => job.service || job.title).filter(Boolean) as string[]));
            return terminosUnicos.slice(0, 6);
        }
    }, [buscarTrabajosLocal, datos]);

    const ejecutarBusquedaCompleta = useCallback(async (texto: string, guardarEnHistorialFlag: boolean = true) => {
        const textoLimpio = texto.trim();

        if (textoLimpio.length > 80) { setMensaje("La búsqueda no puede exceder 80 caracteres"); setEstadoBusqueda("error"); return; }
        if (!caracteresValidos.test(textoLimpio)) { setMensaje("Solo se permiten caracteres alfabéticos y los especiales: ´ , - , comilla simple y comilla doble"); setEstadoBusqueda("error"); return; }
        if (textoLimpio.length < 2) { setMensaje("La búsqueda debe tener al menos 2 caracteres"); setEstadoBusqueda("error"); return; }

    setEstadoBusqueda("loading");
    setBusquedaRealizada(true);
    setMostrarSugerencias(true); // Mostrar sugerencias mientras busca
    setMostrarHistorial(false);
    terminoBusquedaAnterior.current = textoLimpio;

        if (guardarEnHistorialFlag) guardarEnHistorial(textoLimpio);
        actualizarURL(textoLimpio);

        try {
            const resultadosBackend = await BusquedaService.searchJobsInBackend(textoLimpio);
            setResultados(resultadosBackend);
            setEstadoBusqueda("success");
            onSearch(textoLimpio, resultadosBackend);
        } catch (error) {
            setEstadoBusqueda("error");
            const resultadosLocales = buscarTrabajosLocal(textoLimpio, datos);
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

        if (historial.length > 0) setMostrarHistorial(true);
        else setMostrarHistorial(false);

        setBusquedaRealizada(false);
        terminoBusquedaAnterior.current = "";
        actualizarURL("");

        onSearch("", datos);
        inputRef.current?.focus();
    }, [datos, onSearch, historial, actualizarURL]);

    const manejarKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') ejecutarBusqueda();
        else if (e.key === 'Escape') { setMostrarSugerencias(false); setMostrarHistorial(false); inputRef.current?.blur(); }
    }, [ejecutarBusqueda]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const texto = query.trim();

        const actualizarVisualizacion = () => {
            if (!texto) {
                setSugerencias([]);
                setMensaje("");
                setEstadoSugerencias("idle");
                setMostrarSugerencias(false);
                return;
            }

            if (!caracteresValidos.test(texto)) {
                setMensaje("Solo se permiten caracteres alfabéticos y los especiales: ´ , - , comilla simple y comilla doble");
                setSugerencias([]);
                setEstadoSugerencias("error");
                setMostrarSugerencias(true);
                setMostrarHistorial(false);
                return;
            }

            if (texto.length >= 2 && !busquedaRealizada) {
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
                    const sugerenciasBackend = await buscarSugerenciasBackend(texto);
                    setSugerencias(sugerenciasBackend);
                    setEstadoSugerencias("success");
                    setMensaje(sugerenciasBackend.length === 0 ? `No se encontraron servicios para "${texto}"` : "");
                } catch {
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

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query, busquedaRealizada, historial.length, buscarSugerenciasBackend]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setMostrarSugerencias(false);
                setMostrarHistorial(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

  return (
  <div className="relative w-full" ref={containerRef}>
    {/* Contenedor principal con position: relative */}
    <div className="relative w-full">
      {/* BARRA DE BÚSQUEDA */}
      <div className="flex items-center w-full bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200">
        <Search className="absolute left-3 text-gray-500 z-10" size={20} />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
                    onChange={(e) => {
                        let nuevoValor = e.target.value;
                        // Forzar primera letra mayúscula
                        if (nuevoValor.length > 0) {
                            nuevoValor = nuevoValor.charAt(0).toUpperCase() + nuevoValor.slice(1);
                        }
                        setQuery(nuevoValor);
                        if (nuevoValor === "") {
                            setBusquedaRealizada(false);
                            setEstadoBusqueda("idle");
                            onSearch("", datos || []);
                            if (historial.length > 0) setMostrarHistorial(true);
                        }
                        if (busquedaRealizada && nuevoValor !== terminoBusquedaAnterior.current) {
                            setBusquedaRealizada(false);
                            setEstadoBusqueda("idle");
                        }
                    }}
          onKeyDown={manejarKeyDown}
          onFocus={() => {
            if (!busquedaRealizada) {
              if (!query.trim() && historial.length > 0) setMostrarHistorial(true);
              if (query.length >= 2) setMostrarSugerencias(true);
            }
          }}
          maxLength={80}
          className="w-full pl-9 pr-24 py-2 text-base border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-transparent text-black"
        />
        {query && (
          <button
            className="absolute right-24 bg-transparent border-none text-gray-500 hover:text-gray-900 cursor-pointer z-10 p-1"
            onClick={limpiarBusqueda}
            type="button"
          >
            <X size={16} />
          </button>
        )}
        <button
          className="absolute right-2 bg-blue-600 text-white border-none px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
          onClick={ejecutarBusqueda}
          disabled={!query.trim() || query.trim().length < 2}
          type="button"
        >
          {estadoBusqueda === "loading" ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* CONTADOR DE CARACTERES */}
      <div className={`text-right text-xs mt-0 pt-1 px-1 ${query.length > 70 ? 'text-red-600' : 'text-gray-500'}`}>
        {query.length}/80 caracteres
      </div>

      {estadoBusqueda === "error" && mensaje && (
        <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md mt-2">
          {mensaje}
        </div>
      )}

            {/* HISTORIAL Y SUGERENCIAS */}
            {!busquedaRealizada && (
                <>
                    {/* Historial */}
                    {mostrarHistorial && historial.length > 0 && (
                        <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-b-lg shadow-md list-none m-0 p-0 z-50 max-h-64 overflow-y-auto animate-fadeIn top-full -translate-y-1">
                            <li className="px-4 py-2 text-xs font-semibold text-gray-700 border-b border-gray-200 flex justify-between items-center">
                                Búsquedas recientes
                            </li>
                            {historial.map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => seleccionarSugerencia(item)}
                                >
                                    <Clock className="text-gray-500 flex-shrink-0" size={16} />
                                    {item}
                                </li>
                            ))}
                            <li
                                className="flex items-center gap-2 px-4 py-2 text-xs text-red-500 cursor-pointer hover:bg-red-50 transition-colors border-t border-gray-200"
                                onClick={limpiarHistorialBackend}
                            >
                                <Trash2 size={14} />
                                Limpiar historial
                            </li>
                        </ul>
                    )}

                    {/* Sugerencias */}
                    {mostrarSugerencias && query.length >= 2 && estadoSugerencias !== "loading" && (
                        <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-b-lg shadow-md list-none m-0 p-0 z-50 max-h-64 overflow-y-auto animate-fadeIn top-full -translate-y-1">
                            <li className="px-4 py-2 text-xs font-semibold text-gray-700 border-b border-gray-200">
                                Sugerencias
                            </li>
                            {sugerencias.length === 0 ? (
                                <li className="px-4 py-2 text-sm text-yellow-700 bg-yellow-100 rounded-md">
                                    No se han encontrado resultados para "{query}"
                                </li>
                            ) : (
                                sugerencias.map((s, i) => (
                                    <li
                                        key={i}
                                        onClick={() => seleccionarSugerencia(s)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <Search className="text-gray-500 mr-2 flex-shrink-0" size={16} />
                                        {s}
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </>
            )}

            {/* RESULTADOS DE LA BÚSQUEDA */}
            {busquedaRealizada && resultados.length === 0 && query.trim() !== "" && (
                <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 text-sm rounded-md">
                    No se han encontrado resultados para "{query}"
                </div>
            )}
    </div>
  </div>
);
}