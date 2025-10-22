"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
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

export type Coords = { lat: number; lng: number };

type Props = {
  open: boolean;
  initialCenter?: Coords | null;
  initialRadius?: number; // metros
  onConfirm: (loc: Coords & { address?: string; radiusMeters: number }) => void;
  onCancel: () => void;
};

export default function SelectLocationModal({
  open,
  initialCenter,
  initialRadius = 1000,
  onConfirm,
  onCancel,
}: Props) {
  const [center, setCenter] = useState<Coords | null>(null);
  const [search, setSearch] = useState("");
  const [address, setAddress] = useState<string | undefined>();
  const [radius, setRadius] = useState<number>(initialRadius);

  const icon = useMemo(() => {
    if (typeof window === "undefined") return null;
    const L = require("leaflet");
    return new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconAnchor: [12, 41],
    });
  }, []);

  // cargar ubicación inicial
  useEffect(() => {
    if (!open) return;

    setRadius(initialRadius);

    if (initialCenter) {
      setCenter(initialCenter);
      return;
    }

    if (typeof window === "undefined") return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        // fallback Cochabamba
        setCenter({ lat: -17.3895, lng: -66.1568 });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [open, initialCenter, initialRadius]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    const q = encodeURIComponent(search);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&addressdetails=1`;

    try {
      const r = await fetch(url, { headers: { "Accept-Language": "es" } });
      const list = await r.json();
      if (list?.length) {
        const it = list[0];
        setCenter({ lat: Number(it.lat), lng: Number(it.lon) });
        setAddress(it.display_name);
      }
    } catch (err) {
      console.warn("Búsqueda falló:", err);
    }
  }

  if (!open || typeof window === "undefined") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "min(900px, 92vw)",
          maxHeight: "90vh",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        {/* Header */}
        <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
          <h3 style={{ margin: 0 }}>Añadir mi ubicación</h3>
          <p style={{ margin: "6px 0 0", color: "#555" }}>
            Haz clic en el mapa o arrastra el marcador. El círculo muestra tu radio.
          </p>

          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: 8, marginTop: 10 }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar dirección..."
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Mapa */}
        <div style={{ height: 420 }}>
          {center && (
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />
              {icon && (
                <Marker
                  position={[center.lat, center.lng]}
                  icon={icon}
                  draggable
                  eventHandlers={{
                    dragend: (e: any) => {
                      const pos = e.target.getLatLng();
                      setCenter({ lat: pos.lat, lng: pos.lng });
                    },
                  }}
                />
              )}
              <Circle
                center={[center.lat, center.lng]}
                radius={radius}
                pathOptions={{ color: "#2563eb", fillOpacity: 0.1 }}
              />
            </MapContainer>
          )}
        </div>

        {/* Radio + Coordenadas + Botones */}
        <div
          style={{
            padding: 16,
            borderTop: "1px solid #eee",
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: 13 }}>
            {center && (
              <>
                <b>Lat:</b> {center.lat.toFixed(6)} &nbsp;
                <b>Lng:</b> {center.lng.toFixed(6)}
                {address && (
                  <>
                    <br />
                    <span style={{ color: "#666" }}>{address}</span>
                  </>
                )}
              </>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ fontSize: 13, color: "#333" }}>
              Radio: <b>{Math.round(radius)} m</b>
            </label>
            <input
              type="range"
              min={200}
              max={5000}
              step={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button
              onClick={onCancel}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() =>
                center && onConfirm({ ...center, address, radiusMeters: radius })
              }
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
