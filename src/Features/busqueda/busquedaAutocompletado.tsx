"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock } from "lucide-react";
import "./busqueda.css";

const DATA = [
    "Electricista",
    "Plomero",
    "Pintor",
    "Carpintero",
    "Cerrajero",
    "Electricidad industrial",
    "Electricidad domiciliaria",
    "Puerta",
    "Gasista",
    "Albañil",
    "Técnico en refrigeración",
    "Instalador de aire acondicionado",
];

type EstadoBusqueda = "idle" | "loading" | "error" | "success";

export default function BusquedaAutocompletado() {
    const [query, setQuery] = useState("");
    const [sugerencias, setSugerencias] = useState<string[]>([]);
    const [estado, setEstado] = useState<EstadoBusqueda>("idle");
    const [mensaje, setMensaje] = useState("");
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    // Por esto (muestra solo los primeros 6 items inicialmente):
    const [resultados, setResultados] = useState<string[]>(DATA.slice(0, 6));
    const [historial, setHistorial] = useState<string[]>([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const caracteresValidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ´,\-\s]*$/;

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

    // 🔍 Buscar coincidencias para sugerencias
    const buscarCoincidencias = useCallback(async (texto: string) => {
        if (!texto.trim() || texto.trim().length < 2) {
            setSugerencias([]);
            setEstado("idle");
            return;
        }

        setEstado("loading");

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const textoNormalizado = normalizarTexto(texto);

            const resultados = DATA.filter((item) => {
                const itemNormalizado = normalizarTexto(item);
                return itemNormalizado.includes(textoNormalizado);
            });

            const unicos = Array.from(new Set(resultados)).slice(0, 4);

            setSugerencias(unicos);
            setEstado(unicos.length > 0 ? "success" : "success");

            if (unicos.length === 0) {
                setMensaje(`No se han encontrado resultados para "${texto}"`);
            } else {
                setMensaje("");
            }
        } catch (error) {
            setEstado("error");
            setMensaje("Error al realizar la búsqueda, intenta de nuevo");
            setSugerencias([]);
        }
    }, [normalizarTexto]);

    // 🧠 Control de búsqueda con debounce
    useEffect(() => {
        if (busquedaRealizada) return; // No mostrar sugerencias después de buscar

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        const texto = query.trim();

        // Si el input está vacío
        if (!texto) {
            setSugerencias([]);
            setMensaje("");
            setEstado("idle");
            setMostrarSugerencias(false);
            setMostrarHistorial(false);
            return;
        }

        // Validar longitud máxima
        if (query.length > 80) {
            setMensaje("Máximo 80 caracteres permitidos");
            setSugerencias([]);
            setEstado("error");
            setMostrarSugerencias(true);
            return;
        }

        // Validar caracteres permitidos
        if (!caracteresValidos.test(query)) {
            setSugerencias([]);
            setMensaje(`No se han encontrado resultados para "${query}"`);
            setEstado("error");
            setMostrarSugerencias(true);
            return;
        }

        // Buscar desde la segunda letra
        if (texto.length >= 2) {
            setMostrarHistorial(false);
            setMostrarSugerencias(true);
            debounceRef.current = setTimeout(() => {
                buscarCoincidencias(texto);
            }, 300);
        } else {
            setSugerencias([]);
            setMensaje("");
            setEstado("idle");
            setMostrarSugerencias(false);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, buscarCoincidencias, busquedaRealizada]);

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
    const seleccionarSugerencia = useCallback((texto: string) => {
        setQuery(texto);
        setSugerencias([]);
        setMensaje("");
        setMostrarSugerencias(false); // 👈 Ocultar sugerencias al seleccionar
        setMostrarHistorial(false);
        setBusquedaRealizada(true); // 👈 Marcar que ya se realizó búsqueda

        guardarEnHistorial(texto);

        // Ejecutar búsqueda completa
        const textoNormalizado = normalizarTexto(texto);
        const resultadosCompletos = DATA.filter(item =>
            normalizarTexto(item).includes(textoNormalizado)
        );
        setResultados(Array.from(new Set(resultadosCompletos)));
    }, [guardarEnHistorial, normalizarTexto]);

    // 🔍 Ejecutar búsqueda manual (al presionar Enter)
    const ejecutarBusqueda = useCallback(() => {
        const texto = query.trim();
        if (!texto || texto.length < 2) return;

        setSugerencias([]);
        setMostrarSugerencias(false); // 👈 Ocultar sugerencias al presionar Enter
        setMostrarHistorial(false);
        setBusquedaRealizada(true); // 👈 Marcar que ya se realizó búsqueda

        guardarEnHistorial(texto);

        const textoNormalizado = normalizarTexto(texto);
        const resultadosCompletos = DATA.filter(item =>
            normalizarTexto(item).includes(textoNormalizado)
        );

        setResultados(Array.from(new Set(resultadosCompletos)));
    }, [query, guardarEnHistorial, normalizarTexto]);

    // 🗑️ Limpiar búsqueda
    const limpiarBusqueda = useCallback(() => {
        setQuery("");
        setSugerencias([]);
        setMensaje("");
        setEstado("idle");
        setResultados([]);
        setMostrarSugerencias(false);
        setMostrarHistorial(false);
        setBusquedaRealizada(false); // 👈 Resetear estado de búsqueda
        inputRef.current?.focus();
    }, []);

    // ⌨️ Manejar tecla Enter
    const manejarKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            ejecutarBusqueda();
        }
    }, [ejecutarBusqueda]);

    return (
        <div className="busqueda-page">
            <div className="contenedor-principal">
                <div className="busqueda-container">

                    {/* CONTENEDOR INTERNO PARA LA BÚSQUEDA */}
                    <div className="contenedor-busqueda">

                        {/* BARRA DE BÚSQUEDA */}
                        <div className="busqueda-barra">
                            <Search className="icono-busqueda" size={20} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Buscar por fixer o tipo de trabajo..."
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setBusquedaRealizada(false);
                                }}
                                onKeyDown={manejarKeyDown}
                                onFocus={() => {
                                    if (!query.trim() && historial.length > 0 && !busquedaRealizada) {
                                        setMostrarHistorial(true);
                                    }
                                }}
                                onBlur={() => {
                                    setTimeout(() => {
                                        setMostrarHistorial(false);
                                        if (!busquedaRealizada) {
                                            setMostrarSugerencias(false);
                                        }
                                    }, 150);
                                }}
                                maxLength={80}
                                className="busqueda-input"
                            />
                            {query && (
                                <button className="btn-limpiar" onClick={limpiarBusqueda}>
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* CONTADOR DE CARACTERES */}
                        <div className={`contador-caracteres ${query.length > 70 ? 'alerta' : ''}`}>
                            {query.length}/80 caracteres
                        </div>

                        {/* CAJA DE SUGERENCIAS - DENTRO DEL CONTENEDOR INTERNO */}
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

                                {/* SUGERENCIAS DE BÚSQUEDA */}
                                {mostrarSugerencias && query.length >= 2 && (
                                    <>
                                        {estado === "loading" && (
                                            <div className="caja-sugerencias cargando">
                                                <div className="spinner"></div>
                                                Cargando...
                                            </div>
                                        )}

                                        {estado !== "loading" && (sugerencias.length > 0 || mensaje) && (
                                            <ul className="caja-sugerencias">
                                                {sugerencias.map((s, i) => (
                                                    <li key={i} onClick={() => seleccionarSugerencia(s)}>
                                                        {s}
                                                    </li>
                                                ))}
                                                {mensaje && (
                                                    <li className="mensaje-sugerencia">{mensaje}</li>
                                                )}
                                            </ul>
                                        )}

                                        {estado === "error" && mensaje && (
                                            <ul className="caja-sugerencias">
                                                <li className="mensaje-error">{mensaje}</li>
                                            </ul>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* CAJA DE RESULTADOS - CON MARGEN SUPERIOR SUFICIENTE */}
                    <div className="caja-resultados">
                        {resultados.length > 0 ? (
                            resultados.map((resultado, index) => (
                                <div key={index} className="resultado-item">
                                    {resultado}
                                </div>
                            ))
                        ) : busquedaRealizada && query.trim() ? (
                            <div className="mensaje-resultado">
                                No se encontraron resultados para "{query}"
                            </div>
                        ) : (
                            DATA.slice(0, 6).map((item, index) => (
                                <div key={index} className="resultado-item">
                                    {item}
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
    }