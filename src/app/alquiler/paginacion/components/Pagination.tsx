'use client';

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
    
  return (
    <div className="flex justify-center items-center mt-12 space-x-2">
      {/* Botón Anterior */}
      <button 
        onClick={handlePrevPage}
        disabled={currentPage === 1 }
        className={`w-10 h-10 rounded-md font-medium transition-colors ${
          currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        &lt;
      </button>
      
      {/* Números de página */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button 
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-10 h-10 rounded-md font-medium transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      {/* Botón Siguiente */}
      <button 
        onClick={handleNextPage}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`w-10 h-10 rounded-md font-medium transition-colors ${
          currentPage === totalPages || totalPages === 0 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        &gt;
      </button>
    </div>
  );
}
