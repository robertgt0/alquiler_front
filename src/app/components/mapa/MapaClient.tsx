// src/app/components/mapa/MapaClient.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Ubicacion, Fixer } from "../../types";

const MapaComponent = dynamic(() => import("./mapa"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="h-[300px] sm:h-[350px] md:h-[500px] lg:h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-lg text-[#2a87ff]">Cargando mapa...</p>
      </div>
    </div>
  )
});

interface MapaClientProps {
  isLoggedIn: boolean;
  ubicaciones: Ubicacion[];
  fixers: Fixer[];
  ubicacionSeleccionada: Ubicacion | null;
  onUbicacionClick?: (ubicacion: Ubicacion) => void;
  onMarcadorAgregado?: (lat: number, lng: number) => void;
}

export default function MapaClient(props: MapaClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="h-[300px] sm:h-[350px] md:h-[500px] lg:h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-lg text-[#2a87ff]">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return <MapaComponent {...props} />;
}