'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Circle, useMap, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import { Offer, Location } from '../interfaces/types';
import { calculateDistance, formatDistance } from '../utils/mapHelpers';
import { getMarkerIcon } from '../config/markerIcons';
import { OfferDetailModal } from './OfferDetailModal';
import { useModal } from '../hooks/useModal';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  userLocation: Location;
  offers: Offer[];
  maxDistance?: number;
  onCenterChange?: (center: Location) => void;
  onZoomChange?: (zoom: number) => void;
}

// MapController con key única para forzar re-render
const MapController: React.FC<{ center: Location; zoom: number; trigger: number; onZoomChange?: (zoom: number) => void }> = ({ center, zoom, trigger, onZoomChange }) => {
  const map = useMap();
  
  useEffect(() => {
    console.log('🎯 Centrando mapa en:', center);
    map.flyTo([center.lat, center.lng], zoom, {
      animate: true,
      duration: 1
    });
  }, [trigger]); // CLAVE: Solo reacciona al trigger, no a center directamente
  
  // Escuchar cambios de zoom en tiempo real (incluyendo scroll)
  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      console.log('🔍 Zoom cambiado a:', currentZoom);
      if (onZoomChange) {
        onZoomChange(currentZoom);
      }
    };

    map.on('zoomend', handleZoomEnd);
    
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, onZoomChange]);
  
  return null;
};

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
  maxDistance = 10,
  onCenterChange,
  onZoomChange
}) => {
  const [mapCenter, setMapCenter] = useState<Location>(userLocation);
  const [mapZoom, setMapZoom] = useState<number>(15); // Zoom más cercano por defecto
  const [currentZoom, setCurrentZoom] = useState<number>(15); // Estado para zoom actual
  const [centerTrigger, setCenterTrigger] = useState<number>(0); // Contador para forzar centrado
  const mapRef = useRef<L.Map | null>(null);

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    openModal();
  };

  const activeOffers = offers.filter(offer => offer.isActive === true);

  // Icono ROJO más grande para el usuario
  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [35, 57],
    iconAnchor: [17, 57],
    popupAnchor: [1, -50],
    shadowSize: [50, 50]
  });

  // SOLUCIÓN: Botón centrar que SIEMPRE funciona
  const handleCenterUser = () => {
    console.log('🔴 Botón centrar presionado');
    setMapCenter(userLocation);
    setMapZoom(15);
    setCurrentZoom(15);
    setCenterTrigger(prev => prev + 1); // Incrementar trigger para forzar MapController
  };

  const handleZoomIn = () => {
    if (currentZoom < 18) {
      const newZoom = currentZoom + 1;
      setMapZoom(newZoom);
      setCurrentZoom(newZoom);
      setCenterTrigger(prev => prev + 1);
    }
  };

  const handleZoomOut = () => {
    if (currentZoom > 3) {
      const newZoom = currentZoom - 1;
      setMapZoom(newZoom);
      setCurrentZoom(newZoom);
      setCenterTrigger(prev => prev + 1);
    }
  };

  // Función para manejar cambios de zoom desde MapController
  const handleMapZoomChange = (zoom: number) => {
    setCurrentZoom(zoom);
    if (onZoomChange) {
      onZoomChange(zoom);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={15}
        className="w-full h-full"
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Barra de escala */}
        <ScaleControl position="bottomleft" imperial={false} />
        
        <MapController 
          center={mapCenter} 
          zoom={mapZoom} 
          trigger={centerTrigger} 
          onZoomChange={handleMapZoomChange} 
        />

        {/* Círculo azul mostrando el radio de distancia */}
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={maxDistance * 1000}
          pathOptions={{
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.15,
            weight: 3,
            dashArray: '10, 10'
          }}
        />

        {/* Marcador ROJO grande del usuario (ubicación GPS real) */}
        <Marker 
          position={[userLocation.lat, userLocation.lng]} 
          icon={userIcon}
          zIndexOffset={1000}
        >
          <Popup>
            <div className="text-center">
              <strong className="text-red-600 text-lg">📍 Tu ubicación GPS</strong>
              <p className="text-xs text-gray-600 mt-1">
                Lat: {userLocation.lat.toFixed(6)}
              </p>
              <p className="text-xs text-gray-600">
                Lng: {userLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-green-600 mt-2 font-semibold">
                ✅ Ubicación en tiempo real
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Marcadores de ofertas */}
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

      {/* Botones de control */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Indicador de zoom */}
        <div className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm font-semibold text-center">
          🔍 Zoom: {currentZoom}
        </div>
        
        <button
          onClick={handleCenterUser}
          className="bg-red-600 text-white p-3 rounded-lg shadow-lg hover:bg-red-700 transition text-sm font-semibold flex items-center gap-2"
          title="Centrar en mi ubicación GPS"
        >
          📍 Centrar
        </button>
        <button
          onClick={handleZoomIn}
          disabled={currentZoom >= 18}
          className={`text-white px-4 py-2 rounded-lg shadow-lg transition font-bold text-xl ${
            currentZoom >= 18 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title="Acercar"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          disabled={currentZoom <= 3}
          className={`text-white px-4 py-2 rounded-lg shadow-lg transition font-bold text-xl ${
            currentZoom <= 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title="Alejar"
        >
          -
        </button>
      </div>

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-gray-800 text-white p-3 rounded-lg shadow-lg max-w-[200px]">
        <h4 className="font-bold mb-2 text-sm border-b border-gray-600 pb-2">
          Categorias
        </h4>
        <div className="space-y-1 text-xs">
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
        <div className="mt-3 pt-2 border-t border-gray-600 text-xs font-semibold text-green-400">
          📍 GPS: Activo
          <br />
          Total: {activeOffers.length} ofertas
        </div>
      </div>

      <OfferDetailModal
        offer={selectedOffer}
        isOpen={isOpen}
        onClose={closeModal}
        userLocation={userLocation}
      />
    </div>
  );
};