'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Circle, useMap, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import { Offer, Location } from '../interfaces/types';
import { calculateDistance, formatDistance } from '../utils/mapHelpers';
import { getMarkerIcon, getMarkerColor } from '../config/markerIcons';
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

// Límites de zoom
const MIN_ZOOM = 3;
const MAX_ZOOM = 18;

// MapController con tracking de zoom
const MapController: React.FC<{ 
  center: Location; 
  zoom: number; 
  trigger: number;
  onZoomChange: (zoom: number) => void;
}> = ({ center, zoom, trigger, onZoomChange }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, {
      animate: true,
      duration: 1
    });
  }, [trigger]);

  useEffect(() => {
    const handleZoomEnd = () => {
      onZoomChange(map.getZoom());
    };
    
    map.on('zoomend', handleZoomEnd);
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, onZoomChange]);
  
  return null;
};

// Crear marcador personalizado con DivIcon
const createCategoryIcon = (category: string): L.DivIcon => {
  const color = getMarkerColor(category);
  const emoji = getMarkerIcon(category);
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 32px; height: 40px;">
        <!-- Pin/Marcador -->
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 16px solid transparent;
          border-right: 16px solid transparent;
          border-top: 32px solid ${color};
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        "></div>
        
        <!-- Círculo superior -->
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">${emoji}</div>
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
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
  const [mapZoom, setMapZoom] = useState<number>(15);
  const [currentZoom, setCurrentZoom] = useState<number>(15);
  const [centerTrigger, setCenterTrigger] = useState<number>(0);
  const mapRef = useRef<L.Map | null>(null);

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedOffers, setSelectedOffers] = useState<Offer[]>([]);

  const handleOfferClick = (offers: Offer[]) => {
    setSelectedOffers(offers);
    openModal();
  };

  const activeOffers = offers.filter(offer => offer.isActive === true);

  // Marcador del usuario con DivIcon personalizado
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div style="position: relative; width: 40px; height: 50px;">
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-top: 40px solid #EF4444;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
        "></div>
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 36px;
          background: #EF4444;
          border: 4px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.4);
          animation: pulse 2s infinite;
        ">📍</div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
        }
      </style>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

  const handleCenterUser = () => {
    setMapCenter(userLocation);
    setMapZoom(15);
    setCenterTrigger(prev => prev + 1);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(currentZoom + 1, MAX_ZOOM);
    setMapZoom(newZoom);
    setCenterTrigger(prev => prev + 1);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(currentZoom - 1, MIN_ZOOM);
    setMapZoom(newZoom);
    setCenterTrigger(prev => prev + 1);
  };

  const handleZoomChangeFromMap = (zoom: number) => {
    setCurrentZoom(zoom);
    setMapZoom(zoom);
  };

  const isMaxZoom = currentZoom >= MAX_ZOOM;
  const isMinZoom = currentZoom <= MIN_ZOOM;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={15}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ScaleControl position="bottomright" imperial={false} />
        
        <MapController 
          center={mapCenter} 
          zoom={mapZoom} 
          trigger={centerTrigger}
          onZoomChange={handleZoomChangeFromMap}
        />

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

        {(() => {
          // Agrupar ofertas por persona (usando nombre o ID único)
          const groupedOffers = activeOffers.reduce((acc, offer) => {
            const key = `${offer.fixerName}-${offer.location.lat}-${offer.location.lng}`;
            if (!acc[key]) {
              acc[key] = {
                ...offer,
                categories: [offer.category],
                allOffers: [offer]
              };
            } else {
              if (!acc[key].categories.includes(offer.category)) {
                acc[key].categories.push(offer.category);
                acc[key].allOffers.push(offer);
              }
            }
            return acc;
          }, {} as Record<string, any>);

          return Object.values(groupedOffers).map((groupedOffer: any) => {
            const distance = calculateDistance(userLocation, groupedOffer.location);
            // Usar la primera categoría para el ícono, o crear uno multi-categoría
            const primaryCategory = groupedOffer.categories[0];
            const categoryIcon = createCategoryIcon(primaryCategory);
            const emoji = getMarkerIcon(primaryCategory);
            
            return (
              <Marker
                key={`${groupedOffer.fixerName}-${groupedOffer.location.lat}`}
                position={[groupedOffer.location.lat, groupedOffer.location.lng]}
                icon={categoryIcon}
              >
                <Tooltip 
                  direction="top" 
                  offset={[0, -40]} 
                  opacity={1}
                  permanent={false}
                >
                  <div className="text-center font-semibold">
                    <div className="text-base">{emoji} {groupedOffer.fixerName}</div>
                    <div className="text-xs text-gray-600">
                      {groupedOffer.categories.length} categoría{groupedOffer.categories.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </Tooltip>

                <Popup maxWidth={320}>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">{emoji} {groupedOffer.fixerName}</h3>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Categorías:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {groupedOffer.categories.map((cat: string) => (
                          <span 
                            key={cat}
                            className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {getMarkerIcon(cat)} {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm mb-2">{groupedOffer.description}</p>
                    <p className="text-sm mb-2">
                      <strong>Distancia:</strong> {formatDistance(distance)}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Rating:</strong> {groupedOffer.rating}/5 ⭐
                    </p>
                    <p className="text-sm mb-3">
                      <strong>Precio desde:</strong> Bs. {Math.min(...groupedOffer.allOffers.map((o: Offer) => o.price))}
                    </p>
                    
                    <button
                      onClick={() => handleOfferClick(groupedOffer.allOffers)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm inline-block w-full text-center mb-2"
                    >
                      Ver {groupedOffer.allOffers.length > 1 ? `todas las ofertas (${groupedOffer.allOffers.length})` : 'más detalles'}
                    </button>
                    
                    <a
                      href={`https://wa.me/${groupedOffer.whatsapp.replace('+', '')}`}
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
          });
        })()}
      </MapContainer>

      <div className="absolute top-20 right-6 z-[1000] flex flex-col gap-3">
        <button
          onClick={handleCenterUser}
          className="bg-red-600 text-white p-3 rounded-lg shadow-xl hover:bg-red-700 transition text-sm font-semibold flex items-center gap-2"
          title="Centrar en mi ubicación GPS"
        >
          📍 Centrar
        </button>
        
        <div className="bg-white rounded-lg shadow-xl p-2 text-center">
          <div className="text-xs font-bold text-gray-600 mb-1">Zoom</div>
          <div className="text-lg font-bold text-blue-600">{currentZoom}</div>
          <div className="text-xs text-gray-500">
            {MIN_ZOOM} - {MAX_ZOOM}
          </div>
        </div>
        
        <button
          onClick={handleZoomIn}
          disabled={isMaxZoom}
          className={`${
            isMaxZoom 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-4 py-2 rounded-lg shadow-xl transition font-bold text-xl`}
          title={isMaxZoom ? "Zoom máximo alcanzado" : "Acercar"}
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          disabled={isMinZoom}
          className={`${
            isMinZoom 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-4 py-2 rounded-lg shadow-xl transition font-bold text-xl`}
          title={isMinZoom ? "Zoom mínimo alcanzado" : "Alejar"}
        >
          -
        </button>
      </div>

      {/* Leyenda actualizada con los colores reales */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-gray-800 text-white p-3 rounded-lg shadow-lg max-w-[200px]">
        <h4 className="font-bold mb-2 text-sm border-b border-gray-600 pb-2">
          Categorías
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span style={{ color: '#3B82F6' }} className="text-lg">●</span>
            <span className="font-medium">🔧 Plomería</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: '#EAB308' }} className="text-lg">●</span>
            <span className="font-medium">⚡ Electricidad</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: '#8B4513' }} className="text-lg">●</span>
            <span className="font-medium">🪚 Carpintería</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: '#10B981' }} className="text-lg">●</span>
            <span className="font-medium">🧹 Limpieza</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: '#EC4899' }} className="text-lg">●</span>
            <span className="font-medium">🎨 Pintura</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: '#22C55E' }} className="text-lg">●</span>
            <span className="font-medium">🌿 Jardinería</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-600 text-xs font-semibold text-green-400">
          📍 GPS: Activo
          <br />
          Total: {activeOffers.length} ofertas
        </div>
      </div>

      <OfferDetailModal
        offers={selectedOffers}
        isOpen={isOpen}
        onClose={closeModal}
        userLocation={userLocation}
      />
    </div>
  );
};