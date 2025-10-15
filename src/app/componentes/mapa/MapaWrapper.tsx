"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import BuscadorUbicaciones from "./BuscadorUbicaciones";
import FixersHeader from "./FixersHeader";
import { Ubicacion, Fixer, UserLocation, UbicacionFromAPI } from "../../types";
import { UbicacionManager } from "./UbicacionManager";

const Mapa = dynamic(() => import("./mapa"), { ssr: false });

export default function MapaWrapper() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [fixers, setFixers] = useState<Fixer[]>([]);
  const [fixersFiltrados, setFixersFiltrados] = useState<Fixer[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] =
    useState<Ubicacion | null>(null);
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
            timestamp: position.timestamp,
          };
          setUserLocation(nuevaUbicacion);

          const ubicacionTemporal: Ubicacion = {
            id: 999,
            nombre: "📍 Mi ubicación actual",
            posicion: [latitude, longitude] as [number, number],
          };

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
          maximumAge: 60000,
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
                posicion: [item.posicion.lat, item.posicion.lng] as [
                  number,
                  number
                ],
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
            const cercanos = ubicacionManager.filtrarFixersCercanos(data.data);
            setFixersFiltrados(cercanos);
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        const respaldo: Ubicacion[] = [
          {
            id: 1,
            nombre: "Plaza 14 de Septiembre",
            posicion: [-17.394211, -66.156376],
          },
          {
            id: 2,
            nombre: "Cristo de la Concordia",
            posicion: [-17.383807, -66.134948],
          },
        ];
        setUbicaciones(respaldo);
        setFixers([]);
        ubicacionManager.setUbicacion(respaldo[0]);
        if (permisoDecidido && !userLocation)
          setUbicacionSeleccionada(respaldo[0]);
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

  return (
    <div className="flex flex-col items-center w-full">
      {/* ✅ BUSCADOR con ancho limitado */}
      <div className="w-full max-w-6xl mx-auto px-4">
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
      </div>

      {/* ✅ MAPA con ancho completo */}
      <div className="w-full">
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
      </div>
    </div>
  );
}