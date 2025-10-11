'use client';

import { constants } from "buffer";
import React from "react";

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

  //if(totalPages === 0)return null ;
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    //si hay pocas paginasmuestra todos
    if (totalPages <= 6) {
      
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {

      pages.push(1);

      // puntos suspensivos al inicio
      if (currentPage > 4) pages.push("...");

      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) pages.push(i);


      // puntos suspensivos al final
      if (currentPage < totalPages - 5 ) pages.push("...");


      pages.push(totalPages);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();



  return (
    <div className="flex justify-center items-center mt-12 space-x-2">
      {/* Botón Anterior */}

      {/*Desaparece el botton */}
      {/*currentPage > 1 && */(
        <button
          onClick={handlePrevPage}
          //disabled={currentPage === 1 }
          className={`flex items-center justify-center gap-1 px-3 h-10 rounded-md font-medium transition-colors ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed invisible'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
        >

          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>

          <span>
            Anterior
          </span>

        </button>
      )}

      <div className="flex justify-center items-center min-w-[500px] space-x-2">
        {visiblePages.map((page, index) => (
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`flex items-center justify-center gap-1 w-10 h-10 rounded-md font-medium transition-colors ${page === currentPage
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
              {page}
            </button>
          ) : (
            <span key={index} className="w-8 text-center text-gray-400">...</span>
          )

        ))}
      </div>
      

      {/* Botón Siguiente */}
      {/*currentPage < totalPages && */(
        <button
          onClick={handleNextPage}
          //disabled={currentPage === totalPages || totalPages === 0}
          className={`flex items-center justify-center px-3 h-10 rounded-md font-medium transition-colors ${currentPage === totalPages || totalPages === 0
            ? 'text-gray-400 cursor-not-allowed invisible'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
        >
          <span>
            Siguiente
          </span>

          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>

        </button>
      )}
    </div>
  );
}

