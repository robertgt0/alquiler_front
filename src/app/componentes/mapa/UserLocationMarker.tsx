//components/UserLocationMarker.tsx
"use client";

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';

interface UserLocationMarkerProps {
  position: [number, number];
  accuracy?: number;
}

// Ícono personalizado para la ubicación del usuario
const createUserLocationIcon = () => 
  L.divIcon({
    className: 'user-location-marker',
    html: ReactDOMServer.renderToString(
      <div className="relative">
        <div className="w-6 h-6 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
        <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping"></div>
      </div>
    ),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

export default function UserLocationMarker({ position, accuracy }: UserLocationMarkerProps) {
  return (
    <Marker
      position={position}
      icon={createUserLocationIcon()}
    >
      <Popup>
        <div className="text-center">
          <strong>📍 Tu ubicación</strong>
          {accuracy && (
            <p className="text-sm text-gray-600 mt-1">
              Precisión: ±{accuracy.toFixed(0)} metros
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}