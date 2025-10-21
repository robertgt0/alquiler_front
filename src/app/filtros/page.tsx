'use client';

import { useState } from 'react';
//import FiltroForm from '../../app/alquiler/Feature/Componentes/FiltroForm';

export default function FiltrosPage() {
  // Estados básicos
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Función manejadora simple
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Filtros de Búsqueda</h1>
      {/* <FiltroForm ... /> */}
    </div>
  );
}