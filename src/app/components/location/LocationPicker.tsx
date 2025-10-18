"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LocationDTO } from "@/types/fixer";

// Carga del mapa sin SSR
const MapCanvas = dynamic(() => import("./MapCanvas"), { ssr: false });

export function LocationPicker({
  initial, onConfirm, onCancel
}: { initial?: LocationDTO; onConfirm: (l: LocationDTO)=>void; onCancel: ()=>void }) {

  const [loc, setLoc] = useState<LocationDTO>(initial ?? { lat: 37.7749, lng: -122.4194 });
  const [address, setAddress] = useState<string>("");

  // Detecta ubicación inicial del navegador
  useEffect(() => {
    if (!initial && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p =>
        setLoc({ lat: p.coords.latitude, lng: p.coords.longitude })
      );
    }
  }, [initial]);

  // 🔄 Cada vez que cambia el punto, busca dirección
  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`
        );
        const data = await res.json();
        if (data?.display_name) setAddress(data.display_name);
      } catch (err) {
        setAddress("");
      }
    }
    fetchAddress();
  }, [loc.lat, loc.lng]);

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[min(900px,95vw)] p-5 space-y-4">
        <h3 className="text-xl font-semibold">Selecciona tu ubicación</h3>

        {/* Mapa */}
        <MapCanvas center={[loc.lat, loc.lng]} onChange={(lat,lng)=> setLoc({ ...loc, lat, lng })}/>

        {/* Dirección actual */}
        <div className="text-sm text-gray-700 mt-2">
          {address ? (
            <>📍 <b>Dirección aproximada:</b> {address}</>
          ) : (
            "Buscando dirección..."
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded" onClick={onCancel}>Cancelar</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={()=> onConfirm({ ...loc, address })}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
