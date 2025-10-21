'use client';
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import "../Ordenamiento/ordenamiento.css"

// Función para llamar al backend
const ordenarBorbotones = async (criterio: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/borbotones/orden?orden=${criterio}`);
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

// Ordenamiento local como respaldo
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
      sorted.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
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

  // Nuevo estado para mostrar/ocultar select de ordenamiento
  const [mostrarOrden, setMostrarOrden] = useState(false);

  const opciones = ["Nombre A-Z", "Nombre Z-A", "Fecha (Reciente)", "Mayor Calificación (⭐)"];
  const criterioMap: { [key: string]: string } = {
    "Nombre A-Z": "nombre_A-Z",
    "Nombre Z-A": "nombre_Z-A",
    "Fecha (Reciente)": "fecha",
    "Mayor Calificación (⭐)": "calificacion",
  };

  const handleOrdenarBackend = async (criterioLocal: string) => {
    const criterioBackend = criterioMap[criterioLocal];
    if (!criterioBackend) return;

    setCargando(true);
    try {
      const datos = await ordenarBorbotones(criterioBackend);
      setItemsFromBackend(datos);
    } catch {
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
    return itemsFromBackend.length > 0 ? filteredItems : ordenarItems(sort, filteredItems);
  }, [sort, filteredItems, itemsFromBackend]);

  const showNoOrderMessage = search !== "" && filteredItems.length === 0;

  return (
    <div className="container">
      <div className="card">
        {/* Título clickeable */}
        <p
          className="sort-label text-blue-500 font-semibold cursor-pointer hover:text-blue-600 transition"
          onClick={() => setMostrarOrden(!mostrarOrden)}
        >
          Ordenar
        </p>

        {/* Select de ordenamiento solo se muestra si mostrarOrden = true */}
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

        {/* Mostrar resultados */}
        <div className="results-section mt-4">
          {itemsToRender.length > 0 && (
            <div className="results-count mb-2">Mostrando {itemsToRender.length} elementos</div>
          )}
          <div className="items-list space-y-2">
            a
            {itemsToRender.map((item, index) => (
              <div key={index} className="item-card border p-2 rounded-md hover:bg-gray-50 transition">
                <h3 className="item-name font-semibold">{item.nombre}</h3>
                <p className="item-date text-sm text-gray-600">Fecha: {item.fecha}</p>
                <p className="item-rating text-sm text-gray-600">Calificación: {item.calificacion} ⭐</p>
              </div>
            ))}
          </div>

          {showNoOrderMessage && <p className="no-results mt-2 text-red-500">No se encontraron resultados</p>}
        </div>
      </div>
    </div>
  );
}