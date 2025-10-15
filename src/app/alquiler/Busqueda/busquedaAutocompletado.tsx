"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { JobFrontend } from "../paginacion/types/job";
import { searchJobs } from "../paginacion/services/jobService";
import "./busqueda.css";

type EstadoSugerencias = "idle" | "loading" | "error" | "success";
type EstadoBusqueda = "idle" | "loading" | "success" | "error";

interface BusquedaAutocompletadoProps {
    onSearch: (searchTerm: string, resultados: JobFrontend[]) => void;
    datos?: JobFrontend[];
    placeholder?: string;
    valorInicial?: string; // 🔧 NUEVO: Para mantener el texto al recargar
}

export default function BusquedaAutocompletado({
    onSearch,
    datos = [],
    placeholder = "Buscar por puesto, empresa o servicio...",
    valorInicial = "" // 🔧 NUEVO: Valor por defecto
}: BusquedaAutocompletadoProps) {
    // 🔧 MODIFICADO: Usar valorInicial como estado inicial
    const [query, setQuery] = useState(valorInicial);

    const [sugerencias, setSugerencias] = useState<string[]>([]);
    const [estadoSugerencias, setEstadoSugerencias] = useState<EstadoSugerencias>("idle");
    const [estadoBusqueda, setEstadoBusqueda] = useState<EstadoBusqueda>("idle");
    const [mensaje, setMensaje] = useState("");
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [resultados, setResultados] = useState<JobFrontend[]>([]);
    const [historial, setHistorial] = useState<string[]>([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminoBusquedaAnterior = useRef("");

    const caracteresValidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ´,\-\s]*$/;
    // 🔧 NUEVO: useEffect para sincronizar cuando cambie valorInicial (al recargar)
    useEffect(() => {
        console.log('🔄 [AUTOCOMPLETADO] valorInicial actualizado:', valorInicial);
        if (valorInicial !== query) {
            setQuery(valorInicial);
        }
    }, [valorInicial]);
    // 🔄 Inicializar historial desde localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem("historialBusquedas");
            if (stored) {
                setHistorial(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error cargando historial:", error);
        }
    }, []);

    // 🎯 Función para normalizar texto
    const normalizarTexto = useCallback((texto: string): string => {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }, []);

    // 🔍 Extraer términos de búsqueda
    const extraerTerminosBusqueda = useCallback((jobs: JobFrontend[]): string[] => {
        const terminos: string[] = [];

        jobs.forEach(job => {
            if (job.title) terminos.push(job.title);
            if (job.company) terminos.push(job.company);
            if (job.service) {
                const servicioLimpio = job.service.replace("Servicio: ", "");
                terminos.push(servicioLimpio);
            }
        });

        return Array.from(new Set(terminos.filter(term => term && term.trim())));
    }, []);

    // 🔍 Buscar coincidencias para sugerencias
    const buscarCoincidencias = useCallback(async (texto: string, jobs: JobFrontend[]) => {
        if (!texto.trim() || texto.trim().length < 2) {
            setSugerencias([]);
            setEstadoSugerencias("idle");
            return;
        }

        setEstadoSugerencias("loading");

        try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const textoNormalizado = normalizarTexto(texto);
            const terminosBusqueda = extraerTerminosBusqueda(jobs);

            const resultados = terminosBusqueda.filter((item) => {
                const itemNormalizado = normalizarTexto(item);
                return itemNormalizado.includes(textoNormalizado);
            });

            const unicos = Array.from(new Set(resultados)).slice(0, 6);

            setSugerencias(unicos);
            setEstadoSugerencias(unicos.length > 0 ? "success" : "success");

            if (unicos.length === 0) {
                setMensaje(`No se encontraron coincidencias para "${texto}"`);
            } else {
                setMensaje("");
            }
        } catch (error) {
            setEstadoSugerencias("error");
            setMensaje("Error al realizar la búsqueda, intenta de nuevo");
            setSugerencias([]);
        }
    }, [normalizarTexto, extraerTerminosBusqueda]);

    // 🔍 Búsqueda local para sugerencias
    const buscarTrabajosLocal = useCallback((texto: string, jobs: JobFrontend[]): JobFrontend[] => {
        if (!texto.trim()) return jobs;

        const textoNormalizado = normalizarTexto(texto);

        return jobs.filter(job => {
            return (
                (job.title && normalizarTexto(job.title).includes(textoNormalizado)) ||
                (job.company && normalizarTexto(job.company).includes(textoNormalizado)) ||
                (job.service && normalizarTexto(job.service).includes(textoNormalizado))
            );
        });
    }, [normalizarTexto]);

    // 🧠 LÓGICA MEJORADA: Control de cuándo mostrar sugerencias/historial
    const actualizarVisualizacion = useCallback((texto: string) => {
        const textoLimpio = texto.trim();

        // 🔄 Resetear estados cuando no hay texto
        if (!textoLimpio) {
            setSugerencias([]);
            setMensaje("");
            setEstadoSugerencias("idle");
            setMostrarSugerencias(false);

            if (historial.length > 0 && !busquedaRealizada) {
                setMostrarHistorial(true);
            } else {
                setMostrarHistorial(false);
            }
            return;
        }

        // ❌ Validaciones de caracteres y longitud
        if (texto.length > 80) {
            setMensaje("Máximo 80 caracteres permitidos");
            setSugerencias([]);
            setEstadoSugerencias("error");
            setMostrarSugerencias(true);
            setMostrarHistorial(false);
            return;
        }

        if (!caracteresValidos.test(texto)) {
            setMensaje(`No se han encontrado resultados para "${texto}"`);
            setSugerencias([]);
            setEstadoSugerencias("error");
            setMostrarSugerencias(true);
            setMostrarHistorial(false);
            return;
        }

        // ✅ Mostrar sugerencias cuando hay 2+ caracteres
        if (textoLimpio.length >= 2) {
            setMostrarHistorial(false);
            setMostrarSugerencias(true);
        } else {
            setSugerencias([]);
            setMensaje("");
            setEstadoSugerencias("idle");
            setMostrarSugerencias(false);
            setMostrarHistorial(false);
        }
    }, [historial.length, busquedaRealizada, caracteresValidos]);

    // 🧠 Control de búsqueda con debounce
    useEffect(() => {
        if (busquedaRealizada || datos.length === 0) return;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        const texto = query.trim();

        actualizarVisualizacion(query);

        if (texto.length >= 2) {
            debounceRef.current = setTimeout(() => {
                buscarCoincidencias(texto, datos);
            }, 300);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, buscarCoincidencias, busquedaRealizada, datos, actualizarVisualizacion]);

    // 💾 Guardar en historial
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
            console.error("Error guardando historial:", error);
        }
    }, [historial]);

    // 🎯 Seleccionar sugerencia
    const seleccionarSugerencia = useCallback(async (texto: string) => {
        setQuery(texto);
        setSugerencias([]);
        setMensaje("");
        setMostrarSugerencias(false);
        setMostrarHistorial(false);
        setBusquedaRealizada(true);
        setEstadoBusqueda("loading");

        // Guardar término actual para comparar después
        terminoBusquedaAnterior.current = texto;

        guardarEnHistorial(texto);

        try {
            const resultadosBackend = await searchJobs(texto);
            setResultados(resultadosBackend);
            setEstadoBusqueda("success");
            onSearch(texto, resultadosBackend);
        } catch (error) {
            setEstadoBusqueda("error");
            setMensaje("Error al cargar resultados completos");
            const resultadosLocales = buscarTrabajosLocal(texto, datos);
            setResultados(resultadosLocales);
            onSearch(texto, resultadosLocales);
        }
    }, [guardarEnHistorial, buscarTrabajosLocal, datos, onSearch]);

    // 🔍 Ejecutar búsqueda manual
    const ejecutarBusqueda = useCallback(async () => {
        const texto = query.trim();
        if (!texto || texto.length < 2) return;

        // Guardar término actual para comparar después
        terminoBusquedaAnterior.current = texto;

        setSugerencias([]);
        setMostrarSugerencias(false);
        setMostrarHistorial(false);
        setBusquedaRealizada(true);
        setEstadoBusqueda("loading");

        guardarEnHistorial(texto);

        try {
            const resultadosBackend = await searchJobs(texto);
            setResultados(resultadosBackend);
            setEstadoBusqueda("success");
            onSearch(texto, resultadosBackend);
        } catch (error) {
            setEstadoBusqueda("error");
            setMensaje("Error en la búsqueda");
            const resultadosLocales = buscarTrabajosLocal(texto, datos);
            setResultados(resultadosLocales);
            onSearch(texto, resultadosLocales);
        }
    }, [query, guardarEnHistorial, buscarTrabajosLocal, datos, onSearch]);

  
    // 🗑️ Limpiar búsqueda - MODIFICADA para mostrar historial
    const limpiarBusqueda = useCallback(() => {
        setQuery("");
        setSugerencias([]);
        setMensaje("");
        setEstadoSugerencias("idle");
        setEstadoBusqueda("idle");
        setResultados([]);
        setMostrarSugerencias(false);

        // 🔧 NUEVO: Mostrar historial después de limpiar (si hay historial)
        if (historial.length > 0) {
            setMostrarHistorial(true);
        } else {
            setMostrarHistorial(false);
        }

        setBusquedaRealizada(false);
        terminoBusquedaAnterior.current = "";

        onSearch("", datos);
        inputRef.current?.focus();
    }, [datos, onSearch, historial]); // 🔧 IMPORTANTE: Agregar historial como dependencia

    // ⌨️ Manejar tecla Enter
    const manejarKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            ejecutarBusqueda();
        } else if (e.key === 'Escape') {
            setMostrarSugerencias(false);
            setMostrarHistorial(false);
            inputRef.current?.blur();
        }
    }, [ejecutarBusqueda]);

    // 🖱️ Cerrar sugerencias al hacer click fuera
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
        <div className="busqueda-container" ref={containerRef}>
            <div className="contenedor-busqueda">
                <div className="busqueda-barra">
                    <Search className="icono-busqueda" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        value={query} // ← 🔧 ESTA LÍNEA ES IMPORTANTE
                        onChange={(e) => {
                            const nuevoValor = e.target.value;
                            setQuery(nuevoValor);

                            // Si el usuario borra y el campo queda vacío, mostrar historial Y VOLVER A TODOS LOS DATOS
                            if (nuevoValor === "") {
                                setBusquedaRealizada(false);
                                setEstadoBusqueda("idle");
                                // IMPORTANTE: Llamar a onSearch con string vacío para mostrar todos los datos
                                onSearch("", datos);
                                if (historial.length > 0) {
                                    setMostrarHistorial(true);
                                }
                            }

                            // Si el usuario está editando después de una búsqueda, resetear
                            if (busquedaRealizada && nuevoValor !== terminoBusquedaAnterior.current) {
                                setBusquedaRealizada(false);
                                setEstadoBusqueda("idle");
                            }

                            setBusquedaRealizada(false);
                        }}
                        onKeyDown={manejarKeyDown}
                        onFocus={() => {
                            // Siempre que se hace focus, permitir mostrar sugerencias/historial
                            setBusquedaRealizada(false);
                            setEstadoBusqueda("idle");

                            if (!query.trim() && historial.length > 0) {
                                setMostrarHistorial(true);
                            }
                            if (query.length >= 2) {
                                setMostrarSugerencias(true);
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
                        Buscar
                    </button>
                </div>
                <div className={`contador-caracteres ${query.length > 70 ? 'alerta' : ''}`}>
                    {query.length}/80 caracteres
                </div>

                {!busquedaRealizada && (
                    <>
                        {/* HISTORIAL */}
                        {mostrarHistorial && historial.length > 0 && (
                            <ul className="caja-sugerencias">
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
                            </ul>
                        )}

                        {/* SUGERENCIAS */}
                        {mostrarSugerencias && query.length >= 2 && (
                            <>
                                {estadoSugerencias === "loading" && (
                                    <div className="caja-sugerencias cargando">
                                        <div className="spinner"></div>
                                        Buscando sugerencias...
                                    </div>
                                )}

                                {estadoSugerencias !== "loading" && (sugerencias.length > 0 || mensaje) && (
                                    <ul className="caja-sugerencias">
                                        {sugerencias.map((s, i) => (
                                            <li key={i} onClick={() => seleccionarSugerencia(s)}>
                                                <Search className="icono-sugerencia" size={16} />
                                                {s}
                                            </li>
                                        ))}
                                        {mensaje && (
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