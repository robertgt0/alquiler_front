// src/app/components/MapaWrapper.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import BuscadorUbicaciones from "./BuscadorUbicaciones";
import FixersHeader from "./FixersHeader";
import PermisoGeolocalizacion from "./PermisoGeolocalizacion";
import { Ubicacion, Fixer, UserLocation, UbicacionFromAPI } from "../../types";
import { UbicacionManager } from "./UbicacionManager";
import Mapa from "./MapaClient";

// Ubicación por defecto para cuando no hay geolocalización
const PLAZA_PRINCIPAL: Ubicacion = {
  id: 1,
  nombre: "Plaza 14 de Septiembre",
  posicion: [-17.394211, -66.156376] as [number, number],
};

// Interfaz para la estructura REAL de tu API
interface FixerFromAPI {
  _id: string;
  fixerId: string;
  userId: string;
  name: string;
  photoUrl: string;
  whatsapp: string;
  location?: { lat: number; lng: number };
  categories: string[];
  rating?: number;
  verified?: boolean;
  termsAccepted: boolean;
  jobsCount: number;
  ratingAvg: number;
  ratingCount: number;
  memberSince: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function MapaWrapper() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [fixers, setFixers] = useState<Fixer[]>([]);
  const [fixersFiltrados, setFixersFiltrados] = useState<Fixer[]>([]);

  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(PLAZA_PRINCIPAL);
  const [, setUserLocation] = useState<UserLocation | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permisoDecidido, setPermisoDecidido] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const ubicacionManager = UbicacionManager.getInstancia();
  const isInitialLoad = useRef(true);

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
        ubicacionManager.setUbicacion(PLAZA_PRINCIPAL);
        setUbicacionSeleccionada(PLAZA_PRINCIPAL);
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

  const cargarDatos = useCallback(async () => {
    if (isInitialLoad.current) {
      setCargando(true);
      setError(null);
    }

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

      if (!resUbicaciones.ok) {
        throw new Error(`Error al obtener ubicaciones: ${resUbicaciones.status} ${resUbicaciones.statusText}`);
      }

      if (!resFixers.ok) {
        throw new Error(`Error al obtener fixers: ${resFixers.status} ${resFixers.statusText}`);
      }

      const dataUbicaciones = await resUbicaciones.json();
      const dataFixers = await resFixers.json();

      console.log("✅ Backend conectado - Usando datos reales");

      // Transformar ubicaciones
      if (dataUbicaciones.success && Array.isArray(dataUbicaciones.data)) {
        const ubicacionesTransformadas: Ubicacion[] = dataUbicaciones.data.map(
          (item: UbicacionFromAPI, index: number) => ({
            id: index + 1,
            nombre: item.nombre,
            posicion: [item.posicion.lat, item.posicion.lng] as [number, number],
          })
        );
        setUbicaciones(ubicacionesTransformadas);
      }

      // TRANSFORMAR FIXERS - ESTA ES LA PARTE CLAVE CORREGIDA
      if (dataFixers.success && Array.isArray(dataFixers.data)) {
        const fixersTransformados: Fixer[] = dataFixers.data.map((fixer: FixerFromAPI) => {
          // Si no tiene ubicación, usar una por defecto en Cochabamba
          const posicionDefault = { lat: -17.3895, lng: -66.1568 };
          
          return {
            _id: fixer._id,
            nombre: fixer.name, // name → nombre
            posicion: fixer.location || posicionDefault, // location → posicion
            especialidad: fixer.categories?.join(', ') || 'Servicios generales', // categories → especialidad
            descripcion: `Profesional en ${fixer.categories?.join(', ') || 'servicios varios'}`, // Generar descripción
            rating: fixer.rating || 4.5, // rating se mantiene
            verified: fixer.verified || false, // verified se mantiene
            whatsapp: fixer.whatsapp, // whatsapp se mantiene
            imagenPerfil: fixer.photoUrl || '/imagenes_respaldo/perfil-default.jpg' // photoUrl → imagenPerfil
          };
        });
        
        console.log(`🔧 Fixers transformados: ${fixersTransformados.length}`);
        setFixers(fixersTransformados);
        const cercanos = ubicacionManager.filtrarFixersCercanos(fixersTransformados);
        setFixersFiltrados(cercanos);
      }

    } catch (error) {
      console.error("❌ Error conectando con el backend:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al conectar con el servidor";
      setError(errorMessage);
    } finally {
      setCargando(false);
      isInitialLoad.current = false;
    }
  }, [ubicacionManager]);

  useEffect(() => {
    if (!permisoDecidido) {
      ubicacionManager.setUbicacion(PLAZA_PRINCIPAL);
    }

    console.log("Ejecutando efecto de carga de datos...");
    cargarDatos();
  }, [permisoDecidido, ubicacionManager, cargarDatos]);

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

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg sm:text-xl font-bold text-[#2a87ff]">
          Cargando mapa y especialistas...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error de conexión</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={cargarDatos}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Reintentar conexión
          </button>
        </div>
      </div>
    );
  }

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