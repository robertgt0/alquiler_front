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
import React from "react";

interface IconDefaultWithPrivate extends L.Icon.Default {
  _getIconUrl?: () => void;
}

delete (L.Icon.Default.prototype as unknown as IconDefaultWithPrivate)._getIconUrl;

const blueMarkerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redMarkerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapaProps {
  isLoggedIn: boolean;
  ubicaciones: Ubicacion[];
  fixers: Fixer[];
  ubicacionSeleccionada: Ubicacion | null;
  onUbicacionClick?: (ubicacion: Ubicacion) => void;
  onMarcadorAgregado?: (lat: number, lng: number) => void;
}

// ✅ Componente para actualizar la vista según ubicación seleccionada
function ActualizarVista({ ubicacion }: { ubicacion: Ubicacion | null }) {
  const map = useMap();
  useEffect(() => {
    if (ubicacion) map.flyTo(ubicacion.posicion, 17, { duration: 2 });
  }, [ubicacion, map]);
  return null;
}

// ✅ NUEVO componente para manejar presión prolongada en el mapa (PC y móvil) - VERSIÓN COMPATIBLE
function LongPressHandler({ onLongPress }: { onLongPress: (lat: number, lng: number) => void }) {
  const map = useMap();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleContextMenu = (e: L.LeafletEvent) => {
      const leafletEvent = e as L.LeafletMouseEvent;
      onLongPress(leafletEvent.latlng.lat, leafletEvent.latlng.lng);
      map.flyTo([leafletEvent.latlng.lat, leafletEvent.latlng.lng], 16, { duration: 1 });
    };

    const handleMouseDown = (e: L.LeafletEvent) => {
      const leafletEvent = e as L.LeafletMouseEvent;
      timeoutRef.current = setTimeout(() => {
        onLongPress(leafletEvent.latlng.lat, leafletEvent.latlng.lng);
        map.flyTo([leafletEvent.latlng.lat, leafletEvent.latlng.lng], 16, { duration: 1 });
      }, 800);
    };

    const handleMouseUp = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    map.on('contextmenu', handleContextMenu);
    map.on('mousedown', handleMouseDown);
    map.on('mouseup', handleMouseUp);
    map.on('mouseout', handleMouseUp);

    return () => {
      map.off('contextmenu', handleContextMenu);
      map.off('mousedown', handleMouseDown);
      map.off('mouseup', handleMouseUp);
      map.off('mouseout', handleMouseUp);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [map, onLongPress]);

  return null;
}

// ✅ Componente principal del mapa
export default function Mapa({
  isLoggedIn,
  ubicaciones,
  fixers = [],
  ubicacionSeleccionada,
  onUbicacionClick,
  onMarcadorAgregado,
}: MapaProps) {
  const centroInicial: [number, number] = [-17.3895, -66.1568];
  const [marcadorPersonalizado, setMarcadorPersonalizado] = React.useState<[number, number] | null>(null);

  const crearIconoFixer = (onClick?: () => void) =>
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

    const especialidades =
      f.especialidad
        ?.split(",")
        .map(
          (esp) => `
          <span style="
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
      <div style="width:250px;font-family:'Inter',sans-serif;padding:8px;">
        <div style="display:flex;align-items:center;gap:10px;">
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
            <h3 style="margin:0;font-size:14px;color:#111827;display:flex;align-items:center;gap:5px;">
              ${f.nombre}
              ${f.verified ? '<span style="color:#2563eb;">✔️</span>' : ""}
            </h3>
            <p style="margin:2px 0 0 0;font-size:12px;color:#6b7280;">
              ⭐ ${f.rating || 4.9} 
              <span style="color:#9ca3af;">(${f.rating || "156 reseñas"})</span>
            </p>
          </div>
        </div>

        <p style="margin:8px 0 6px 0;font-size:12px;color:#374151;">
          ${f.descripcion || "Especialista en instalaciones domésticas"}
        </p>

        <div style="margin-bottom:8px;">${especialidades}</div>

        ${
          f.whatsapp && isLoggedIn
            ? `<a href="https://wa.me/${f.whatsapp.replace(
                /\D/g,
                ""
              )}?text=${encodeURIComponent(
                "Hola " +
                  f.nombre +
                  ", vi tu perfil en FixerMap y quiero más información."
              )}" target="_blank"
                style="display:flex;align-items:center;justify-content:center;gap:6px;
                background:#25D366;color:white;font-weight:500;border-radius:6px;
                text-decoration:none;padding:8px 0;font-size:13px;margin-top:8px;">
                Contactar por WhatsApp
              </a>`
            : f.whatsapp
            ? `<button onclick="window.location.href='/404'" 
                style="display:flex;align-items:center;justify-content:center;gap:6px;
                background:#25D366;color:white;font-weight:500;border-radius:6px;
                text-decoration:none;padding:8px 0;font-size:13px;margin-top:8px;border:none;cursor:pointer;width:100%">
                Contactar por WhatsApp
              </button>`
            : ""
        }
      </div>
    `;

    return {
      id: f._id,
      position: [f.posicion.lat, f.posicion.lng] as [number, number],
      popup: popupHtml,
      icon: crearIconoFixer(),
    };
  });

  // ✅ Maneja la presión prolongada
  const handleLongPress = (lat: number, lng: number) => {
    setMarcadorPersonalizado([lat, lng]);
    if (onMarcadorAgregado) {
      onMarcadorAgregado(lat, lng);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="h-[300px] sm:h-[350px] md:h-[500px] lg:h-[400px] relative">
        <MapContainer
          center={centroInicial}
          zoom={13}
          className="w-full h-full rounded-lg shadow-lg z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {ubicacionSeleccionada && (
            <Marker
              position={ubicacionSeleccionada.posicion}
              icon={blueMarkerIcon}
              eventHandlers={{
                click: () => onUbicacionClick?.(ubicacionSeleccionada),
              }}
            >
              <Popup>{ubicacionSeleccionada.nombre}</Popup>
            </Marker>
          )}

          {marcadorPersonalizado && (
            <Marker position={marcadorPersonalizado} icon={redMarkerIcon}>
              <Popup>📍 Ubicación seleccionada</Popup>
            </Marker>
          )}

          <MarkerClusterGroup markers={fixerMarkers} color="#1366fd" />
          <ActualizarVista ubicacion={ubicacionSeleccionada} />
          <LongPressHandler onLongPress={handleLongPress} />
        </MapContainer>

        {/* ✅ Contador SOBRE el mapa - Solo en PC/Tablet - Z-INDEX CORREGIDO */}
        <div className="absolute top-3 right-3 hidden sm:block z-[5]"> {/* z-[5] más bajo que header */}
          {fixers.length > 0 ? (
            <div
              style={{
                backgroundColor: "#e0f2fe",
                color: "#0c4a6e",
                padding: "6px 12px",
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "14px",
                whiteSpace: "nowrap",
                border: "1px solid #bae6fd",
              }}
            >
              <strong style={{ fontWeight: "bold" }}>{fixers.length}</strong>{" "}
              Fixers Activos
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#ffedd5",
                color: "#9a3412",
                padding: "6px 12px",
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "14px",
                whiteSpace: "nowrap",
                border: "1px solid #fed7aa",
              }}
            >
              ¡No hay fixers cerca!
            </div>
          )}
        </div>
      </div>

      {/* ✅ Contador DEBAJO del mapa - Solo en móvil */}
      <div className="mt-2 text-center block sm:hidden">
        {fixers.length > 0 ? (
          <div
            style={{
              backgroundColor: "#e0f2fe",
              color: "#0c4a6e",
              padding: "6px 12px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              fontSize: "14px",
              display: "inline-block",
            }}
          >
            <strong style={{ fontWeight: "bold" }}>{fixers.length}</strong>{" "}
            Fixers Activos
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#ffedd5",
              color: "#9a3412",
              padding: "6px 12px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              fontSize: "14px",
              display: "inline-block",
            }}
          >
            ¡No hay fixers cerca!
          </div>
        )}
      </div>
    </div>
  );
}