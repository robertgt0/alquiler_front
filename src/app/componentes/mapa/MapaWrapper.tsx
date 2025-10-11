// components/MapaWeapper.tsx

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import BuscadorUbicaciones from "./BuscadorUbicaciones";
import FixersHeader from "./FixersHeader";
import { Ubicacion, Fixer } from "../../types";

const Mapa = dynamic(() => import("./mapa"), { ssr: false });

export default function MapaWrapper() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [fixers, setFixers] = useState<Fixer[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [responseUbicaciones, responseFixers] = await Promise.all([
          fetch('http://localhost:5000/api/ubicaciones'),
          fetch('http://localhost:5000/api/fixers')
        ]);

        if (responseUbicaciones.ok) {
          const dataUbicaciones = await responseUbicaciones.json();
          if (dataUbicaciones.success) {
            const ubicacionesTransformadas: Ubicacion[] = dataUbicaciones.data.map((item: any, index: number) => ({
              id: index + 1,
              nombre: item.nombre,
              posicion: [item.posicion.lat, item.posicion.lng] as [number, number],
            }));
            setUbicaciones(ubicacionesTransformadas);
          }
        }

        if (responseFixers.ok) {
          const dataFixers = await responseFixers.json();
          if (dataFixers.success) setFixers(dataFixers.data);
        }

      } catch (error) {
        console.error('Error al cargar datos:', error);
        setUbicaciones([
          { id: 1, nombre: "Plaza 14 de Septiembre", posicion: [-17.394211, -66.156376] },
          { id: 2, nombre: "Cristo de la Concordia", posicion: [-17.383807, -66.134948] },
        ]);
        setFixers([]);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) return <div className="flex flex-col items-center justify-center min-h-screen">Cargando mapa y especialistas...</div>;

  return (
    <div className="flex flex-col items-center">
      <BuscadorUbicaciones ubicaciones={ubicaciones} onBuscar={(u) => setUbicacionSeleccionada(u)} />
      <FixersHeader />
      
      <Mapa
        ubicaciones={ubicaciones}
        fixers={fixers}
        ubicacionSeleccionada={ubicacionSeleccionada}
        onUbicacionClick={(u) => setUbicacionSeleccionada(u)}
      />
      
      <div className="mt-4 text-sm text-gray-600">
        📍 {ubicaciones.length} ubicaciones | 🔧 {fixers.length} especialistas
      </div>
    </div>
  );
}
