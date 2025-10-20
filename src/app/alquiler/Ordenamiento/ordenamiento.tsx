"use client";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";

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
    case "Mayor Calificación (⭐⭐)":
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
  paginatedItems?: Item[]; // 🔹 opcional si se usa paginación externa
}

export default function Ordenamiento({
  items = [],
  sortValue = "Fecha (Reciente)",
  searchValue = "",
  onSortChange,
  onSearchChange,
  paginatedItems,
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

  // 🔹 Ordenamiento en backend
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

  // 🔹 Llama al ordenamiento cada vez que cambia el criterio
  useEffect(() => {
    onSortChange?.(sort);
    handleOrdenarBackend(sort);
  }, [sort]);

  // 🔹 Llama al cambio de búsqueda
  useEffect(() => {
    onSearchChange?.(search);
  }, [search]);

  // 🔹 Reset del ordenamiento al limpiar búsqueda
  useEffect(() => {
    if (search.trim() === "") {
      setSort("Nombre A-Z");
    }
  }, [search]);

  // 🔹 Filtrado
  const filteredItems = useMemo(() => {
    let list = itemsFromBackend.length > 0 ? itemsFromBackend : items;
    if (search) {
      list = list.filter((item) => item.nombre.toLowerCase().includes(search.toLowerCase()));
    }
    return list;
  }, [search, items, itemsFromBackend]);

  // 🔹 Aplicar orden local si no hay backend o paginación externa
  const orderedItems = useMemo(() => {
    const baseList = paginatedItems || filteredItems;
    return itemsFromBackend.length > 0 ? baseList : ordenarItems(sort, baseList);
  }, [sort, filteredItems, itemsFromBackend, paginatedItems]);

  // 🔹 Mensaje si no hay resultados
  const showNoOrderMessage = search !== "" && filteredItems.length === 0;

  return (
    <div className="container max-w-full p-4 sm:p-6 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Título clickeable */}
        <p
          className="text-blue-500 font-semibold cursor-pointer hover:text-blue-600 transition"
          onClick={() => setMostrarOrden(!mostrarOrden)}
        >
          Ordenar
        </p>

        {/* 🔹 Campo de búsqueda (opcional) */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar trabajo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* 🔹 Selector de ordenamiento */}
      {mostrarOrden && (
        <div className="mt-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
            disabled={cargando}
          >
            {opciones.map((opcion) => (
              <option key={opcion} value={opcion} className="text-blue-600">
                {opcion}
              </option>
            ))}
          </select>
          {cargando && <span className="ml-2 text-gray-500 text-sm">Cargando...</span>}
        </div>
      )}

      {/* 🔹 Mostrar resultados */}
      <div className="mt-4">
        {orderedItems.length > 0 && (
          <div className="text-sm text-gray-500 mb-2">
            Mostrando {orderedItems.length} elementos
          </div>
        )}

        <div className="space-y-2">
          {orderedItems.map((item, index) => (
            <div
              key={index}
              className="border p-3 rounded-xl hover:bg-gray-50 transition text-sm sm:text-base"
            >
              <h3 className="font-semibold text-blue-600">{item.nombre}</h3>
              <p className="text-blue-600">Fecha: {item.fecha}</p>
              <p className="text-blue-600">Calificación: {item.calificacion} ⭐</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
