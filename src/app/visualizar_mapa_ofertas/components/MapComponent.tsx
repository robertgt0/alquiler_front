'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Offer, Location } from '../interfaces/types';
import { calculateDistance, formatDistance } from '../utils/mapHelpers';
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

const MapController: React.FC<{ center: Location; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center, zoom, map]);
  
  return null;
};

export const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  offers,
}) => {
  const [mapCenter, setMapCenter] = useState<Location>(userLocation);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const mapRef = useRef<L.Map | null>(null);

  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const offerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
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

        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <strong>Tu ubicacion</strong>
            </div>
          </Popup>
        </Marker>

        {offers.map((offer) => {
          const distance = calculateDistance(userLocation, offer.location);
          
          return (
            <Marker
              key={offer.id}
              position={[offer.location.lat, offer.location.lng]}
              icon={offerIcon}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{offer.fixerName}</h3>
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

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleCenterUser}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
          title="Centrar en mi ubicacion"
        >
          Centrar
        </button>
        <button
          onClick={handleZoomIn}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
          title="Acercar"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
          title="Alejar"
        >
          -
        </button>
      </div>
    </div>
  );
};