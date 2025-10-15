// components/mapa/mapa.tsx

"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import ReactDOM from "react-dom/client"; // MODIFICADO: Importamos ReactDOM para React 18+
import ReactDOMServer from "react-dom/server";
import UbicacionIcon from "./UbicacionIcon";
import MarkerClusterGroup from "./MarkerClusterGroup";
import { Fixer } from "./FixerPopup";
import { Ubicacion } from "../../types";

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

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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
    if (ubicacion) map.flyTo(ubicacion.posicion, 17, { duration: 2 });
  }, [ubicacion, map]);
  return null;
}

// ==================================================================
// ✅ NUEVO COMPONENTE PARA MOSTRAR EL CONTADOR DE FIXERS
// ==================================================================
function FixerCountControl({ fixerCount }: { fixerCount: number }) {
  const map = useMap();

  useEffect(() => {
    // Creamos una clase para el control personalizado
    const FixerCounter = L.Control.extend({
      onAdd: function () {
        // Creamos el contenedor del DOM para nuestro contador
        const div = L.DomUtil.create("div", "fixer-counter-control");
        // Evitamos que los clics en el contador se propaguen al mapa
        L.DomEvent.disableClickPropagation(div);
        return div;
      },
    });

    const control = new FixerCounter({ position: "topright" });
    control.addTo(map);

    // Renderizamos nuestro componente React dentro del contenedor del control
    const controlContainer = control.getContainer();
    if (controlContainer) {
      const message =
        fixerCount > 0 ? (
          <div style={{ backgroundColor: '#e0f2fe', color: '#0c4a6e', padding: '6px 12px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: '14px', whiteSpace: 'nowrap' }}>
            <strong style={{ fontWeight: 'bold' }}>{fixerCount}</strong> Fixers Activos
          </div>
        ) : (
          <div style={{ backgroundColor: '#ffedd5', color: '#9a3412', padding: '6px 12px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: '14px', whiteSpace: 'nowrap' }}>
            ¡No hay fixers cerca!
          </div>
        );
      ReactDOM.createRoot(controlContainer).render(message);
    }

    // Función de limpieza para eliminar el control cuando el componente se desmonte
    return () => {
      map.removeControl(control);
    };
  }, [map, fixerCount]); // Se vuelve a ejecutar si el mapa o el contador cambian

  return null; // Este componente no renderiza nada directamente en el DOM de React
}

export default function Mapa({
  ubicaciones,
  fixers = [],
  ubicacionSeleccionada,
  onUbicacionClick,
}: MapaProps) {
  const centroInicial: [number, number] = [-17.3895, -66.1568];

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
              <span style="color:#9ca3af;">(${
                f.rating || "156 reseñas"
              })</span>
            </p>
          </div>
        </div>

        <p style="margin:8px 0 6px 0;font-size:12px;color:#374151;">
          ${f.descripcion || "Especialista en instalaciones domésticas"}
        </p>

        <div style="margin-bottom:8px;">${especialidades}</div>

        ${
          f.whatsapp
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

  return (
    <div className="
    w-full 
    h-[300px]       /* <640px */
    max-w-[1000px]

    sm:h-[400px]    /* ≥640px */
    sm:max-w-[800px]

    md:h-[500px]    /* ≥768px */
    md:max-w-[1000px]

    lg:h-[400px]    /* ≥1024px */
    lg:max-w-[1000px]">
      <MapContainer
        center={centroInicial}
        zoom={13}
        className="w-full h-full rounded-lg shadow-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔵 Solo muestra una ubicación azul: la seleccionada */}
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

        {/* 🔧 Fixers con icono personalizado */}
        <MarkerClusterGroup markers={fixerMarkers} color="#1366fd" />

        {/* 🔁 Centra vista al seleccionar */}
        <ActualizarVista ubicacion={ubicacionSeleccionada} />

        {/* ✅ MODIFICADO: Añadimos el nuevo control al mapa */}
        <FixerCountControl fixerCount={fixers.length} />
      </MapContainer>
    </div>
  );
}