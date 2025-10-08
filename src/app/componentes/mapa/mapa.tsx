"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Configurar íconos de Leaflet (solo en cliente)
if (typeof window !== "undefined") {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
  });
}

export interface Ubicacion {
  id: number;
  nombre: string;
  posicion: [number, number];
}

interface MapaProps {
  ubicaciones: Ubicacion[];
  ubicacionSeleccionada: Ubicacion | null;
  onUbicacionClick?: (ubicacion: Ubicacion) => void;
}

function ActualizarVista({ ubicacion }: { ubicacion: Ubicacion | null }) {
  const map = useMap();

  useEffect(() => {
    if (ubicacion) {
      map.flyTo(ubicacion.posicion, 18, { duration: 2 });
    }
  }, [ubicacion, map]);

  return null;
}

export default function Mapa({ ubicaciones, ubicacionSeleccionada, onUbicacionClick }: MapaProps) {
  const centroInicial: [number, number] = [-17.3895, -66.1568];

  return (
    <div className="w-full max-w-6xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] mx-auto px-4">

      <MapContainer center={centroInicial} zoom={13} className="w-full h-full rounded-lg shadow-lg z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores de todas las ubicaciones */}
        {ubicaciones.map((u) => (
          <Marker
            key={u.id}
            position={u.posicion}
            eventHandlers={{ click: () => onUbicacionClick?.(u) }}
          >
            <Popup>{u.nombre}</Popup>
          </Marker>
        ))}

        {/* Marcador resaltado de la ubicación seleccionada */}
        {ubicacionSeleccionada && (
          <Marker position={ubicacionSeleccionada.posicion}>
            <Popup>{ubicacionSeleccionada.nombre}</Popup>
          </Marker>
        )}

        <ActualizarVista ubicacion={ubicacionSeleccionada} />
      </MapContainer>
    </div>
  );
}