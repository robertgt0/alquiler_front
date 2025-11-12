'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useUserLocation } from './hooks/useUserLocation';
import { mockOffers } from './services/mockOffersData';
import { useFilters } from './hooks/useFilters';
import { FilterBar } from './components/FilterBar';

const MapComponent = dynamic(
  () => import('./components/MapComponent').then((mod) => mod.MapComponent),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-screen">Cargando mapa...</div> }
);

export default function VisualizarMapaOfertas() {
  const { userLocation, loading, error } = useUserLocation();
  
  const defaultLocation = { lat: -17.3935, lng: -66.1570 };
  const filters = useFilters(mockOffers, userLocation || defaultLocation);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Obteniendo tu ubicacion...</p>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">
            {error || 'No se pudo obtener tu ubicacion'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const activeOffers = mockOffers.filter(offer => offer.isActive);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Mapa de Ofertas - Servineo</h1>
        <p className="text-sm">
          Encuentra servicios cerca de ti en Cochabamba
        </p>
      </div>

      <div className="flex-1 relative">
        <FilterBar
          allCategories={filters.allCategories}
          selectedCategories={filters.selectedCategories}
          maxDistance={filters.maxDistance}
          onToggleCategory={filters.toggleCategory}
          onDistanceChange={filters.setMaxDistance}
          onClearFilters={filters.clearFilters}
          totalOffers={activeOffers.length}
          filteredCount={filters.filteredOffers.length}
        />

        <MapComponent 
          userLocation={userLocation} 
          offers={filters.filteredOffers}
          maxDistance={filters.maxDistance}
        />
      </div>

      <div className="bg-gray-800 text-white p-3 text-center text-sm">
        Mostrando {filters.filteredOffers.length} ofertas activas | 
        Tu ubicacion: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)} |
        Radio: {filters.maxDistance} km
      </div>
    </div>
  );
}