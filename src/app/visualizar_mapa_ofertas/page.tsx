'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useUserLocation } from './hooks/useUserLocation';
import { mockOffers } from './services/mockOffersData';

// Importar MapComponent dinámicamente para evitar errores de SSR con Leaflet
const MapComponent = dynamic(
  () => import('./components/MapComponent').then((mod) => mod.MapComponent),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-screen">Cargando mapa...</div> }
);

export default function VisualizarMapaOfertas() {
  const { userLocation, loading, error } = useUserLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Obteniendo tu ubicación...</p>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Error</h2>
          <p className="text-gray-700 mb-4">
            {error || 'No se pudo obtener tu ubicación'}
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

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">🗺️ Mapa de Ofertas - Servineo</h1>
        <p className="text-sm">
          Encuentra servicios cerca de ti en Cochabamba
        </p>
      </div>

      {/* Mapa */}
      <div className="flex-1">
        <MapComponent userLocation={userLocation} offers={mockOffers} />
      </div>

      {/* Footer Info */}
      <div className="bg-gray-800 text-white p-3 text-center text-sm">
        📍 Mostrando {mockOffers.length} ofertas activas | 
        📌 Tu ubicación: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
      </div>
    </div>
  );
}