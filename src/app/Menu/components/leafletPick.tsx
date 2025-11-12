'use client';

import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export type LatLng = { lat: number; lng: number };

function ClickHandler({ onChange }: { onChange: (c: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// 🔹 NUEVO: para que el mapa se re-centre cuando cambia "center"
function MapAutoCenter({ center }: { center: LatLng }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);

  return null;
}

export default function LeafletPick({
  value,
  onChange,
  zoom = 15,
  radius = 100,
}: {
  value?: LatLng;
  onChange: (c: LatLng) => void;
  zoom?: number;
  radius?: number;
}) {
  const center: LatLng = value ?? { lat: -17.3895, lng: -66.1568 };

  return (
    <div
      style={{
        height: 320,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler onChange={onChange} />
        {/* 🔹 centra el mapa en el center actual */}
        <MapAutoCenter center={center} />

        {value && (
          <>
            <Marker position={[value.lat, value.lng]} />
            <Circle center={[value.lat, value.lng]} radius={radius} />
          </>
        )}
      </MapContainer>
    </div>
  );
}