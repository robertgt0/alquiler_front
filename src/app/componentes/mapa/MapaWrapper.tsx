// components/MapaWeapper.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import BuscadorUbicaciones from "./BuscadorUbicaciones";
import FixersHeader from "./FixersHeader";
import { Ubicacion, Fixer, UserLocation, UbicacionFromAPI } from "../../types";
import { UbicacionManager } from "./UbicacionManager"; // ✅ import correcto

const Mapa = dynamic(() => import("./mapa"), { ssr: false });

export default function MapaWrapper() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [fixers, setFixers] = useState<Fixer[]>([]);
  const [fixersFiltrados, setFixersFiltrados] = useState<Fixer[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarSenalizacion, setMostrarSenalizacion] = useState(false);
  const [permisoDecidido, setPermisoDecidido] = useState(false);

  const ubicacionManager = UbicacionManager.getInstancia();

  // 📍 Obtener ubicación del usuario
  useEffect(() => {
    const obtenerUbicacion = () => {
      if (!navigator.geolocation) {
        console.log("Geolocalización no soportada");
        setPermisoDecidido(true);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const nuevaUbicacion: UserLocation = {
            lat: latitude,
            lng: longitude,
            accuracy,
            timestamp: position.timestamp
          };
          setUserLocation(nuevaUbicacion);

          const ubicacionTemporal: Ubicacion = {
            id: 999,
            nombre: "📍 Mi ubicación actual",
            posicion: [latitude, longitude] as [number, number]
          };

          // ✅ Guardamos la ubicación en UbicacionManager
          ubicacionManager.setUbicacion(ubicacionTemporal);

          setUbicacionSeleccionada(ubicacionTemporal);
          setMostrarSenalizacion(true);
          setPermisoDecidido(true);
          setTimeout(() => setMostrarSenalizacion(false), 3000);
        },
        () => {
          console.log("Ubicación rechazada - Enfocando en Plaza Principal");
          setPermisoDecidido(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    };

    obtenerUbicacion();
  }, []);

  // 🌐 Cargar ubicaciones y fixers
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resUbicaciones, resFixers] = await Promise.all([
          fetch("http://localhost:5000/api/ubicaciones"),
          fetch("http://localhost:5000/api/fixers"),
        ]);

        if (resUbicaciones.ok) {
          const data = await resUbicaciones.json();
          if (data.success) {
            const ubicacionesTransformadas: Ubicacion[] = data.data.map(
              (item: UbicacionFromAPI, index: number) => ({
                id: index + 1,
                nombre: item.nombre,
                posicion: [item.posicion.lat, item.posicion.lng] as [number, number],
              })
            );
            setUbicaciones(ubicacionesTransformadas);

            if (permisoDecidido && !userLocation) {
              const plaza = ubicacionesTransformadas.find(
                (u) => u.nombre === "Plaza 14 de Septiembre"
              );
              if (plaza) {
                ubicacionManager.setUbicacion(plaza);
                setUbicacionSeleccionada(plaza);
              }
            }
          }
        }

        if (resFixers.ok) {
          const data = await resFixers.json();
          if (data.success) {
            setFixers(data.data);

            // ✅ Filtrar automáticamente los fixers cercanos
            const cercanos = ubicacionManager.filtrarFixersCercanos(data.data);
            setFixersFiltrados(cercanos);
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        const respaldo: Ubicacion[] = [
          { id: 1, nombre: "Plaza 14 de Septiembre", posicion: [-17.394211, -66.156376] },
          { id: 2, nombre: "Cristo de la Concordia", posicion: [-17.383807, -66.134948] },
        ];
        setUbicaciones(respaldo);
        setFixers([]);
        ubicacionManager.setUbicacion(respaldo[0]);
        if (permisoDecidido && !userLocation) setUbicacionSeleccionada(respaldo[0]);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [userLocation, permisoDecidido]);

  if (cargando)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Cargando mapa y especialistas...
      </div>
    );

  const estaEnPlazaPrincipal = ubicacionSeleccionada?.nombre === "Plaza 14 de Septiembre";

  return (
    <div className="flex flex-col items-center">
      <BuscadorUbicaciones
        ubicaciones={ubicaciones}
        onBuscar={(u) => {
          setUbicacionSeleccionada(u);
          ubicacionManager.setUbicacion(u);
          const cercanos = ubicacionManager.filtrarFixersCercanos(fixers);
          setFixersFiltrados(cercanos);
        }}
      />
      <FixersHeader />

      <div className="mt-4 text-sm text-gray-600">
        📍 {ubicaciones.length} ubicaciones | 🔧 {fixersFiltrados.length} especialistas cerca
        {userLocation ? (
          <span className="ml-2 text-green-600">• 🎯 Ubicación detectada</span>
        ) : permisoDecidido ? (
          <span className="ml-2 text-blue-600">• 🏛️ Vista general</span>
        ) : (
          <span className="ml-2 text-gray-500">• ⏳ Esperando decisión de ubicación...</span>
        )}
      </div>

      {/* ✅ Mostrar el mapa solo con los fixers cercanos */}
      <Mapa
        ubicaciones={ubicaciones}
        fixers={fixersFiltrados}
        ubicacionSeleccionada={ubicacionSeleccionada}
        onUbicacionClick={(u) => {
          setUbicacionSeleccionada(u);
          ubicacionManager.setUbicacion(u);
          const cercanos = ubicacionManager.filtrarFixersCercanos(fixers);
          setFixersFiltrados(cercanos);
        }}
      />

      {/* ✅ Mensaje si no hay fixers cercanos */}
      {fixersFiltrados.length === 0 && permisoDecidido && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">No se encontraron fixers a la redonda (10 km)</p>
              {ubicacionSeleccionada && (
                <p className="text-sm text-yellow-700">
                  {ubicacionSeleccionada.nombre}: {ubicacionSeleccionada.posicion[0].toFixed(4)},{" "}
                  {ubicacionSeleccionada.posicion[1].toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Mensajes visuales existentes */}
      {mostrarSenalizacion && userLocation && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <span className="text-lg">📍</span>
            <div>
              <p className="font-semibold">Enfocando en tu ubicación actual</p>
              <p className="text-sm text-green-600">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {estaEnPlazaPrincipal && !userLocation && permisoDecidido && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <span className="text-lg">🏛️</span>
            <div>
              <p className="font-semibold">Vista de Plaza 14 de Septiembre</p>
              <p className="text-sm text-blue-600">Centro de Cochabamba</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

