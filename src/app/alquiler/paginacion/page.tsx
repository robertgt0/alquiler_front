'use client';

import JobCard from "./components/jobCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";
import Ordenamiento from "../Ordenamiento/ordenamiento";
import { useMemo, useState } from "react";

export default function BusquedaPage() {
  const allJobs = getJobs();
  const itemsPerPage = 10;

  const [sortBy, setSortBy] = useState("Fecha (Reciente)");
  const [search, setSearch] = useState("");

  // Función de ordenamiento
  const ordenarItems = (opcion: string, lista: any[]) => {
    const sorted = [...lista];
    switch (opcion) {
      case "Nombre A-Z":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Nombre Z-A":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "Fecha (Reciente)":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "Mayor Calificación (⭐)":
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }
    return sorted;
  };

  //   orden
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = allJobs;
    if (search.trim() !== "") {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    return ordenarItems(sortBy, filtered);
  }, [allJobs, sortBy, search]);


  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems
  } = usePagination(filteredAndSortedJobs, itemsPerPage);

  const handleViewDetails = (job: any) => {
    console.log("Ver detalles de:", job);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-3 tracking-tight">
          Ofertas de Trabajo Disponibles
        </h1>

        {/*Ordenamiento y búsqueda */}
        <Ordenamiento
          sortValue={sortBy}
          searchValue={search}
          onSortChange={setSortBy}
          onSearchChange={setSearch}
        />

        {/* Info */}
        <div className="text-lg text-blue-600 font-medium mt-2">
          Mostrando {currentItems.length} de {totalItems} Ofertas Disponibles
        </div>

        {/* Mensaje si no hay resultados */}
        {filteredAndSortedJobs.length === 0 && (
          <p className="text-red-500 mt-4">No se puede aplicar el ordenamiento.</p>
        )}

        {/* Lista */}
        <div className="space-y-6 mt-6">
          {currentItems.map((job, index) => (
            <JobCard
              key={`${job.title}-${job.company}-${index}`}
              {...job}
              onViewDetails={() => handleViewDetails(job)}
            />
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
          />
        )}
      </main>
    </div>
  );
}
