// components/MapaWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import BuscadorUbicaciones from "./BuscadorUbicaciones";
import FixersHeader from "./FixersHeader";
import { Ubicacion, Fixer, UserLocation, UbicacionFromAPI } from "../../types";
import { UbicacionManager } from "./UbicacionManager";

const Mapa = dynamic(() => import("./mapa"), { ssr: false });

// 📍 DATOS DE RESPUESTA PARA UBICACIONES
const ubicacionesRespaldo: Ubicacion[] = [
  {
    id: 1,
    nombre: "Plaza 14 de Septiembre",
    posicion: [-17.394211, -66.156376] as [number, number],
  },
  {
    id: 2,
    nombre: "Cristo de la Concordia",
    posicion: [-17.383807, -66.134948] as [number, number],
  },
  {
    id: 3,
    nombre: "Universidad Mayor de San Simón",
    posicion: [-17.3933727, -66.1449641] as [number, number],
  },
  {
    id: 4,
    nombre: "Plaza Sucre",
    posicion: [-17.39224, -66.14805] as [number, number],
  },
  {
    id: 5,
    nombre: "Estadio Félix Capriles",
    posicion: [-17.379303, -66.16183] as [number, number],
  },
  {
    id: 6,
    nombre: "Terminal de Buses Cochabamba",
    posicion: [-17.3935, -66.1638] as [number, number],
  },
  {
    id: 7,
    nombre: "Sipe Sipe",
    posicion: [-17.453156738905427, -66.35647723119858] as [number, number],
  }
];

// 🔧 DATOS DE RESPUESTA PARA FIXERS
const fixersRespaldo: Fixer[] = [
  {
    _id: "1",
    nombre: "Juan Pérez",
    posicion: { lat: -17.394211, lng: -66.156376 },
    especialidad: "Plomería, Electricidad",
    descripcion: "Especialista en reparaciones domésticas",
    rating: 4.8,
    verified: true,
    whatsapp: "+59112345678"
  },
  {
    _id: "2",
    nombre: "María García",
    posicion: { lat: -17.383807, lng: -66.134948 },
    especialidad: "Carpintería, Pintura",
    descripcion: "Profesional en renovaciones de hogar",
    rating: 4.9,
    verified: true,
    whatsapp: "+59187654321"
  },
  {
    _id: "3",
    nombre: "Carlos López",
    posicion: { lat: -17.3933727, lng: -66.1449641 },
    especialidad: "Instalaciones, Gasfitería",
    descripcion: "Técnico certificado en instalaciones",
    rating: 4.7,
    verified: false,
    whatsapp: "+59155556666"
  }
];

// 🧰 DATOS ADICIONALES DE FIXERS PREDEFINIDOS (con _id agregado)
export const fixersDefinidos: Fixer[] = [
  {
    _id: "4",
    nombre: "Juan Pérez - Electricista",
    posicion: { lat: -17.39224, lng: -66.14805 },
    especialidad: "Electricidad",
    descripcion: "Especialista en instalaciones eléctricas residenciales e industriales",
    rating: 4.8,
    whatsapp: "+59164893768",
    verified: true
  },
  {
    _id: "5",
    nombre: "María López - Plomera",
    posicion: { lat: -17.394211, lng: -66.156376 },
    especialidad: "Plomería",
    descripcion: "Reparación de tuberías, instalaciones sanitarias y gasfitería",
    rating: 4.6,
    whatsapp: "+59179876543",
    verified: true
  },
  {
    _id: "6",
    nombre: "Carlos García - Pintor",
    posicion: { lat: -17.3933727, lng: -66.1449641 },
    especialidad: "Pintura",
    descripcion: "Pintura interior y exterior, preparación de superficies, texturizados",
    rating: 4.7,
    whatsapp: "+59177966624",
    verified: true
  },
  {
    _id: "7",
    nombre: "Ana Torres - Gasista",
    posicion: { lat: -17.3910, lng: -66.1500 },
    especialidad: "Gas",
    descripcion: "Instalación y reparación de sistemas de gas natural y envasado",
    rating: 4.9,
    whatsapp: "+59170234567",
    verified: false
  },
  {
    _id: "8",
    nombre: "Luis Fernández - Carpintero",
    posicion: { lat: -17.3950, lng: -66.1520 },
    especialidad: "Carpintería",
    descripcion: "Muebles a medida, reparaciones en madera, instalación de closets",
    rating: 4.5,
    whatsapp: "+59170345678",
    verified: true
  },
  {
    _id: "9",
    nombre: "Roberto Silva - Cerrajero",
    posicion: { lat: -17.3895, lng: -66.1490 },
    especialidad: "Cerrajería",
    descripcion: "Apertura de puertas, cambio de cerraduras, sistemas de seguridad",
    rating: 4.8,
    whatsapp: "+59170456789",
    verified: true
  },
  {
    _id: "10",
    nombre: "Sofía Mendoza - Jardinería",
    posicion: { lat: -17.3960, lng: -66.1470 },
    especialidad: "Jardinería",
    descripcion: "Diseño de jardines, poda de árboles, mantenimiento de áreas verdes",
    rating: 4.4,
    whatsapp: "+59170567890",
    verified: false
  }
];

export default function MapaWrapper() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [fixers, setFixers] = useState<Fixer[]>([]);
  const [fixersFiltrados, setFixersFiltrados] = useState<Fixer[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarSenalizacion, setMostrarSenalizacion] = useState(false);
  const [permisoDecidido, setPermisoDecidido] = useState(false);
  const [usandoRespaldo, setUsandoRespaldo] = useState(false);

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
        console.log("🔄 Intentando conectar con el backend...");
        
        const [resUbicaciones, resFixers] = await Promise.all([
          fetch("http://localhost:5000/api/ubicaciones", {
            signal: AbortSignal.timeout(5000)
          }),
          fetch("http://localhost:5000/api/fixers", {
            signal: AbortSignal.timeout(5000)
          }),
        ]);

        if (resUbicaciones.ok && resFixers.ok) {
          const dataUbicaciones = await resUbicaciones.json();
          const dataFixers = await resFixers.json();
          
          console.log("✅ Backend conectado - Usando datos reales");

          if (dataUbicaciones.success) {
            const ubicacionesTransformadas: Ubicacion[] = dataUbicaciones.data.map(
              (item: UbicacionFromAPI, index: number) => ({
                id: index + 1,
                nombre: item.nombre,
                posicion: [item.posicion.lat, item.posicion.lng] as [number, number],
              })
            );
            setUbicaciones(ubicacionesTransformadas);
          }

          if (dataFixers.success) {
            setFixers(dataFixers.data);
            const cercanos = ubicacionManager.filtrarFixersCercanos(dataFixers.data);
            setFixersFiltrados(cercanos);
          }

          setUsandoRespaldo(false);
        } else {
          throw new Error("Error en respuesta del servidor");
        }

      } catch (error) {
        console.log("❌ Backend no disponible - Usando datos de respaldo", error);
        
        // 🛡️ USAR DATOS DE RESPUESTA
        const todosLosFixers: Fixer[] = [...fixersRespaldo, ...fixersDefinidos];
        setUbicaciones(ubicacionesRespaldo);
        setFixers(todosLosFixers);
        setUsandoRespaldo(true);

        const cercanos = ubicacionManager.filtrarFixersCercanos(todosLosFixers);
        setFixersFiltrados(cercanos);

        if (permisoDecidido && !userLocation) {
          ubicacionManager.setUbicacion(ubicacionesRespaldo[0]);
          setUbicacionSeleccionada(ubicacionesRespaldo[0]);
        }
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
    <div className="flex flex-col items-center">
      {usandoRespaldo && (
        <div className="w-full max-w-6xl px-4 mb-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            <strong>Modo demostración:</strong> Usando datos de ejemplo
          </div>
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
      />
      <FixersHeader />

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
  );
}
