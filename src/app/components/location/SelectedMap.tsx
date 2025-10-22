"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((m) => m.Circle),
  { ssr: false }
);

type Props = {
  lat: number;
  lng: number;
  radiusMeters?: number;
  height?: number;
};

export default function SelectedMap({
  lat,
  lng,
  radiusMeters = 1000,
  height = 260,
}: Props) {
  const icon = useMemo(() => {
    if (typeof window === "undefined") return null;
    const L = require("leaflet");
    return new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconAnchor: [12, 41],
    });
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <div style={{ height }}>
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {icon && <Marker position={[lat, lng]} icon={icon} />}
        <Circle
          center={[lat, lng]}
          radius={radiusMeters}
          pathOptions={{ color: "#2563eb", fillOpacity: 0.1 }}
        />
      </MapContainer>
    </div>
  );
}
