"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface BusquedaAvanzadaProps {
  onAplicarFiltros: (filtros: Filtros, resultados?: ResultItem[]) => void;
  onLimpiarFiltros?: () => void;
  onToggle?: (abierta: boolean) => void;
}

export interface Filtros {
  tipoServicio?: string;
  zona?: string;
  precioMin?: number;
  precioMax?: number;
  horario?: string;
  experiencia?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export type ResultItem = {
  id: string | number;
} & Record<string, unknown>;

const API_BASE = "http://localhost:5000/api/borbotones/search/avanzada";
const API_SERVICIOS = `${API_BASE}/servicios`;
const API_DISPONIBILIDAD = `${API_BASE}/disponibilidad`;
const API_ZONA = `${API_BASE}/zona`;
const API_EXPERIENCIA = `${API_BASE}/experiencia`;
const API_PRECIO = `${API_BASE}/precio`;
const API_FECHA = `${API_BASE}/fecha`;



function normalizeToItems(arr: unknown): ResultItem[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((raw) => {
      if (raw && typeof raw === "object") {
        const o = raw as Record<string, unknown>;
        const id = o["id"] ?? o["id_servicio"] ?? o["_id"];
        if (id !== undefined) return { id, ...o };
      }
      return null;
    })
    .filter((x): x is ResultItem => x !== null);
}

function intersectById(lists: ResultItem[][]): ResultItem[] {
  if (lists.length === 0) return [];
  if (lists.length === 1) return lists[0];

  const idSets = lists.map((arr) => new Set(arr.map((x) => String(x.id))));
  const commonIds = [...idSets[0]].filter((id) => idSets.every((s) => s.has(id)));

  const index = new Map<string, ResultItem>();
  for (const arr of lists)
    for (const it of arr) {
      const k = String(it.id);
      if (!index.has(k)) index.set(k, it);
    }

  return commonIds.map((id) => index.get(id)!).filter(Boolean);
}

async function getDatos(endpoint: string, params?: Record<string, string | number>) {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const key in params) {
      const value = params[key];
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        searchParams.append(key, String(value));
      }
    }
  }
  const url = searchParams.toString() ? `${endpoint}?${searchParams.toString()}` : endpoint;
  const { data } = await axios.get(url);
  return data;
}

/*  BÚSQUEDA CON COINCIDENCIA  */

async function buscarConInterseccion(f: Filtros): Promise<ResultItem[]> {
  const requests: Array<Promise<unknown>> = [];

  if (f.tipoServicio) requests.push(getDatos(API_SERVICIOS, { servicio: f.tipoServicio }));
  if (f.horario) requests.push(getDatos(API_DISPONIBILIDAD, { turno: f.horario }));
  if (f.zona && f.zona.trim().length > 1) requests.push(getDatos(API_ZONA, { zona: f.zona }));

  if (f.experiencia) {
    const match = f.experiencia.match(/(\d+)\s*a\s*(\d+)/);
    if (match) {
      const años_min = Number(match[1]);
      const años_max = Number(match[2]);
      requests.push(getDatos(API_EXPERIENCIA, { años_min, años_max }));
    }
  }

  if (f.precioMin !== undefined || f.precioMax !== undefined) {
    const precioParams: Record<string, number> = {};
    if (f.precioMin !== undefined) precioParams.precio_min = f.precioMin;
    if (f.precioMax !== undefined) precioParams.precio_max = f.precioMax;
    requests.push(getDatos(API_PRECIO, precioParams));
  }

  if (f.fechaInicio) requests.push(getDatos(API_FECHA, { fecha_inicio: f.fechaInicio }));
  if (f.fechaFin) requests.push(getDatos(API_FECHA, { fecha_fin: f.fechaFin }));

  if (requests.length === 0) {
    throw new Error("Debes seleccionar al menos un filtro para buscar.");
  }

  const responses = await Promise.all(requests);
  const listas: ResultItem[][] = responses.map((r) => {
    if (Array.isArray(r)) return normalizeToItems(r);
    if (r && typeof r === "object") {
      const arr = Object.values(r).find((v) => Array.isArray(v));
      if (arr) return normalizeToItems(arr);
    }
    return [];
  });

  let resultadoFinal = intersectById(listas);

  if (f.tipoServicio) {
    const busqueda = f.tipoServicio.toLowerCase();
    resultadoFinal = resultadoFinal.filter((item) => {
      const nombre = String(item.nombre || item.tipoServicio || "").toLowerCase();
      return nombre.includes(busqueda);
    });
  }

  return resultadoFinal;
}



const BusquedaAvanzada: React.FC<BusquedaAvanzadaProps> = ({
  onAplicarFiltros,
  onLimpiarFiltros,
  onToggle,
}) => {
  const [filtros, setFiltros] = useState<Filtros>({});
  const [tiposDeServicio, setTiposDeServicio] = useState<string[]>([]);
  const [zonas, setZonas] = useState<string[]>([]);
  const [horarios] = useState<string[]>(["Mañana", "Tarde", "Noche", "Tiempo Completo"]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandido, setExpandido] = useState(false);

  const [fechaInicio, setFechaInicio] = useState<string>(filtros.fechaInicio || "");
  const [fechaFin, setFechaFin] = useState<string>(filtros.fechaFin || "");

  
  useEffect(() => {
    const filtrosGuardados = localStorage.getItem("busquedaAvanzadaFiltros");
    if (filtrosGuardados) {
      const parsed = JSON.parse(filtrosGuardados);
      setFiltros(parsed);
      setFechaInicio(parsed.fechaInicio || "");
      setFechaFin(parsed.fechaFin || "");
    }
  }, []);

  /* ======================= CARGAR CATÁLOGOS ======================= */
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [serviciosRes, zonasRes] = await Promise.all([getDatos(API_SERVICIOS), getDatos(API_ZONA)]);
        if (serviciosRes?.data && Array.isArray(serviciosRes.data))
          setTiposDeServicio(serviciosRes.data.map((s: any) => s.nombre || s));
        if (zonasRes?.data && Array.isArray(zonasRes.data)) setZonas(zonasRes.data);
      } catch {
        
      }
    };
    cargarCatalogos();
  }, []);

  /*  MANEJAR CAMBIO DE FILTRO */
  const handleChange = (campo: keyof Filtros, valor: string) => {
    setFiltros((prev) => {
      const nuevo = {
        ...prev,
        [campo]: campo === "precioMin" || campo === "precioMax" ? Number(valor) : valor,
      };
      localStorage.setItem("busquedaAvanzadaFiltros", JSON.stringify(nuevo));
      return nuevo;
    });
  };

  /*  CAMBIO DE FECHA  */
  const validarFecha = (fecha: string) => /^\d{4}-\d{2}-\d{2}$/.test(fecha);

  const handleFechaChange = (tipo: "inicio" | "fin", valor: string) => {
    if (!validarFecha(valor)) {
      setError("Formato de fecha inválido (YYYY-MM-DD).");
      return;
    }
    setError(null);

    if (tipo === "inicio") {
      setFechaInicio(valor);
      setFiltros(prev => {
        const nuevo = { ...prev, fechaInicio: valor };
        localStorage.setItem("busquedaAvanzadaFiltros", JSON.stringify(nuevo));
        return nuevo;
      });
      if (fechaFin && valor > fechaFin) {
        setFechaFin("");
        setFiltros(prev => {
          const nuevo = { ...prev, fechaFin: "" };
          localStorage.setItem("busquedaAvanzadaFiltros", JSON.stringify(nuevo));
          return nuevo;
        });
      }
    } else {
      setFechaFin(valor);
      setFiltros(prev => {
        const nuevo = { ...prev, fechaFin: valor };
        localStorage.setItem("busquedaAvanzadaFiltros", JSON.stringify(nuevo));
        return nuevo;
      });
    }
  };

  /* LIMPIAR  */
  const limpiar = () => {
    setFiltros({});
    setFechaInicio("");
    setFechaFin("");
    localStorage.removeItem("busquedaAvanzadaFiltros");
    setMensaje(null);
    setError(null);
    onLimpiarFiltros?.();
  };

  /* APLICAR FILTROS */
  const aplicar = async () => {
    if (!Object.values(filtros).some((v) => v !== "" && v !== undefined)) {
      setError("Debes seleccionar al menos un filtro.");
      return;
    }

    if (
      filtros.precioMin !== undefined &&
      filtros.precioMax !== undefined &&
      filtros.precioMin > filtros.precioMax
    ) {
      setError("El valor mínimo no puede ser mayor al valor máximo.");
      return;
    }

    setError(null);
    try {
      const resultados = await buscarConInterseccion(filtros);
      onAplicarFiltros(filtros, resultados);
      setMensaje("Búsqueda realizada correctamente.");
      setTimeout(() => setMensaje(null), 3000);
    } catch (err: any) {
      setError(err?.message || "No se pudo completar la búsqueda. Verifica los filtros.");
    }
  };

  const hayFiltros = Object.values(filtros).some((v) => v !== "" && v !== undefined);

  
  return (
    <div className="w-full bg-white rounded-xl shadow p-4">
      <div className="flex justify-end items-center border-b pb-3">
        <button
          onClick={() => {
            setExpandido(!expandido);
            onToggle?.(!expandido);
          }}
          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition cursor-pointer"
        >
          <span>Búsqueda avanzada</span>
          <span className="text-sm">{expandido ? "▲" : "▼"}</span>
        </button>
      </div>

      {expandido && (
        <div className="mt-6 flex flex-wrap gap-4 justify-between">
          {/* Tipo de servicio */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Tipo de servicio</label>
            <input
              list="tiposServicioList"
              className="p-2 border rounded-lg"
              value={filtros.tipoServicio || ""}
              onChange={(e) => handleChange("tipoServicio", e.target.value)}
              placeholder="Ej: Decoración"
            />
            <datalist id="tiposServicioList">
              {tiposDeServicio.map((tipo) => (
                <option key={tipo} value={tipo} />
              ))}
            </datalist>
          </div>

          {/* Zona */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Zona</label>
            <select
              className="p-2 border rounded-lg"
              value={filtros.zona || ""}
              onChange={(e) => handleChange("zona", e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {["Norte", "Sur", "Este", "Oeste", "Centro"].map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Precio (mín – máx)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="mín"
                className="w-full p-2 border rounded-lg"
                value={filtros.precioMin || ""}
                onChange={(e) => handleChange("precioMin", e.target.value)}
              />
              <input
                type="number"
                placeholder="máx"
                className="w-full p-2 border rounded-lg"
                value={filtros.precioMax || ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const minPermitido = (filtros.precioMin ?? 0) + 2;
                  if (val < minPermitido) {
                    setFiltros(prev => {
                      const nuevo = { ...prev, precioMax: minPermitido };
                      localStorage.setItem("busquedaAvanzadaFiltros", JSON.stringify(nuevo));
                      return nuevo;
                    });
                  } else {
                    setFiltros(prev => {
                      const nuevo = { ...prev, precioMax: val };
                      localStorage.setItem("busquedaAvanzadaFiltros", JSON.stringify(nuevo));
                      return nuevo;
                    });
                  }
                }}
              />
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Disponibilidad</label>
            <select
              className="p-2 border rounded-lg"
              value={filtros.horario || ""}
              onChange={(e) => handleChange("horario", e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {horarios.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          

          {/* Experiencia */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Experiencia</label>
            <input
              className="p-2 border rounded-lg"
              list="experienciaList"
              value={filtros.experiencia || ""}
              onChange={(e) => handleChange("experiencia", e.target.value)}
              placeholder="Ej: 1 a 3 años"
            />
            <datalist id="experienciaList">
              {["0 a 1 año", "1 a 3 años", "3 a 5 años", "5 a 10 años"].map((exp) => (
                <option key={exp} value={exp} />
              ))}
            </datalist>
          </div>

          {/* Fecha Inicio */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Fecha inicio</label>
            <input
              type="date"
              className="p-2 border rounded-lg"
              value={fechaInicio}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleFechaChange("inicio", e.target.value)}
            />
          </div>

          {/* Fecha Fin */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Fecha fin</label>
            <input
              type="date"
              className="p-2 border rounded-lg"
              value={fechaFin}
              min={fechaInicio || new Date().toISOString().split("T")[0]}
              onChange={(e) => handleFechaChange("fin", e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm mt-3 w-full">{error}</p>}
          {mensaje && <p className="text-green-600 text-sm mt-3 w-full">{mensaje}</p>}

          <div className="flex justify-end gap-3 mt-6 w-full">
            <button
              onClick={aplicar}
              disabled={!hayFiltros}
              className={`px-5 py-2 rounded-lg transition ${
                hayFiltros
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Buscar
            </button>
            <button
              onClick={limpiar}
              disabled={!hayFiltros}
              className={`px-5 py-2 rounded-lg transition ${
                hayFiltros
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Limpiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusquedaAvanzada;
