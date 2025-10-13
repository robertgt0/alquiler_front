'use client';

import JobCard from "./components/jobCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { useState, useEffect } from "react";
import { usePagination } from "./hooks/usePagination";
import { Job } from "./types/job";


export default function BusquedaPage() {
  //const allJobs = getJobs();

  const [allJobs, setAllJobs] = useState<Job[]>([]);

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

    const handleViewDetails = (job: any) => {
    console.log('Ver detalles de:', job);
    };


  // Cargar trabajos desde la API al montar el componente
  useEffect(() => {
    const loadJobs = async () => {

      
      const jobs = await getJobs(); 
      setAllJobs(jobs); 
    };

    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Título principal */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-3 tracking-tight">
            Ofertas de Trabajo Disponibles
          </h1>
          
          {/* Información de paginación */}
          <div className="text-lg text-blue-600 font-medium">
            Mostrando {currentItems.length} de {totalItems} Ofertas Disponibles
          </div>
        </div>

        
        {/* Lista de trabajos */}
        <div className="space-y-6">
          {currentItems.map((job, index) => (
            <JobCard
              key={`${job.title}-${job.company}-${index}`}
              {...job}
              onViewDetails={() => handleViewDetails(job)}
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
