// app/vendor_ratings/page.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react"; 


// ------------------------------------
// 1. Tipos y Datos Ficticios (Mock Data)
// ------------------------------------

interface Rating {
  id: number;
  client: string;
  score: 1 | 2 | 3 | 4 | 5; // Puntuación de 1 a 5 estrellas
  comment: string;
  date: string; // String en formato ISO 8601 para fácil ordenamiento
}

const MOCK_RATINGS: Rating[] = [
  {
    id: 1,
    client: "Juan Perez",
    score: 3,
    comment:
      "El trabajo se concluyo de manera exitosa, los acabados fueron muy buenos. Lo unico malo fue que llego un poco atrasado y no solia decirme lo que estaba haciendo.",
    date: "2025-10-31T10:00:00Z",
  },
  {
    id: 2,
    client: "Diego Aliendre",
    score: 5,
    comment: "Estoy muy contento con el trabajo.",
    date: "2025-10-30T15:30:00Z",
  },
  {
  id: 10,
  client: "Maria C.",
  score: 4,
  comment: "Ligeros retrasos, pero la calidad fue buena.",
  date: "2025-10-22T12:00:00Z",
  },
  {
    id: 3,
    client: "Juan Perez",
    score: 2,
    comment: "No me gusto el trato del trabajador.",
    date: "2025-10-29T09:15:00Z",
  },
  {
    id: 4,
    client: "Sofia G.",
    score: 5,
    comment: "Servicio excelente, muy profesional.",
    date: "2025-10-28T18:00:00Z",
  },
  {
    id: 5,
    client: "Carlos R.",
    score: 1,
    comment: "El peor servicio que he recibido, no lo recomiendo.",
    date: "2025-10-27T12:45:00Z",
  },
  {
    id: 6,
    client: "Ana M.",
    score: 4,
    comment: "Buen trabajo, aunque un poco caro.",
    date: "2025-10-26T14:20:00Z",
  },
  {
    id: 7,
    client: "Ernesto L.",
    score: 5,
    comment: "Impecable, superó mis expectativas.",
    date: "2025-10-25T11:00:00Z",
  },
  {
    id: 8,
    client: "Laura Z.",
    score: 4,
    comment: "Todo bien, persona muy amable.",
    date: "2025-10-24T08:00:00Z",
  },
  {
    id: 9,
    client: "Roberto P.",
    score: 2,
    comment: "Llegó tarde y el trabajo fue incompleto.",
    date: "2025-10-23T16:00:00Z",
  },
];

type FilterType =
  | "Todos"
  | "Comentarios Positivos"
  | "Comentarios Negativos"
  | "Ordenados por fecha"
  | "Ordenados por calificacion";

// ------------------------------------
// 2. Componentes Auxiliares
// ------------------------------------

// Componente para mostrar las estrellas de calificación
const StarRating: React.FC<{ score: number }> = ({ score }) => {
  return (
    <div className="flex">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < score ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
    </div>
  );
};

// Componente para una tarjeta individual de calificación
const RatingCard: React.FC<{ rating: Rating }> = ({ rating }) => (
  <div className="py-4 border-b border-gray-200">
    <p className="text-gray-700">
      <strong className="text-blue-600">Cliente:</strong> {rating.client}
    </p>
    <div className="flex items-center mt-1">
      <strong className="text-blue-600 mr-2">Calificación:</strong>
      <StarRating score={rating.score} />
    </div>
    <p className="text-gray-700 mt-2">
      <strong className="text-blue-600">Comentario:</strong> {rating.comment}
    </p>
  </div>
);

// ------------------------------------
// 3. Componente Principal (VendorRatingsPage)
// ------------------------------------

export default function VendorRatingsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const RATINGS_PER_PAGE = 6; // Máximo de calificaciones por página
  const REVIEWS_PER_VIEW = 3; // Número de calificaciones visibles en el scroll

  const API_URL = "http://localhost:5000/api/los_vengadores/trabajos/proveedor/6902c43438df4e88b6680640/calificaciones";

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(API_URL);
        let data;
        try {
          data = await res.json();
        } catch (err) {
          console.error("No se pudo parsear JSON de la respuesta:", err);
          data = {};
        }

        if (!res.ok) {
          console.error("Error en la respuesta del servidor:", data);
          throw new Error((data && data.message) || "Error al obtener calificaciones");
        }
  
        // Si la API devuelve { success: false, message: "Ruta no encontrada" }
        if (data.success === false) {
          setError("No se encontraron calificaciones para este proveedor.");
          return;
        }
  
        // 🔹 Verificamos si el backend devuelve directamente un array o un objeto con datos
        const calificaciones = Array.isArray(data)
          ? data
          : data.calificaciones || [];
  
        setRatings(calificaciones);
      } catch (err) {
        console.error("Error al obtener calificaciones:", err);
        setError("No se pudieron cargar las calificaciones");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRatings();
  }, []);

  // Lógica de Filtrado y Ordenamiento (Memoizado para rendimiento)
  const filteredAndSortedRatings = useMemo(() => {
    let result = [...ratings];

    if (activeFilter === "Comentarios Positivos") {
      result = result.filter((r) => r.score >= 4);
    } else if (activeFilter === "Comentarios Negativos") {
      result = result.filter((r) => r.score <= 3);
    } else if (activeFilter === "Ordenados por fecha") {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (activeFilter === "Ordenados por calificacion") {
      result.sort((a, b) => a.score - b.score);
    }

    return result;
  }, [activeFilter, ratings]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedRatings.length / RATINGS_PER_PAGE);
  const startIndex = (currentPage - 1) * RATINGS_PER_PAGE;
  const paginatedRatings = filteredAndSortedRatings.slice(
    startIndex,
    startIndex + RATINGS_PER_PAGE
  );

  const handlePrevious = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  const getButtonClass = (filter: FilterType) =>
    `px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex-shrink-0 ${
      activeFilter === filter
        ? "bg-blue-600 text-white"
        : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
    }`;

  // ------------------------------------
  // Renderizado
  // ------------------------------------
  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Cargando calificaciones...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  return (
    // Contenedor principal centrado vertical y horizontalmente
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
          Calificaciones del proveedor 🛠️
        </h2>
        
        {/* Barra de Filtros y Ordenamiento: Fila única con scroll horizontal */}
        <div className="flex flex-row flex-nowrap gap-2 mb-6 overflow-x-auto p-1 -m-1 justify-start">
          <button
            className={getButtonClass("Todos")}
            onClick={() => {
              setActiveFilter("Todos");
              setCurrentPage(1);
            }}
          >
            Todos
          </button>
          <button
            className={getButtonClass("Comentarios Positivos")}
            onClick={() => {
              setActiveFilter("Comentarios Positivos");
              setCurrentPage(1);
            }}
          >
            Comentarios <br></br>Positivos
          </button>
          <button
            className={getButtonClass("Comentarios Negativos")}
            onClick={() => {
              setActiveFilter("Comentarios Negativos");
              setCurrentPage(1);
            }}
          >
            Comentarios <br></br>Negativos
          </button>
          <button
            className={getButtonClass("Ordenados por fecha")}
            onClick={() => {
              setActiveFilter("Ordenados por fecha");
              setCurrentPage(1);
            }}
          >
            Ordenados <br></br>por fecha
          </button>
          <button
            className={getButtonClass("Ordenados por calificacion")}
            onClick={() => {
              setActiveFilter("Ordenados por calificacion");
              setCurrentPage(1);
            }}
          >
            Ordenados <br></br>por calificación
          </button>
        </div>

        {/* Contenedor de Calificaciones con Scroll Vertical limitado a 3 elementos */}
        <div 
          className="max-h-[30rem] overflow-y-scroll border border-gray-300 rounded-lg p-4" 
          style={{ height: `${REVIEWS_PER_VIEW * 130}px` }} // Altura aproximada para 3 tarjetas
        >
          {paginatedRatings.length > 0 ? (
            paginatedRatings.map((rating) => (
              <RatingCard key={rating.id} rating={rating} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              No hay calificaciones para mostrar con el filtro actual.
            </p>
          )}
        </div>

        {/* Pie de página con Navegación y Paginación */}
        <div className="flex justify-between items-center mt-6">
          <Link
            href="/perfil_proveedor_provisional"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Atrás
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`py-2 px-4 rounded-lg transition-colors flex items-center ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Anterior
            </button>
            <span className="text-gray-700 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`py-2 px-4 rounded-lg transition-colors flex items-center ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}