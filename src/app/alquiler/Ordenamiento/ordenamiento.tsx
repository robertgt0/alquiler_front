"use client";
import "./ordenamiento.css";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";

interface Item {
  nombre: string;
  fecha: string;
  calificacion: number;
}

// Función de ordenamiento
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
      sorted.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      break;
    case "Mayor Calificación (⭐)":
      sorted.sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0));
      break;
    default:
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
  const [activeFilters, setActiveFilters] = useState({});

  const opciones = [
    "Nombre A-Z",
    "Nombre Z-A",
    "Fecha (Reciente)",
    "Mayor Calificación (⭐)",
  ];

  
  useEffect(() => {
    onSortChange?.(sort);
  }, [sort]);

 
  useEffect(() => {
    onSearchChange?.(search);
  }, [search]);

  useEffect(() => {
    if (search === "") {
      setSort(sortValue); 
    }
  }, [search]);

  const filteredItems = useMemo(() => {
    let list = items;

    if (search) {
      list = list.filter((item) =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list;
  }, [search, activeFilters, items]);

  const itemsToRender = useMemo(() => {
    return ordenarItems(sort, filteredItems);
  }, [sort, filteredItems]);

  const handleSearch = () => {
    alert(`Búsqueda terminada. Elementos encontrados: ${itemsToRender.length}`);
  };

  const showNoOrderMessage = search !== "" && filteredItems.length === 0;

  return (
    <div className="container">
      <div className="card">
        <div className="search-container">
          <div className="search-input-container">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={handleSearch} className="search-button">
            Buscar
          </button>
        </div>

        <div className="sort-section">
          <p className="sort-label">Ordenar por:</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="sort-select"
          >
            {opciones.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
