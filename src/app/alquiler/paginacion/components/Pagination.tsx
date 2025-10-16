'use client';
// Componente de paginación visual y accesible

import React, { useMemo, useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  handlePageChange,
  handleNextPage,
  handlePrevPage
}: PaginationProps) {

  // Memoizar el array de páginas para evitar recálculos innecesarios
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  // Memoizar las funciones de callback para evitar re-renderizados
  const handlePageClick = useCallback((page: number) => {
    if (page !== currentPage) {
      handlePageChange(page);
    }
  }, [currentPage, handlePageChange]);

  // Validaciones para botones deshabilitados
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages || totalPages === 0;

  if (totalPages === 0) return null;
    
  return (
    <div className="flex flex-col items-center mt-12 space-y-4">
      {/* Información de página */}
      <div className="text-sm text-blue-600 font-medium">
        Página {currentPage} de {totalPages}
      </div>
      
      {/* Controles de paginación */}
      <div className="flex items-center space-x-4">
        {/* Botón Anterior */}
        <button 
          onClick={handlePrevPage}
          disabled={isPrevDisabled}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isPrevDisabled
              ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
              : 'text-blue-600 hover:text-white hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 bg-blue-50'
          }`}
          aria-label="Página anterior"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
        
        {/* Números de página */}
        <div className="flex items-center space-x-2">
          {pageNumbers.map((page) => (
            <button 
              key={page}
              onClick={() => handlePageClick(page)}
              className={`w-12 h-12 rounded-xl font-bold transition-all duration-200 ${
                page === currentPage
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-110'
                  : 'text-blue-600 hover:text-white hover:bg-blue-500 hover:shadow-md bg-blue-50'
              }`}
              aria-label={`Ir a página ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>
        
        {/* Botón Siguiente */}
        <button 
          onClick={handleNextPage}
          disabled={isNextDisabled}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isNextDisabled
              ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
              : 'text-blue-600 hover:text-white hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 bg-blue-50'
          }`}
          aria-label="Página siguiente"
        >
          Siguiente
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}