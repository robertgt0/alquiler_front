"use client";
import "./ordenamiento.css";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";

interface Item {
  nombre: string;
  fecha: string;
  calificacion: number;
}

// Datos iniciales (como respaldo)
const INITIAL_ITEMS: Item[] = [
  { nombre: "Manzana", fecha: "2026-10-05", calificacion: 4 },
  { nombre: "Banana", fecha: "2024-10-03", calificacion: 5 },
  { nombre: "Cereza", fecha: "2024-10-06", calificacion: 3 },
  { nombre: "Azno", fecha: "2025-10-01", calificacion: 2 },
  { nombre: "Z", fecha: "2025-10-03", calificacion: 5 },
  { nombre: "Zen", fecha: "2025-10-06", calificacion: 3 },
  { nombre: "A", fecha: "2025-10-01", calificacion: 2 },
];

// Función para llamar al backend
const ordenarBorbotones = async (criterio: string): Promise<Item[]> => {
  try {
    const response = await fetch(`http://localhost:5000/api/borbotones/orden?orden=${criterio}`);
    
    if (!response.ok) {
      throw new Error('Error al ordenar borbotones');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error conectando con el backend:', error);
    // Si falla el backend, usa ordenamiento local
    return INITIAL_ITEMS;
  }
};

// Función de ordenamiento LOCAL (como respaldo)
const ordenarItems = (opcion: string, lista: Item[]): Item[] => {
  if (lista.length === 0) return [];

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

export default function Ordenamiento() {
  const defaultSort = "Fecha (Reciente)";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(defaultSort);
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cargando, setCargando] = useState(false);

  const opciones = [
    "Nombre A-Z",
    "Nombre Z-A",
    "Fecha (Reciente)",
    "Mayor Calificación (⭐)",
  ];

  // Mapeo entre opciones del frontend y criterios del backend
  const criterioMap: { [key: string]: string } = {
    "Nombre A-Z": "nombre_A-Z",
    "Nombre Z-A": "nombre_Z-A", 
    "Fecha (Reciente)": "fecha",
    "Mayor Calificación (⭐)": "calificacion"
  };

  // Cuando cambia el orden, llamar al backend
  useEffect(() => {
    const ordenarConBackend = async () => {
      setCargando(true);
      const criterioBackend = criterioMap[sort];
      
      if (criterioBackend) {
        try {
          const datosBackend = await ordenarBorbotones(criterioBackend);
          setItems(datosBackend);
        } catch (error) {
          console.error('Error usando backend, usando datos locales');
          // Mantiene los datos locales si falla el backend
        }
      }
      setCargando(false);
    };

    ordenarConBackend();
  }, [sort]);

  useEffect(() => {
    if (search === "") {
      setSort(defaultSort);
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
  }, [search, items]);

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
        {/* Buscador */}
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

        {/* Ordenamiento */}
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
          {cargando && <span className="loading-text">Conectando con backend...</span>}
        </div>

        <ul className="item-list">
          {showNoOrderMessage ? (
            <li className="error-message">
              No se puede aplicar el ordenamiento.
            </li>
          ) : (
            itemsToRender.map((item, index) => (
              <li key={`${item.nombre}-${index}`} className="item">
                <span>{item.nombre}</span> - {item.fecha} -{" "}
                <span className="item-star">⭐ {item.calificacion}</span>
              </li>
            ))
          )}

          {!showNoOrderMessage && itemsToRender.length === 0 && (
            <li className="empty-message">No hay elementos disponibles.</li>
          )}
        </ul>
      </div>
    </div>
  );
}