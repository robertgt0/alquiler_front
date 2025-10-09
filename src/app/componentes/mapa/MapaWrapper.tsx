// components/MapaWeapper.tsx

"use client";

import { useState } from "react";
import type { Ubicacion } from "./mapa";
import dynamic from "next/dynamic";
import BuscadorUbicaciones from "./BuscadorUbicaciones";
import FixersHeader from "./FixersHeader";

// Importar mapa dinámicamente para evitar SSR
const Mapa = dynamic(() => import("./mapa"), { ssr: false });

export default function MapaWrapper() {
  const ubicaciones: Ubicacion[] = [
    { id: 1, nombre: "Plaza 14 de Septiembre", posicion: [-17.394211, -66.156376] },
    { id: 2, nombre: "Cristo de la Concordia", posicion: [-17.383807, -66.134948] },
    { id: 3, nombre: "Universidad Mayor de San Simón", posicion: [-17.3933727, -66.1449641] },
    { id: 4, nombre: "Plaza Sucre", posicion: [-17.39224, -66.14805] },
    { id: 5, nombre: "Estadio Félix Capriles", posicion: [-17.379303, -66.16183] },
  ];


  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(null);

  return (
    
    <div className="flex flex-col items-center">
      <BuscadorUbicaciones
        ubicaciones={ubicaciones}
        onBuscar={(u) => setUbicacionSeleccionada(u)}
      />
       <FixersHeader />
      <Mapa
        ubicaciones={ubicaciones}
        ubicacionSeleccionada={ubicacionSeleccionada}
        onUbicacionClick={(u) => setUbicacionSeleccionada(u)}
      />
    </div>
  );
}
