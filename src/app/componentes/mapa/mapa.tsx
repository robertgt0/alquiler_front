// components/mapa.tsx
// components/mapa.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import UbicacionIcon from "./UbicacionIcon";
import MarkerClusterGroup from "./MarkerClusterGroup";
import FixerCard from "./PopupFixer"; // ✅ importamos el nuevo componente
import { Ubicacion, Fixer } from "../../types";

// 🔹 Tipado seguro para Leaflet
interface IconDefaultWithPrivate extends L.Icon.Default {
  _getIconUrl?: () => void;
}

// Corrige los íconos de Leaflet sin usar 'any'
delete (L.Icon.Default.prototype as unknown as IconDefaultWithPrivate)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapaProps {
  ubicaciones: Ubicacion[];
  fixers: Fixer[];
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

export default function Mapa({
  ubicaciones,
  fixers = [],
  ubicacionSeleccionada,
  onUbicacionClick,
}: MapaProps) {
  const centroInicial: [number, number] = [-17.3895, -66.1568];

  // 🔹 Crea un ícono HTML con el componente UbicacionIcon
  const crearIcono = (onClick?: () => void) =>
    L.divIcon({
      className: "custom-marker",
      html: ReactDOMServer.renderToString(<UbicacionIcon onClick={onClick} />),
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

  const fixerMarkers = fixers.map((f) => ({
    id: f._id,
    position: [f.posicion.lat, f.posicion.lng] as [number, number],
    popup: `
      <div style="width: 220px; padding: 8px;">
        <h3 style="margin: 0 0 5px 0; color: #2563eb; font-size: 14px;">${f.nombre}</h3>
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #666; background: #f3f4f6; padding: 4px; border-radius: 4px;">
          🛠️ ${f.especialidad}
        </p>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #4b5563;">${f.descripcion || 'Especialista disponible'}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #16a34a; font-size: 11px;">⭐ ${f.rating || 4.5}/5</span>
          ${f.verified ? '<span style="color: #059669; font-size: 10px;">✅ Verificado</span>' : ''}
        </div>
      </div>
    `,
    icon: crearIcono(),
  }));

  return (
    <div className="w-full max-w-6xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] mx-auto px-4">
      <MapContainer
        center={centroInicial}
        zoom={13}
        className="w-full h-full rounded-lg shadow-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores normales */}
        {ubicaciones.map((u) => (
          <Marker
            key={u.id}
            position={u.posicion}
            icon={crearIcono(() => onUbicacionClick?.(u))}
          >
            <Popup>{u.nombre}</Popup>
          </Marker>
        ))}

        {/* Fixers agrupados en clusters */}
        <MarkerClusterGroup markers={fixerMarkers} />

        {/* Actualiza vista */}
        <ActualizarVista ubicacion={ubicacionSeleccionada} />
      </MapContainer>
    </div>
  );
}
