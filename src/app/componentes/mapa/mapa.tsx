"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import UbicacionIcon from "./UbicacionIcon";
import MarkerClusterGroup from "./MarkerClusterGroup";
import { Fixer } from "./FixerPopup";
import { Ubicacion } from "../../types";

interface IconDefaultWithPrivate extends L.Icon.Default {
  _getIconUrl?: () => void;
}

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
    if (ubicacion) map.flyTo(ubicacion.posicion, 18, { duration: 2 });
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

  const crearIcono = (onClick?: () => void) =>
    L.divIcon({
      className: "custom-marker",
      html: ReactDOMServer.renderToString(<UbicacionIcon onClick={onClick} />),
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

  const fixerMarkers = fixers.map((f) => {
    const iniciales = f.nombre
      ? f.nombre
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "FX";

    const especialidades = f.especialidad
      ?.split(",")
      .map(
        (esp) =>
          `<span style="
              background:#eff6ff;
              color:#2563eb;
              font-size:11px;
              padding:3px 8px;
              border-radius:12px;
              margin-right:4px;
              display:inline-block;
              ">${esp.trim()}</span>`
      )
      .join("") || "";

    const popupHtml = `
      <div style="
        width: 250px;
        font-family: 'Inter', sans-serif;
        padding: 8px;
      ">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="
            background:#2563eb;
            color:white;
            border-radius:50%;
            width:40px;
            height:40px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-weight:600;
          ">
            ${iniciales}
          </div>
          <div style="flex:1;">
            <h3 style="margin:0; font-size:14px; color:#111827; display:flex; align-items:center; gap:5px;">
              ${f.nombre}
              ${f.verified ? '<span style="color:#2563eb;">✔️</span>' : ""}
            </h3>
            <p style="margin:2px 0 0 0; font-size:12px; color:#6b7280;">
              ⭐ ${f.rating || 4.9} <span style="color:#9ca3af;">(${f.rating || "156 reseñas"})</span>
            </p>
          </div>
        </div>

        <p style="
          margin:8px 0 6px 0;
          font-size:12px;
          color:#374151;
        ">
          ${f.descripcion || "Especialista en instalaciones domésticas"}
        </p>

        <div style="margin-bottom:8px;">
          ${especialidades}
        </div>

        ${
          f.whatsapp
            ? `<a href="https://wa.me/${f.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                "Hola " + f.nombre + ", vi tu perfil en FixerMap y quiero más información."
              )}"
                 target="_blank"
                 style="
                   display:flex;
                   align-items:center;
                   justify-content:center;
                   gap:6px;
                   background:#25D366;
                   color:white;
                   font-weight:500;
                   border-radius:6px;
                   text-decoration:none;
                   padding:8px 0;
                   font-size:13px;
                   margin-top:8px;
                 ">
                  Contactar por WhatsApp
               </a>`
            : ""
        }
      </div>
    `;

    return {
      id: f._id,
      position: [f.posicion.lat, f.posicion.lng] as [number, number],
      popup: popupHtml,
      icon: crearIcono(),
    };
  });

  return (
    <div className="w-full max-w-6xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] mx-auto px-4">
      <MapContainer center={centroInicial} zoom={13} className="w-full h-full rounded-lg shadow-lg z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {ubicaciones.map((u) => (
          <Marker key={u.id} position={u.posicion} icon={crearIcono(() => onUbicacionClick?.(u))}>
            <Popup>{u.nombre}</Popup>
          </Marker>
        ))}

        <MarkerClusterGroup markers={fixerMarkers} />
        <ActualizarVista ubicacion={ubicacionSeleccionada} />
      </MapContainer>
    </div>
  );
}

