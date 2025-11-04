"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});

export default function SelectedMapClient({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div
      style={{
        height: 220,
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
      }}
    >
      <MapContainer center={[lat, lng]} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={icon} />
      </MapContainer>
    </div>
  );
}
