"use client";
import "./ordenamiento.css";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";

// Función para llamar al backend
const ordenarBorbotones = async (criterio: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/borbotones/orden?orden=${criterio}`);
    
    if (!response.ok) {
      throw new Error('Error al ordenar borbotones');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

interface Item {
  nombre: string;
  fecha: string;
  calificacion: number;
}

// Función de ordenamiento LOCAL (como respaldo)
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
  const [itemsFromBackend, setItemsFromBackend] = useState<Item[]>([]);
  const [cargando, setCargando] = useState(false);

  const opciones = [
    "Nombre A-Z",
    "Nombre Z-A",
    "Fecha (Reciente)",
    "Mayor Calificación (10)",
  ];

  // Mapeo entre opciones locales y criterios del backend
  const criterioMap: { [key: string]: string } = {
    "Nombre A-Z": "nombre_A-Z",
    "Nombre Z-A": "nombre_Z-A", 
    "Fecha (Reciente)": "fecha",
    "Mayor Calificación (10)": "calificacion"
  };

  // Función para ordenar con el backend
  const handleOrdenarBackend = async (criterioLocal: string) => {
    const criterioBackend = criterioMap[criterioLocal];
    if (!criterioBackend) return;

    setCargando(true);
    try {
      const datos = await ordenarBorbotones(criterioBackend);
      setItemsFromBackend(datos);
    } catch (error) {
      console.error('Error al ordenar con backend:', error);
      // Si falla el backend, usa ordenamiento local
      setItemsFromBackend([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    onSortChange?.(sort);
    // Cuando cambia el sort, llamar al backend
    handleOrdenarBackend(sort);
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
    let list = itemsFromBackend.length > 0 ? itemsFromBackend : items;

    if (search) {
      list = list.filter((item) =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list;
  }, [search, activeFilters, items, itemsFromBackend]);

  const itemsToRender = useMemo(() => {
    // Si tenemos datos del backend, los mostramos directamente
    if (itemsFromBackend.length > 0) {
      return filteredItems;
    }
    // Si no, usamos ordenamiento local
    return ordenarItems(sort, filteredItems);
  }, [sort, filteredItems, itemsFromBackend]);

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

        {/* Mostrar resultados */}
        <div className="results-section">
          {itemsToRender.length > 0 && (
            <div className="results-count">
              Mostrando {itemsToRender.length} elementos
            </div>
          )}
          
          <div className="items-list">
            {itemsToRender.map((item, index) => (
              <div key={index} className="item-card">
                <h3 className="item-name">{item.nombre}</h3>
                <p className="item-date">Fecha: {item.fecha}</p>
                <p className="item-rating">Calificación: {item.calificacion} 10</p>
              </div>
            ))}
          </div>

          {showNoOrderMessage && (
            <p className="no-results">No se encontraron resultados</p>
          )}
        </div>
      </div>
    </div>
  );
}