import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Job } from "../types/job";

export const usePagination = (items: Job[], itemsPerPage: number = 10) => { // 10 items por página
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtener página actual de la URL o usar 1 como valor predeterminado
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Validar y ajustar la página si está fuera de rango
  useEffect(() => {
    if (totalPages > 0) {
      if (currentPage > totalPages) {
        // Redirigir a la última página si la actual es mayor
        updateUrlAndPage(totalPages);
      } else if (currentPage < 1) {
        // Redirigir a la primera página si la actual es menor a 1
        updateUrlAndPage(1);
      }
    }
  }, [totalPages, currentPage]);

  // Mantener la página actual cuando los items cambian, solo resetear si es necesario
  useEffect(() => {
    const currentUrlPage = parseInt(searchParams.get('page') || '1', 10);
    
    if (items.length > 0) {
      // Solo resetear a página 1 si:
      // 1. No hay página en la URL
      // 2. La página actual es inválida
      if (!searchParams.get('page') || currentUrlPage > Math.ceil(items.length / itemsPerPage)) {
        updateUrlAndPage(1);
      }
    }
  }, [items, searchParams, itemsPerPage]);

  // Función para actualizar la URL y el estado de la página
  const updateUrlAndPage = (page: number) => {
    // Crear nuevo objeto URLSearchParams con todos los parámetros actuales
    const params = new URLSearchParams(window.location.search);
    
    // Actualizar o agregar el parámetro de página
    params.set('page', page.toString());
    
    // Preservar todos los parámetros existentes
    searchParams.forEach((value, key) => {
      if (key !== 'page') { // No sobreescribir la página que acabamos de establecer
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
    setCurrentPage(page);
  };

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, items]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateUrlAndPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      updateUrlAndPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      updateUrlAndPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems,
  };
};
