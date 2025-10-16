import { useState, useMemo, useCallback } from "react";
import { Job } from "../types/job";

export const usePagination = (items: Job[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, items]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsLoading(true);
      setCurrentPage(page);
      // Scroll suave al inicio solo cuando cambia la página
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Simular un pequeño delay para evitar parpadeos
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [currentPage, totalPages]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setIsLoading(true);
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [currentPage]);

  return {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems,
    isLoading
  };
};