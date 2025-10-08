'use client';

import JobCard from "./components/jobCard";
import Header from "./components/Header";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";


export default function BusquedaPage() {
  const allJobs = getJobs();
  const itemsPerPage = 10;

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems
  } = usePagination(allJobs, itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información de paginación */}
        <div className="mb-6 text-sm text-gray-600">
          Mostrando {currentItems.length} de {totalItems} trabajos (Página {currentPage} de {totalPages})
        </div>
        
        <div className="space-y-6">
          {currentItems.map((job, index) => (
            <JobCard
              key={`${job.title}-${job.company}-${index}`}
              {...job}
            />
          ))}
        </div>
        
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
        
        {/* Información adicional de paginación */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {currentItems.length === itemsPerPage ? (
            <span>Mostrando {itemsPerPage} trabajos por página</span>
          ) : (
            <span>Última página: {currentItems.length} trabajos</span>
          )}
        </div>
      </main>
    </div>
  );
}
