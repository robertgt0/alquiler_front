// src/app/components/MapaWrapper.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import BuscadorUbicaciones from "./BuscadorUbicaciones";
import FixersHeader from "./FixersHeader";
import PermisoGeolocalizacion from "./PermisoGeolocalizacion";
import { Ubicacion, Fixer, UserLocation, UbicacionFromAPI } from "../../types";
import { UbicacionManager } from "./UbicacionManager";
import { ubicacionesRespaldo, fixersRespaldo, fixersDefinidos } from "../data/fixersData";

const Mapa = dynamic(() => import("./mapa"), { ssr: false });

export default function MapaWrapper() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [fixers, setFixers] = useState<Fixer[]>([]);
  const [fixersFiltrados, setFixersFiltrados] = useState<Fixer[]>([]);

  const [ubicacionSeleccionada, setUbicacionSeleccionada] =
    useState<Ubicacion | null>(ubicacionesRespaldo[0]);

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [cargando, setCargando] = useState(true);

  const [permisoDecidido, setPermisoDecidido] = useState(false);
  const [usandoRespaldo, setUsandoRespaldo] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const ubicacionManager = UbicacionManager.getInstancia();

  const obtenerUbicacion = useCallback(() => {
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
        setPermisoDecidido(true);
      },
      () => {
        console.log("Ubicación rechazada - Enfocando en Plaza Principal");
        ubicacionManager.setUbicacion(ubicacionesRespaldo[0]);
        setUbicacionSeleccionada(ubicacionesRespaldo[0]);
        setUserLocation(null);
        setPermisoDecidido(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [ubicacionManager]);

  useEffect(() => {
    const handleSolicitarGeo = () => {
      console.log("Evento 'solicitar-geolocalizacion' recibido. Pidiendo ubicación...");
      obtenerUbicacion();
    };

    const handleLoginExitoso = () => {
      setIsLoggedIn(true);
    };

    window.addEventListener("solicitar-geolocalizacion", handleSolicitarGeo);
    window.addEventListener("login-exitoso", handleLoginExitoso);

    return () => {
      window.removeEventListener("solicitar-geolocalizacion", handleSolicitarGeo);
      window.removeEventListener("login-exitoso", handleLoginExitoso);
    };
  }, [obtenerUbicacion]);

  useEffect(() => {
    if (!permisoDecidido) {
      ubicacionManager.setUbicacion(ubicacionesRespaldo[0]);
    }

    const cargarDatos = async () => {
      try {
        console.log("🔄 Intentando conectar con el backend...");

        const [resUbicaciones, resFixers] = await Promise.all([
          fetch("http://localhost:5000/api/ubicaciones", {
            signal: AbortSignal.timeout(5000),
          }),
          fetch("http://localhost:5000/api/fixers", {
            signal: AbortSignal.timeout(5000),
          }),
        ]);

        if (resUbicaciones.ok && resFixers.ok) {
          const dataUbicaciones = await resUbicaciones.json();
          const dataFixers = await resFixers.json();

          console.log("✅ Backend conectado - Usando datos reales");

          if (dataUbicaciones.success) {
            const ubicacionesTransformadas: Ubicacion[] =
              dataUbicaciones.data.map(
                (item: UbicacionFromAPI, index: number) => ({
                  id: index + 1,
                  nombre: item.nombre,
                  posicion: [item.posicion.lat, item.posicion.lng] as [number, number],
                })
              );
            setUbicaciones(ubicacionesTransformadas);
          }

          if (dataFixers.success) {
            // ✅ SOLO AQUÍ procesamos las imágenes
            const fixersConImagen: Fixer[] = dataFixers.data.map((fixer: Fixer) => ({
              ...fixer,
              imagenPerfil: fixer.imagenPerfil || "/imagenes_respaldo/perfil-default.jpg"
            }));
            
            setFixers(fixersConImagen);
            const cercanos = ubicacionManager.filtrarFixersCercanos(fixersConImagen);
            setFixersFiltrados(cercanos);
          }

          setUsandoRespaldo(false);
        } else {
          throw new Error("Error en respuesta del servidor");
        }
      } catch (error) {
        console.log("❌ Backend no disponible - Usando datos de respaldo", error);

        // ✅ Aplicar mismo procesamiento a datos de respaldo
        const todosLosFixers: Fixer[] = [...fixersRespaldo, ...fixersDefinidos].map(fixer => ({
          ...fixer,
          imagenPerfil: fixer.imagenPerfil || "/imagenes_respaldo/imagen2.jpg"
        }));
        
        setUbicaciones(ubicacionesRespaldo);
        setFixers(todosLosFixers);
        setUsandoRespaldo(true);

        const cercanos = ubicacionManager.filtrarFixersCercanos(todosLosFixers);
        setFixersFiltrados(cercanos);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [userLocation, permisoDecidido, ubicacionManager]);

  const handleMarcadorAgregado = (lat: number, lng: number) => {
    const nuevaUbicacion: Ubicacion = {
      id: Date.now(),
      nombre: "📍 Ubicación seleccionada",
      posicion: [lat, lng] as [number, number],
    };

    ubicacionManager.setUbicacion(nuevaUbicacion);
    const cercanos = ubicacionManager.filtrarFixersCercanos(fixers);
    setFixersFiltrados(cercanos);
    setUbicacionSeleccionada(nuevaUbicacion);
  };

  if (cargando)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg sm:text-xl font-bold text-[#2a87ff]">
          Cargando mapa y especialistas...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col items-center">
      {usandoRespaldo && (
        <div className="w-full max-w-6xl px-4 mb-4">
          {/* Mensaje de respaldo si es necesario */}
        </div>
      )}

      <BuscadorUbicaciones
        ubicaciones={ubicaciones}
        onBuscar={(u) => {
          setUbicacionSeleccionada(u);
          ubicacionManager.setUbicacion(u);
          const cercanos = ubicacionManager.filtrarFixersCercanos(fixers);
          setFixersFiltrados(cercanos);
        }}
        ubicacionActual={ubicacionSeleccionada}
      />
      <FixersHeader />

      <Mapa
        isLoggedIn={isLoggedIn}
        ubicaciones={ubicaciones}
        fixers={fixersFiltrados}
        ubicacionSeleccionada={ubicacionSeleccionada}
        onUbicacionClick={(u) => {
          setUbicacionSeleccionada(u);
          ubicacionManager.setUbicacion(u);
          const cercanos = ubicacionManager.filtrarFixersCercanos(fixers);
          setFixersFiltrados(cercanos);
        }}
        onMarcadorAgregado={handleMarcadorAgregado}
      />

      <PermisoGeolocalizacion isLoggedIn={isLoggedIn} />
    </div>
  );
}