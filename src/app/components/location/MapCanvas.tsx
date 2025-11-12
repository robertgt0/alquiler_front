"use client";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});

export default function MapCanvas({
  center, onChange
}: { center: [number, number]; onChange: (lat:number, lng:number)=>void }) {
  function Events() {
    useMapEvents({
      click(e) { onChange(e.latlng.lat, e.latlng.lng); },
    });
    return null;
  }

  return (
    <MapContainer center={center} zoom={13} style={{ height: 380, width: "100%", borderRadius: 12 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <Events/>
      {/* 🔵 Círculo de 1 km de radio */}
      <Circle center={center} radius={1000} color="blue" />
      {/* 📍 Marcador draggable */}
      <Marker position={center} draggable icon={icon}
        eventHandlers={{
          dragend: (e:any)=>{ 
            const p=e.target.getLatLng(); 
            onChange(p.lat,p.lng);
          }
        }}
      />
    </MapContainer>
  );
}
