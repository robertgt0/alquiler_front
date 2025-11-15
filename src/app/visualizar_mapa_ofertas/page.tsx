'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useUserLocation } from './hooks/useUserLocation';
import { fetchActiveOffers } from './services/offersApi';
import { useFilters } from './hooks/useFilters';
import { FilterBar } from './components/FilterBar';
import { Offer } from './interfaces/types';

const MapComponent = dynamic(
  () => import('./components/MapComponent').then((mod) => mod.MapComponent),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-screen">Cargando mapa...</div> }
);

export default function VisualizarMapaOfertas() {
  const { userLocation, loading: locationLoading, error: locationError } = useUserLocation();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState<string | null>(null);
  
  const defaultLocation = { lat: -17.3935, lng: -66.1570 };
  const filters = useFilters(offers, userLocation || defaultLocation);

  // Cargar ofertas del backend
  useEffect(() => {
    async function loadOffers() {
      setOffersLoading(true);
      setOffersError(null);
      
      try {
        const data = await fetchActiveOffers();
        
        if (data.length === 0) {
          setOffersError('No se encontraron ofertas disponibles');
        }
        
        setOffers(data);
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
        setOffersError('Error al cargar las ofertas del servidor');
      } finally {
        setOffersLoading(false);
      }
    }

    loadOffers();
  }, []);

  // Mostrar loading mientras se obtiene ubicación u ofertas
  if (locationLoading || offersLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {locationLoading ? 'Obteniendo tu ubicación...' : 'Cargando ofertas...'}
          </p>
        </div>
      </div>
    );
  }

  // Mostrar error si no se pudo obtener la ubicación
  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error de Ubicación</h2>
          <p className="text-gray-700 mb-4">
            {locationError || 'No se pudo obtener tu ubicación'}
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

  // Mostrar mensaje si no hay ofertas (pero permitir seguir usando el mapa)
  const hasOffers = offers.length > 0;

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col">
      {/* Header azul compacto */}
      <div className="bg-blue-600 text-white p-3 shadow-lg">
        <h1 className="text-xl font-bold">Mapa de Ofertas - Servineo</h1>
        <p className="text-xs">
          Encuentra servicios cerca de ti en Cochabamba
        </p>
        {offersError && (
          <p className="text-xs bg-red-500 bg-opacity-70 px-2 py-1 rounded mt-1">
            ⚠️ {offersError}
          </p>
        )}
      </div>

      <div className="flex-1 relative">
        {hasOffers ? (
          <>
            <FilterBar
              allCategories={filters.allCategories}
              selectedCategories={filters.selectedCategories}
              maxDistance={filters.maxDistance}
              onToggleCategory={filters.toggleCategory}
              onDistanceChange={filters.setMaxDistance}
              onClearFilters={filters.clearFilters}
              totalOffers={offers.length}
              filteredCount={filters.filteredOffers.length}
            />

            <MapComponent 
              userLocation={userLocation} 
              offers={filters.filteredOffers}
              maxDistance={filters.maxDistance}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
              <h2 className="text-2xl font-bold text-yellow-600 mb-4">Sin Ofertas</h2>
              <p className="text-gray-700 mb-4">
                No hay ofertas disponibles en este momento. Por favor, intenta más tarde.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Recargar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 text-white p-2 text-center text-xs">
        {hasOffers ? (
          <>
            Mostrando {filters.filteredOffers.length} de {offers.length} ofertas activas | 
            Tu ubicación: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)} |
            Radio: {filters.maxDistance} km
          </>
        ) : (
          <>
            Sin ofertas disponibles | 
            Tu ubicación: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </>
        )}
      </div>
    </div>
  );
}