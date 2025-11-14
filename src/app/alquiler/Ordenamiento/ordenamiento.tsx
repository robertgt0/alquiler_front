"use client";
//import "./ordenamiento.css";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";

// =============================
// 🔵 FUNCIÓN DE FECHA SEGURA
// =============================
function parseFechaSegura(fecha: string) {
  if (!fecha) return 0;

  let f = fecha.replace(/\//g, "-");

  // Caso: dd-mm-yyyy → yyyy-mm-dd
  if (/^\d{2}-\d{2}-\d{4}$/.test(f)) {
    const [dd, mm, yyyy] = f.split("-");
    f = `${yyyy}-${mm}-${dd}`;
  }

  const time = Date.parse(f);
  return isNaN(time) ? 0 : time;
}

// Función para llamar al backend
const ordenarBorbotones = async (criterio: string) => {
  try {
    const response = await fetch(`https://alquiler-back.vercel.app/api/borbotones/orden?orden=${criterio}`);
    if (!response.ok) throw new Error("Error al ordenar borbotones");

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

interface Item {
  nombre: string;
  fecha: string;
  calificacion: number;
}

// =============================
// 🔵 ORDENAMIENTO LOCAL (BACKUP)
// =============================
const ordenarItems = (opcion: string, lista: Item[]): Item[] => {
  if (!lista || lista.length === 0) return [];
  const sorted = [...lista];

  switch (opcion) {
    case "Nombre A-Z":
      sorted.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
      break;

    case "Nombre Z-A":
      sorted.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || ""));
      break;

    case "Fecha (Reciente)":
      sorted.sort((a, b) => parseFechaSegura(b.fecha) - parseFechaSegura(a.fecha));
      break;

    case "Mayor Calificación (⭐)":
      sorted.sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0));
      break;
  }

  return sorted;
};

interface OrdenamientoProps {
  items?: Item[];
  sortValue?: string;
  searchValue?: string;
  onSortChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
}

export default function Ordenamiento({
  items = [],
  sortValue = "Fecha (Reciente)",
  searchValue = "",
  onSortChange,
  onSearchChange,
}: OrdenamientoProps) {
  const [search, setSearch] = useState(searchValue);
  const [sort, setSort] = useState(sortValue);
  const [itemsFromBackend, setItemsFromBackend] = useState<Item[]>([]);
  const [cargando, setCargando] = useState(false);

  const [mostrarOrden, setMostrarOrden] = useState(false);

  const opciones = ["Nombre A-Z", "Nombre Z-A", "Fecha (Reciente)", "Mayor Calificación (⭐)"];

  const criterioMap: { [key: string]: string } = {
    "Nombre A-Z": "nombre_A-Z",
    "Nombre Z-A": "nombre_Z-A",
    "Fecha (Reciente)": "fecha",
    "Mayor Calificación (⭐)": "calificacion",
  };

  const handleOrdenarBackend = async (criterioLocal: string) => {
    console.log("🚀 handleOrdenarBackend llamado con:", criterioLocal);
    const criterioBackend = criterioMap[criterioLocal];
    console.log("🔹 Criterio backend:", criterioBackend);
    if (!criterioBackend) return;

    setCargando(true);
    try {
      const datos = await ordenarBorbotones(criterioBackend);
      console.log("🔥 BACKEND DEVUELVE:", datos); // <-- LOG MODIFICADO
      setItemsFromBackend(datos);
    } catch (error) {
      console.log("🚨 ERROR BACKEND:", error); // <-- LOG MODIFICADO
      setItemsFromBackend([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    onSortChange?.(sort);
    handleOrdenarBackend(sort);
  }, [sort]);

  useEffect(() => {
    onSearchChange?.(search);
  }, [search]);

  const filteredItems = useMemo(() => {
    let list = itemsFromBackend.length > 0 ? itemsFromBackend : items;
    if (search) list = list.filter((item) => item.nombre.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [search, items, itemsFromBackend]);

  const itemsToRender = useMemo(() => {
    return ordenarItems(sort, filteredItems);
  }, [sort, filteredItems]);

  const showNoOrderMessage = search !== "" && filteredItems.length === 0;

  return (
    <div className="container">
      <div className="card">
        <p
          className="sort-label text-blue-500 font-semibold cursor-pointer hover:text-blue-600 transition"
          onClick={() => setMostrarOrden(!mostrarOrden)}
        >
          Ordenar
        </p>

        {mostrarOrden && (
          <div className="sort-section mt-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="sort-select"
              disabled={cargando}
            >
              {opciones.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
            {cargando && <span className="loading-text">Cargando...</span>}
          </div>
        )}

        <div className="results-section mt-4">
          {itemsToRender.length > 0 && (
            <div className="results-count mb-2">Mostrando {itemsToRender.length} elementos</div>
          )}

          <div className="items-list space-y-2">
            {itemsToRender.map((item, index) => (
              <div key={index} className="item-card border p-2 rounded-md hover:bg-gray-50 transition">
                <h3 className="item-name font-semibold">{item.nombre}</h3>
                <p className="item-date text-sm text-gray-600">Fecha: {item.fecha}</p>
                <p className="item-rating text-sm text-gray-600">
                  Calificación: {item.calificacion} ⭐
                </p>
              </div>
            ))}
          </div>

          {showNoOrderMessage && <p className="no-results mt-2 text-red-500">No se encontraron resultados</p>}
        </div>
      </div>
    </div>
  );
}
