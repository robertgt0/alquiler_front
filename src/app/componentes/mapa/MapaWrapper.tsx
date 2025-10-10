"use client";

import { useState, useEffect } from "react";
import type { Ubicacion } from "./mapa";
import dynamic from "next/dynamic";
import BuscadorUbicaciones from "./BuscadorUbicaciones";
import FixersHeader from "./FixersHeader";

// Importar mapa dinámicamente para evitar SSR
const Mapa = dynamic(() => import("./mapa"), { ssr: false });

// Define el tipo para los datos que vienen de la API
interface UbicacionFromAPI {
  _id: string;
  nombre: string;
  posicion: {
    lat: number;
    lng: number;
  };
  direccion?: string;
  tipo?: string;
}

interface ApiResponse {
  success: boolean;
  data: UbicacionFromAPI[];
  count: number;
}

export default function MapaWrapper() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUbicaciones = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ubicaciones');
        if (response.ok) {
          const data: ApiResponse = await response.json();
          if (data.success) {
            // Transformar datos de MongoDB al formato del componente
            const ubicacionesTransformadas: Ubicacion[] = data.data.map((item: UbicacionFromAPI, index: number) => ({
              id: index + 1, // Usar números secuenciales como antes
              nombre: item.nombre,
              posicion: [item.posicion.lat, item.posicion.lng] as [number, number],
              direccion: item.direccion || '',
              tipo: item.tipo || 'punto-interes'
            }));
            setUbicaciones(ubicacionesTransformadas);
          }
        }
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
        // Si hay error, usar datos locales de respaldo
        setUbicaciones([
          { id: 1, nombre: "Plaza 14 de Septiembre", posicion: [-17.394211, -66.156376] },
          { id: 2, nombre: "Cristo de la Concordia", posicion: [-17.383807, -66.134948] },
          { id: 3, nombre: "Universidad Mayor de San Simón", posicion: [-17.3933727, -66.1449641] },
          { id: 4, nombre: "Plaza Sucre", posicion: [-17.39224, -66.14805] },
          { id: 5, nombre: "Estadio Félix Capriles", posicion: [-17.379303, -66.16183] },
        ]);
      } finally {
        setCargando(false);
      }
    };

    cargarUbicaciones();
  }, []);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg">Cargando ubicaciones desde la base de datos...</div>
      </div>
    );
  }

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