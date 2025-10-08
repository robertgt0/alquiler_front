"use client";

import { useState } from "react";
import type { Ubicacion } from "./mapa";
import dynamic from "next/dynamic";
import BuscadorUbicaciones from "./BuscadorUbicaciones";

// Importar mapa dinámicamente para evitar SSR
const Mapa = dynamic(() => import("./mapa"), { ssr: false });

export default function MapaWrapper() {
  const ubicaciones: Ubicacion[] = [
    { id: 1, nombre: "Plaza 14 de Septiembre", posicion: [-17.3936, -66.1569] },
    { id: 2, nombre: "Cristo de la Concordia", posicion: [-17.3825, -66.1456] },
    { id: 3, nombre: "Universidad Mayor de San Simón", posicion: [-17.3941, -66.1519] },
    { id: 4, nombre: "Plaza Sucre", posicion: [-17.3897, -66.1614] },
    { id: 5, nombre: "Estadio Félix Capriles", posicion: [-17.4025, -66.1417] },
  ];

  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(null);

  return (
    <div className="flex flex-col items-center">
      <BuscadorUbicaciones
        ubicaciones={ubicaciones}
        onBuscar={(u) => setUbicacionSeleccionada(u)}
      />
      <Mapa
        ubicaciones={ubicaciones}
        ubicacionSeleccionada={ubicacionSeleccionada}
        onUbicacionClick={(u) => setUbicacionSeleccionada(u)}
      />
    </div>
  );
}