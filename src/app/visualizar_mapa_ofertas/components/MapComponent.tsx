'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Offer, Location } from '../interfaces/types';
import { calculateDistance, formatDistance } from '../utils/mapHelpers';
import { getMarkerIcon } from '../config/markerIcons';
import { OfferDetailModal } from './OfferDetailModal';
import { useModal } from '../hooks/useModal';
import 'leaflet/dist/leaflet.css';

// Arreglar los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  userLocation: Location;
  offers: Offer[];
  onCenterChange?: (center: Location) => void;
  onZoomChange?: (zoom: number) => void;
}

// Componente auxiliar para controlar el mapa
const MapController: React.FC<{ center: Location; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Función para crear íconos dinámicos con colores según categoría
const createCategoryIcon = (category: string): L.Icon => {
  const colorMap: Record<string, string> = {
    'Plomería': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    'Electricidad': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    'Carpintería': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    'Limpieza': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    'Pintura': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    'Jardinería': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png'
  };

  const iconUrl = colorMap[category] || 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

  return new L.Icon({
    iconUrl: iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  offers,
  onCenterChange,
  onZoomChange
}) => {
  const [mapCenter, setMapCenter] = useState<Location>(userLocation);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const mapRef = useRef<L.Map | null>(null);

  // Estados para el modal (HU13)
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // Función para abrir el modal con una oferta
  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    openModal();
  };

  // Filtrar solo ofertas activas (HU12)
  const activeOffers = offers.filter(offer => offer.isActive === true);

  // Icono personalizado para el usuario
  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const handleCenterUser = () => {
    setMapCenter(userLocation);
    setMapZoom(15);
  };

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 3));
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={mapZoom}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Marcador del usuario */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <strong>Tu ubicacion</strong>
            </div>
          </Popup>
        </Marker>

        {/* Marcadores de ofertas activas con colores por categoría (HU12) */}
        {activeOffers.map((offer) => {
          const distance = calculateDistance(userLocation, offer.location);
          const categoryIcon = createCategoryIcon(offer.category);
          const emoji = getMarkerIcon(offer.category);
          
          return (
            <Marker
              key={offer.id}
              position={[offer.location.lat, offer.location.lng]}
              icon={categoryIcon}
            >
              {/* Tooltip al pasar el cursor (HU12) */}
              <Tooltip 
                direction="top" 
                offset={[0, -35]} 
                opacity={1}
                permanent={false}
              >
                <div className="text-center font-semibold">
                  <div className="text-base">{emoji} {offer.fixerName}</div>
                  <div className="text-xs text-gray-600">{offer.category}</div>
                </div>
              </Tooltip>

              {/* Popup con detalles completos */}
              <Popup maxWidth={300}>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{emoji} {offer.fixerName}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Categoria:</strong> {offer.category}
                  </p>
                  <p className="text-sm mb-2">{offer.description}</p>
                  <p className="text-sm mb-2">
                    <strong>Distancia:</strong> {formatDistance(distance)}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Rating:</strong> {offer.rating}/5
                  </p>
                  <p className="text-sm mb-3">
                    <strong>Precio:</strong> Bs. {offer.price}
                  </p>
                  
                  {/* Botón para abrir modal (HU13) */}
                  <button
                    onClick={() => handleOfferClick(offer)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm inline-block w-full text-center mb-2"
                  >
                    Ver mas detalles
                  </button>
                  
                  <a
                    href={`https://wa.me/${offer.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm inline-block w-full text-center"
                  >
                    Contactar por WhatsApp
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Controles personalizados */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleCenterUser}
          className="bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition text-sm font-semibold"
          title="Centrar en mi ubicacion"
        >
          Centrar
        </button>
        <button
          onClick={handleZoomIn}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition font-bold text-xl"
          title="Acercar"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition font-bold text-xl"
          title="Alejar"
        >
          -
        </button>
      </div>

      {/* Leyenda de categorías (HU12) */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-[220px]">
        <h4 className="font-bold mb-3 text-sm border-b border-gray-600 pb-2">
          Categorias
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-lg">●</span>
            <span className="font-medium">Plomeria</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">●</span>
            <span className="font-medium">Electricidad</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-400 text-lg">●</span>
            <span className="font-medium">Carpinteria</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-lg">●</span>
            <span className="font-medium">Limpieza</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-lg">●</span>
            <span className="font-medium">Pintura</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-lg">●</span>
            <span className="font-medium">Jardineria</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-600 text-xs font-semibold text-green-400">
          Total: {activeOffers.length} ofertas activas
        </div>
      </div>

      {/* Modal de detalle (HU13) */}
      <OfferDetailModal
        offer={selectedOffer}
        isOpen={isOpen}
        onClose={closeModal}
        userLocation={userLocation}
      />
    </div>
  );
};