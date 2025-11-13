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
    .map((raw, index) => {
      if (raw && typeof raw === "object") {
        const o = raw as Record<string, any>;
        const id = o["id"] ?? o["id_servicio"] ?? o["_id"] ?? index;

        let zonaNombre = "";
        // primero buscamos zona en proveedor/usuario
        if (o.zona) {
          zonaNombre = typeof o.zona === "string" ? o.zona : o.zona.nombre ?? "";
        } 
        // si no existe, buscar en el servicio (por si viene de servicios)
        else if (o.servicios && o.servicios.length > 0 && o.servicios[0].zona) {
          const z = o.servicios[0].zona;
          zonaNombre = typeof z === "string" ? z : z.nombre ?? "";
        }

        return { ...o, id, zona: zonaNombre } as ResultItem;
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
    console.log("🌐 Solicitando datos desde:", url);
  const { data } = await axios.get(url);
  console.log("📦 Respuesta recibida desde", endpoint, ":", data);
  return data;
}

/* NORMALIZAR TEXTO PARA BUSQUEDAS SIN QUE AFECTEN TILDES Y MAYÚSCULAS */
function normalizeText(str: string) {
  return str
    .trim() 
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
/* BÚSQUEDA CON COINCIDENCIA */
async function buscarConInterseccion(f: Filtros): Promise<ResultItem[]> {
  const requests: Array<Promise<unknown>> = [];
  console.log("🧩 Filtros aplicados:", f);

  // Solo enviar tipoServicio si tiene contenido
  if (f.tipoServicio?.trim()) {
    const servicioNormalizado = normalizeText(f.tipoServicio);
    console.log("🔍 Filtro tipoServicio:", servicioNormalizado);
    requests.push(getDatos(API_SERVICIOS, { servicio: servicioNormalizado }));
  }

  if (f.horario) {
    console.log("🕒 Filtro horario:", f.horario);
    requests.push(getDatos(API_DISPONIBILIDAD, { turno: f.horario }));
  }

  if (f.zona && f.zona.trim()) {
    const zonaCapitalizada = capitalize(f.zona.trim());
    console.log("📍 Filtro zona:", zonaCapitalizada);
    requests.push(getDatos(API_ZONA, { zona: zonaCapitalizada }));
  }

  if (f.experiencia) {
    const match = f.experiencia.match(/(\d+)\s*a\s*(\d+)/);
    if (match) {
      const años_min = Number(match[1]);
      const años_max = Number(match[2]);
      console.log("💼 Filtro experiencia:", { años_min, años_max });
      requests.push(getDatos(API_EXPERIENCIA, { años_min, años_max }));
    }
  }

  if (f.precioMin !== undefined || f.precioMax !== undefined) {
    const precioParams: Record<string, number> = {};
    if (f.precioMin !== undefined) precioParams.precio_min = f.precioMin;
    if (f.precioMax !== undefined) precioParams.precio_max = f.precioMax;
    console.log("💰 Filtro precios:", precioParams);
    requests.push(getDatos(API_PRECIO, precioParams));
  }

  if (f.fechaInicio){
     requests.push(getDatos(API_FECHA, { fecha_exacta: f.fechaInicio }));
    console.log("📅 Filtro fecha:", f.fechaInicio);
  }
  // Si no hay filtros, devolvemos todos los servicios
  if (requests.length === 0) {
    console.log("⚠️ Sin filtros: recuperando todos los servicios...");
    const serviciosRes = await getDatos(API_SERVICIOS);
    return normalizeToItems(serviciosRes?.data || serviciosRes || []);
  }

  const responses = await Promise.all(requests);

  console.log("📊 Respuestas combinadas:", responses);
 const listas: ResultItem[][] = responses.map((r) => {
  if (r && typeof r === "object") {
    const obj = r as any;
    let items: unknown[] = [];
    if (Array.isArray(obj.servicios_encontrados)) {
      items = obj.servicios_encontrados;
    } else if (Array.isArray(obj.data)) {
      items = obj.data;
    }
    return normalizeToItems(items);
  }
  return [];
});

  let resultadoFinal = intersectById(listas);

  // 🔍 AJUSTE: búsqueda parcial por nombre del servicio (insensible a mayúsculas y tildes)
  if (f.tipoServicio?.trim()) {
  const busqueda = normalizeText(f.tipoServicio);

  resultadoFinal = resultadoFinal.filter((item) => {
    // Si existe array de servicios, buscar ahí
    if (Array.isArray(item.servicios) && item.servicios.length > 0) {
      return item.servicios.some((s: any) =>
        normalizeText(s.nombre || "").includes(busqueda)
      );
    }

    // Si no existe, buscar en nombre general o nombre del servicio en backend
    const nombreServicio = item.nombre || item.servicio || "";
    return normalizeText(String(nombreServicio)).includes(busqueda);
  });
  console.log("🔹 Antes del filtro final, items:", resultadoFinal.map(i => i.nombre));

}


  return resultadoFinal;
}


/* =================== COMPONENTE =================== */
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
  const [fecha, setFecha] = useState<string>(filtros.fechaInicio || "");

  useEffect(() => {
    const filtrosGuardados = localStorage.getItem("busquedaAvanzadaFiltros");
    if (filtrosGuardados) {
      const parsed = JSON.parse(filtrosGuardados);
      setFiltros(parsed);
      setFecha(parsed.fechaInicio || "");
    }
  }, []);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [serviciosRes, zonasRes] = await Promise.all([
          getDatos(API_SERVICIOS),
          getDatos(API_ZONA),
        ]);
        if (serviciosRes?.data && Array.isArray(serviciosRes.data))
          setTiposDeServicio(serviciosRes.data.map((s: any) => s.nombre || s));
        if (zonasRes?.data && Array.isArray(zonasRes.data)) setZonas(zonasRes.data);
      } catch {}
    };
    cargarCatalogos();
  }, []);

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

  const handleFechaChange = (valor: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      setError("Formato de fecha inválido (YYYY-MM-DD).");
      return;
    }
    setError(null);
    setFecha(valor);
    const nuevoFiltro = { ...filtros, fechaInicio: valor };
    setFiltros(nuevoFiltro);
    localStorage.setItem("busquedaAvanzadaFiltros", JSON.stringify(nuevoFiltro));
  };

  const limpiar = () => {
    setFiltros({});
    setFecha("");
    localStorage.removeItem("busquedaAvanzadaFiltros");
    setMensaje(null);
    setError(null);
    onLimpiarFiltros?.();
  };

  const aplicar = async () => {
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
       // Llamamos a la función que hace las consultas
    const respuestas = await buscarConInterseccion(filtros);

    // Normalizamos los resultados para asegurarnos que zona sea string
    const resultados: ResultItem[] = normalizeToItems(respuestas);

    // Mostramos la zona en consola para verificar
    console.log("Zonas encontradas:", resultados.map(r => r.zona));

      // Actualizamos tipoServicio con el nombre real desde el primer resultado si existe
      onAplicarFiltros(filtros, resultados);


      setMensaje("Búsqueda realizada correctamente.");
      setTimeout(() => setMensaje(null), 3000);
    } catch (err: any) {
      setError(err?.message || "No se pudo completar la búsqueda. Verifica los filtros.");
    }
  };

  const hayFiltros =
    Object.values(filtros).some((v) => v !== "" && v !== undefined) || fecha !== "";

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
                  setFiltros((prev) => {
                    const nuevo = { ...prev, precioMax: val < minPermitido ? minPermitido : val };
                    localStorage.setItem("busquedaAvanzadaFiltros", JSON.stringify(nuevo));
                    return nuevo;
                  });
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

          {/* Fecha exacta */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              className="p-2 border rounded-lg"
              value={fecha}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleFechaChange(e.target.value)}
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
