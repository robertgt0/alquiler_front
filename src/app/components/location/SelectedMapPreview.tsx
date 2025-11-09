"use client";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix de iconos Leaflet (Next.js)
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

export default function SelectedMapPreview({
  lat,
  lng,
  height = 180,
}: {
  lat: number;
  lng: number;
  height?: number;
}) {
  return (
    <div className="rounded border overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height, width: "100%" }}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
        <Circle
          center={[lat, lng]}
          radius={1000}
          pathOptions={{ color: "#2563eb", fillOpacity: 0.1 }}
        />
      </MapContainer>
    </div>
  );
}
