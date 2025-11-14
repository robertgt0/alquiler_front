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
  fecha?: string;
}

/** Resultado mínimo necesario para intersecar por id */
export type ResultItem = {
  id: string | number;
} & Record<string, unknown>;

/** Respuestas posibles de catálogos (ajústalas si tu back usa otras llaves) */
type ServiciosCatalogo =
  | { servicios_encontrados: Array<{ nombre: string }> }
  | string[]
  | { data: string[] };

type ZonasCatalogo = { zonas: string[] } | string[] | { data: string[] };
type HorariosCatalogo =
  | { turnos: string[] }
  | { horarios: string[] }
  | string[]
  | { data: string[] };

const API_BASE = "http://localhost:5000/api/borbotones/search/avanzada";
const API_SERVICIOS = `${API_BASE}/servicios`;
const API_DISPONIBILIDAD = `${API_BASE}/disponibilidad`;
const API_ZONA = `${API_BASE}/zona`;
const API_EXPERIENCIA = `${API_BASE}/experiencia`;
const API_PRECIO = `${API_BASE}/precio`;
const API_FECHA = `${API_BASE}/fecha`;

/* ---------------------- helpers de tipado ---------------------- */
function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((v) => typeof v === "string");
}
function isServiciosCatalogo(x: unknown): x is ServiciosCatalogo {
  if (typeof x === "object" && x !== null) {
    const o = x as Record<string, unknown>;
    if (Array.isArray(o["servicios_encontrados"])) return true;
    if (Array.isArray(o["data"]) && isStringArray(o["data"])) return true;
  }
  return isStringArray(x);
}
function isZonasCatalogo(x: unknown): x is ZonasCatalogo {
  if (typeof x === "object" && x !== null) {
    const o = x as Record<string, unknown>;
    if (Array.isArray(o["zonas"])) return true;
    if (Array.isArray(o["data"]) && isStringArray(o["data"])) return true;
  }
  return isStringArray(x);
}
function isHorariosCatalogo(x: unknown): x is HorariosCatalogo {
  if (typeof x === "object" && x !== null) {
    const o = x as Record<string, unknown>;
    if (Array.isArray(o["turnos"])) return true;
    if (Array.isArray(o["horarios"])) return true;
    if (Array.isArray(o["data"]) && isStringArray(o["data"])) return true;
  }
  return isStringArray(x);
}

/** Normaliza un posible arreglo de objetos desconocidos a ResultItem[] usando heurística de id */
function normalizeToItems(arr: unknown): ResultItem[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((raw) => {
      if (raw && typeof raw === "object") {
        const o = raw as Record<string, unknown>;
        const id =
          (o["id"] as string | number | undefined) ??
          (o["id_servicio"] as string | number | undefined) ??
          (o["_id"] as string | number | undefined);
        if (id !== undefined && (typeof id === "string" || typeof id === "number")) {
          return { id, ...o };
        }
      }
      return null;
    })
    .filter((x): x is ResultItem => x !== null);
}

/* ---------------------- helpers de filtros ---------------------- */
function parseExp(
  exp?: string
): { años?: number; años_min?: number; años_max?: number } {
  if (!exp) return {};
  const r = exp.match(/(\d+)\s*a\s*(\d+)/i);
  if (r) {
    const a = parseInt(r[1], 10);
    const b = parseInt(r[2], 10);
    return { años_min: Math.min(a, b), años_max: Math.max(a, b) };
  }
  const p = exp.match(/(\d+)\s*\+/);
  if (p) return { años_min: parseInt(p[1], 10) };
  const u = exp.match(/(\d+)/);
  if (u) return { años: parseInt(u[1], 10) };
  return {};
}

function buildCommonParams(f: Filtros): Record<string, string | number> {
  const qp: Record<string, string | number> = {};
  if (f.tipoServicio) qp.servicio = f.tipoServicio;
  if (f.zona) qp.zona = f.zona;
  if (typeof f.precioMin === "number" && !Number.isNaN(f.precioMin))
    qp.precio_min = f.precioMin;
  if (typeof f.precioMax === "number" && !Number.isNaN(f.precioMax))
    qp.precio_max = f.precioMax;
  if (f.horario) qp.turno = f.horario;
  if (f.fecha) qp.fecha_exacta = f.fecha;

  const exp = parseExp(f.experiencia);
  if (exp.años !== undefined) {
    qp["años"] = exp.años;
    qp["anios"] = exp.años;
  }
  if (exp.años_min !== undefined) {
    qp["años_min"] = exp.años_min;
    qp["anios_min"] = exp.años_min;
  }
  if (exp.años_max !== undefined) {
    qp["años_max"] = exp.años_max;
    qp["anios_max"] = exp.años_max;
  }
  return qp;
}

/* ---------------------- llamadas al backend (sin any) ---------------------- */
async function getServicios(params?: Record<string, string | number>): Promise<unknown> {
  const { data } = await axios.get<unknown>(API_SERVICIOS, { params });
  return data;
}
async function getDisponibilidad(params?: Record<string, string | number>): Promise<unknown> {
  const { data } = await axios.get<unknown>(API_DISPONIBILIDAD, { params });
  return data;
}
async function getZona(params?: Record<string, string | number>): Promise<unknown> {
  const { data } = await axios.get<unknown>(API_ZONA, { params });
  return data;
}
async function getExperiencia(params?: Record<string, string | number>): Promise<unknown> {
  const { data } = await axios.get<unknown>(API_EXPERIENCIA, { params });
  return data;
}
async function getPrecio(params?: Record<string, string | number>): Promise<unknown> {
  const { data } = await axios.get<unknown>(API_PRECIO, { params });
  return data;
}
async function getFecha(params?: Record<string, string | number>): Promise<unknown> {
  const { data } = await axios.get<unknown>(API_FECHA, { params });
  return data;
}

/** Intersección por id */
function intersectById(lists: ResultItem[][]): ResultItem[] {
  if (lists.length === 0) return [];
  if (lists.length === 1) return lists[0];

  const idSets = lists.map((arr) => new Set(arr.map((x) => String(x.id))));
  const commonIds = [...idSets[0]].filter((id) => idSets.every((s) => s.has(id)));

  const index = new Map<string, ResultItem>();
  for (const arr of lists) for (const it of arr) {
    const k = String(it.id);
    if (!index.has(k)) index.set(k, it);
  }
  return commonIds.map((id) => index.get(id)!).filter(Boolean);
}

/** Lógica de búsqueda combinada */
async function buscarConInterseccion(f: Filtros): Promise<ResultItem[]> {
  const common = buildCommonParams(f);
  const requests: Array<Promise<unknown>> = [];

  if (f.tipoServicio) requests.push(getServicios({ ...common, servicio: f.tipoServicio }));
  if (f.horario) requests.push(getDisponibilidad({ ...common, turno: f.horario }));
  if (f.zona) requests.push(getZona({ ...common, zona: f.zona }));
  if (f.experiencia) {
    const exp = parseExp(f.experiencia);
    const expParams: Record<string, string | number> = {};
    if (exp.años !== undefined) { expParams["años"] = exp.años; expParams["anios"] = exp.años; }
    if (exp.años_min !== undefined) { expParams["años_min"] = exp.años_min; expParams["anios_min"] = exp.años_min; }
    if (exp.años_max !== undefined) { expParams["años_max"] = exp.años_max; expParams["anios_max"] = exp.años_max; }
    requests.push(getExperiencia({ ...common, ...expParams }));
  }
  if (f.precioMin !== undefined || f.precioMax !== undefined) {
    const p: Record<string, string | number> = { ...common };
    if (typeof f.precioMin === "number") p.precio_min = f.precioMin;
    if (typeof f.precioMax === "number") p.precio_max = f.precioMax;
    requests.push(getPrecio(p));
  }
  if (f.fecha) requests.push(getFecha({ ...common, fecha_exacta: f.fecha }));

  if (requests.length === 0) requests.push(getServicios(common));

  const responses = await Promise.all(requests);

  const lists: ResultItem[][] = responses.map((resp) => {
    // 1) si ya es arreglo
    if (Array.isArray(resp)) return normalizeToItems(resp);
    // 2) si viene como { data: [...] }
    if (resp && typeof resp === "object" && Array.isArray((resp as { data?: unknown }).data)) {
      return normalizeToItems((resp as { data: unknown }).data);
    }
    // 3) buscar primer arreglo dentro del objeto
    if (resp && typeof resp === "object") {
      const obj = resp as Record<string, unknown>;
      const arrKey = Object.keys(obj).find((k) => Array.isArray(obj[k]));
      if (arrKey) return normalizeToItems(obj[arrKey]);
    }
    return [];
  });

  return intersectById(lists);
}

/* ========================== Componente ========================== */
const BusquedaAvanzada: React.FC<BusquedaAvanzadaProps> = ({
  onAplicarFiltros,
  onLimpiarFiltros,
}) => {
  const [filtros, setFiltros] = useState<Filtros>({});
  const [tiposDeServicio, setTiposDeServicio] = useState<string[]>([]);
  const [zonas, setZonas] = useState<string[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [expandido, setExpandido] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargar filtros guardados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("filtrosBusqueda");
      if (saved) setFiltros(JSON.parse(saved));
    }
  }, []);

  // Guardar filtros
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("filtrosBusqueda", JSON.stringify(filtros));
    }
  }, [filtros]);

  // Catálogos con tipado estricto (sin any)
  useEffect(() => {
    const fetchCatalogos = async () => {
      const [servRes, zonRes, horRes] = await Promise.allSettled([
        axios.get<unknown>(API_SERVICIOS),
        axios.get<unknown>(API_ZONA),
        axios.get<unknown>(API_DISPONIBILIDAD),
      ]);

      // Servicios
      if (servRes.status === "fulfilled") {
        const d = servRes.value.data;
        if (isServiciosCatalogo(d)) {
          if (Array.isArray((d as { servicios_encontrados?: unknown }).servicios_encontrados)) {
            const arr = (d as { servicios_encontrados: Array<{ nombre: string }> })
              .servicios_encontrados;
            setTiposDeServicio(arr.map((x) => x.nombre));
          } else if (isStringArray(d)) {
            setTiposDeServicio(d);
          } else if (Array.isArray((d as { data?: unknown }).data) && isStringArray((d as { data: unknown }).data as string[])) {
            setTiposDeServicio((d as { data: string[] }).data);
          } else {
            setTiposDeServicio([]);
          }
        } else {
          setTiposDeServicio([]);
        }
      } else {
        setTiposDeServicio([]);
      }

      // Zonas
      if (zonRes.status === "fulfilled") {
        const d = zonRes.value.data;
        if (isZonasCatalogo(d)) {
          if (Array.isArray((d as { zonas?: unknown }).zonas)) {
            setZonas((d as { zonas: string[] }).zonas);
          } else if (isStringArray(d)) {
            setZonas(d);
          } else if (Array.isArray((d as { data?: unknown }).data) && isStringArray((d as { data: unknown }).data as string[])) {
            setZonas((d as { data: string[] }).data);
          } else {
            setZonas([]);
          }
        } else {
          setZonas([]);
        }
      } else {
        setZonas([]);
      }

      // Horarios
      if (horRes.status === "fulfilled") {
        const d = horRes.value.data;
        if (isHorariosCatalogo(d)) {
          if (Array.isArray((d as { turnos?: unknown }).turnos)) {
            setHorarios((d as { turnos: string[] }).turnos);
          } else if (Array.isArray((d as { horarios?: unknown }).horarios)) {
            setHorarios((d as { horarios: string[] }).horarios);
          } else if (isStringArray(d)) {
            setHorarios(d);
          } else if (Array.isArray((d as { data?: unknown }).data) && isStringArray((d as { data: unknown }).data as string[])) {
            setHorarios((d as { data: string[] }).data);
          } else {
            setHorarios([]);
          }
        } else {
          setHorarios([]);
        }
      } else {
        setHorarios([]);
      }
    };

    fetchCatalogos();
  }, []);

  const handleChange = (campo: keyof Filtros, valor: string) => {
    if ((campo === "precioMin" || campo === "precioMax") && valor && !/^\d*$/.test(valor)) return;
    if (campo === "fecha" && valor) {
      const hoy = new Date().toISOString().split("T")[0];
      if (valor < hoy) {
        setError("No puedes seleccionar fechas anteriores al día actual.");
        return;
      }
      setError(null);
    }
    setFiltros((prev) => ({
      ...prev,
      [campo]: campo === "precioMin" || campo === "precioMax" ? Number(valor) : valor,
    }));
  };

  const limpiar = () => {
    setFiltros({});
    if (typeof window !== "undefined") localStorage.removeItem("filtrosBusqueda");
    setMensaje(null);
    setError(null);
    onLimpiarFiltros?.();
  };

  const aplicar = async () => {
    if (filtros.precioMin && filtros.precioMax && filtros.precioMin > filtros.precioMax) {
      setError("El valor mínimo no puede ser mayor al valor máximo.");
      return;
    }
    setError(null);
    try {
      const resultados = await buscarConInterseccion(filtros);
      onAplicarFiltros(filtros, resultados);
      setMensaje("Filtros aplicados correctamente.");
      setTimeout(() => setMensaje(null), 3000);
    } catch {
      setError("No se pudo realizar la búsqueda avanzada.");
    }
  };

  const hayFiltrosActivos = Object.values(filtros).some(
    (v) => v !== "" && v !== undefined
  );

  return (
    <div className="w-full bg-white rounded-xl shadow p-4">
      <div className="flex justify-end items-center border-b pb-3">
        <button
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition cursor-pointer"
        >
          <span>Búsqueda avanzada</span>
          <span className="text-sm">{expandido ? "▲" : "▼"}</span>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expandido ? "max-h-[1200px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="flex flex-wrap gap-4 justify-between">
          {/* Tipo de servicio */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Tipo de servicio</label>
            <select
              className={`p-2 border rounded-lg ${filtros.tipoServicio ? "border-blue-500" : ""}`}
              value={filtros.tipoServicio || ""}
              onChange={(e) => handleChange("tipoServicio", e.target.value)}
            >
              <option value="">Selecciona...</option>
              {tiposDeServicio.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Zona */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Zona</label>
            <select
              className={`p-2 border rounded-lg ${filtros.zona ? "border-blue-500" : ""}`}
              value={filtros.zona || ""}
              onChange={(e) => handleChange("zona", e.target.value)}
            >
              <option value="">Selecciona...</option>
              {zonas.map((z) => (
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
                type="text"
                placeholder="mín"
                className={`w-full p-2 border rounded-lg ${filtros.precioMin ? "border-blue-500" : ""}`}
                value={filtros.precioMin || ""}
                onChange={(e) => handleChange("precioMin", e.target.value)}
              />
              <input
                type="text"
                placeholder="máx"
                className={`w-full p-2 border rounded-lg ${filtros.precioMax ? "border-blue-500" : ""}`}
                value={filtros.precioMax || ""}
                onChange={(e) => handleChange("precioMax", e.target.value)}
              />
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Disponibilidad</label>
            <select
              className={`p-2 border rounded-lg ${filtros.horario ? "border-blue-500" : ""}`}
              value={filtros.horario || ""}
              onChange={(e) => handleChange("horario", e.target.value)}
            >
              <option value="">Selecciona...</option>
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
            <select
              className={`p-2 border rounded-lg ${filtros.experiencia ? "border-blue-500" : ""}`}
              value={filtros.experiencia || ""}
              onChange={(e) => handleChange("experiencia", e.target.value)}
            >
              <option value="">Selecciona...</option>
              {["0 a 1 año", "1 a 3 años", "3 a 5 años", "5 a 10 años"].map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              className={`p-2 border rounded-lg ${filtros.fecha ? "border-blue-500" : ""}`}
              value={filtros.fecha || ""}
              onChange={(e) => handleChange("fecha", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        {mensaje && <p className="text-green-600 text-sm mt-3">{mensaje}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={aplicar}
            disabled={!hayFiltrosActivos}
            className={`px-5 py-2 rounded-lg transition text-white ${
              hayFiltrosActivos ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Aplicar
          </button>
          <button
            onClick={limpiar}
            disabled={!hayFiltrosActivos}
            className={`px-5 py-2 rounded-lg transition ${
              hayFiltrosActivos
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusquedaAvanzada;
