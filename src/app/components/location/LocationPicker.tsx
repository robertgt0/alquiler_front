//src/app/components/location/LocationPicker.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix de iconos Leaflet
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

type Coords = { lat: number; lng: number };
type Props = {
  value?: Coords | null;
  onChange: (coords: Coords) => void;
  height?: number;
  defaultCenter?: Coords;
};

function ClickHandler({ onPick }: { onPick: (c: Coords) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({
  value,
  onChange,
  height = 360,
  defaultCenter = { lat: -16.5, lng: -68.15 },
}: Props) {
  const [pos, setPos] = useState<Coords | null>(value || null);

  useEffect(() => {
    if (value && (value.lat !== pos?.lat || value.lng !== pos?.lng)) {
      setPos(value);
    }
  }, [value]); // eslint-disable-line

  const center: LatLngExpression = useMemo<LatLngExpression>(() => {
    if (pos) return [pos.lat, pos.lng];
    return [defaultCenter.lat, defaultCenter.lng];
  }, [pos, defaultCenter]);

  const handlePick = (c: Coords) => {
    setPos(c);
    onChange(c);
  };

  return (
    <div className="rounded overflow-hidden border">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height, width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={handlePick} />
        {pos && (
          <Marker
            position={[pos.lat, pos.lng]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target as L.Marker;
                const ll = m.getLatLng();
                handlePick({ lat: ll.lat, lng: ll.lng }); // ← tiempo real al soltar
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
