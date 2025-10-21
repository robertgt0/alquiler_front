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
    _id: "1",
    nombre: "José Quiroga",
    posicion: { lat: -17.3935, lng: -66.1570 },
    especialidad: "Electricista",
    descripcion: "Instalaciones y reparaciones eléctricas residenciales.",
    rating: 4.6,
    verified: true,
    whatsapp: "+59171000001"
  },
  {
    _id: "2",
    nombre: "Lucía Ramos",
    posicion: { lat: -17.3989, lng: -66.1568 },
    especialidad: "Plomera",
    descripcion: "Reparación de cañerías y sistemas de agua potable.",
    rating: 4.3,
    verified: true,
    whatsapp: "+59171000002"
  },
  {
    _id: "3",
    nombre: "Marcos Gonzales",
    posicion: { lat: -17.3892, lng: -66.1575 },
    especialidad: "Carpintero",
    descripcion: "Fabricación y reparación de muebles personalizados.",
    rating: 4.7,
    verified: true,
    whatsapp: "+59171000003"
  },
  {
    _id: "4",
    nombre: "Sandra Molina",
    posicion: { lat: -17.4023, lng: -66.1425 },
    especialidad: "Pintora",
    descripcion: "Decoración y pintura de interiores y exteriores.",
    rating: 4.5,
    verified: true,
    whatsapp: "+59171000004"
  },
  {
    _id: "5",
    nombre: "Fernando Paredes",
    posicion: { lat: -17.3910, lng: -66.1450 },
    especialidad: "Gasfitero",
    descripcion: "Instalación y mantenimiento de sistemas de gas domiciliario.",
    rating: 4.2,
    verified: false,
    whatsapp: "+59171000005"
  },
  {
    _id: "6",
    nombre: "Roxana López",
    posicion: { lat: -17.3768, lng: -66.1561 },
    especialidad: "Cerrajera",
    descripcion: "Cambio de cerraduras y duplicado de llaves.",
    rating: 4.4,
    verified: true,
    whatsapp: "+59171000006"
  },
  {
    _id: "7",
    nombre: "Carlos Rodríguez",
    posicion: { lat: -17.4067, lng: -66.1623 },
    especialidad: "Mecánico",
    descripcion: "Mantenimiento automotriz general y eléctricos.",
    rating: 4.8,
    verified: true,
    whatsapp: "+59171000007"
  },
  {
    _id: "8",
    nombre: "Verónica Vargas",
    posicion: { lat: -17.3825, lng: -66.1662 },
    especialidad: "Costurera",
    descripcion: "Confección y reparación de prendas de vestir.",
    rating: 4.3,
    verified: false,
    whatsapp: "+59171000008"
  },
  {
    _id: "9",
    nombre: "Luis Torrico",
    posicion: { lat: -17.4005, lng: -66.1712 },
    especialidad: "Albañil",
    descripcion: "Construcción de muros, pisos y reparaciones generales.",
    rating: 4.5,
    verified: true,
    whatsapp: "+59171000009"
  },
  {
    _id: "10",
    nombre: "María Céspedes",
    posicion: { lat: -17.3702, lng: -66.1389 },
    especialidad: "Jardinera",
    descripcion: "Diseño y mantenimiento de jardines.",
    rating: 4.7,
    verified: true,
    whatsapp: "+59171000010"
  },
  {
    _id: "11",
    nombre: "Pablo Romero",
    posicion: { lat: -17.3899, lng: -66.1550 },
    especialidad: "Técnico en refrigeración",
    descripcion: "Reparación de refrigeradores y aires acondicionados.",
    rating: 4.6,
    verified: true,
    whatsapp: "+59171000011"
  },
  {
    _id: "12",
    nombre: "Elena Aguilar",
    posicion: { lat: -17.4032, lng: -66.1335 },
    especialidad: "Electricista industrial",
    descripcion: "Instalaciones eléctricas industriales.",
    rating: 4.8,
    verified: true,
    whatsapp: "+59171000012"
  },
  {
    _id: "13",
    nombre: "Miguel Flores",
    posicion: { lat: -17.3860, lng: -66.1485 },
    especialidad: "Tapicero",
    descripcion: "Tapizado de muebles y asientos automotrices.",
    rating: 4.4,
    verified: false,
    whatsapp: "+59171000013"
  },
  {
    _id: "14",
    nombre: "Paola Arnez",
    posicion: { lat: -17.3801, lng: -66.1290 },
    especialidad: "Diseñadora de interiores",
    descripcion: "Asesoría y decoración de espacios.",
    rating: 4.9,
    verified: true,
    whatsapp: "+59171000014"
  },
  {
    _id: "15",
    nombre: "Henry Rojas",
    posicion: { lat: -17.3923, lng: -66.1308 },
    especialidad: "Soldador",
    descripcion: "Estructuras metálicas y trabajos de soldadura industrial.",
    rating: 4.5,
    verified: true,
    whatsapp: "+59171000015"
  },
  {
    _id: "16",
    nombre: "Nadia Guzmán",
    posicion: { lat: -17.4084, lng: -66.1619 },
    especialidad: "Peluquera",
    descripcion: "Cortes, tintes y tratamientos capilares.",
    rating: 4.6,
    verified: false,
    whatsapp: "+59171000016"
  },
  {
    _id: "17",
    nombre: "David Arce",
    posicion: { lat: -17.3951, lng: -66.1459 },
    especialidad: "Vidriero",
    descripcion: "Instalación de vidrios, ventanas y espejos.",
    rating: 4.3,
    verified: true,
    whatsapp: "+59171000017"
  },
  {
    _id: "18",
    nombre: "Carmen Blanco",
    posicion: { lat: -17.3732, lng: -66.1344 },
    especialidad: "Sastre",
    descripcion: "Trajes a medida y arreglos de ropa.",
    rating: 4.4,
    verified: true,
    whatsapp: "+59171000018"
  },
  {
    _id: "19",
    nombre: "Andrés Rivera",
    posicion: { lat: -17.3998, lng: -66.1589 },
    especialidad: "Fontanero",
    descripcion: "Instalación de baños, duchas y sistemas hidráulicos.",
    rating: 4.2,
    verified: true,
    whatsapp: "+59171000019"
  },
  {
    _id: "20",
    nombre: "Natalia Téllez",
    posicion: { lat: -17.3866, lng: -66.1724 },
    especialidad: "Electricista automotriz",
    descripcion: "Sistemas eléctricos de vehículos.",
    rating: 4.6,
    verified: false,
    whatsapp: "+59171000020"
  },
  {
    _id: "21",
    nombre: "Rodrigo Antezana",
    posicion: { lat: -17.3841, lng: -66.1415 },
    especialidad: "Cerrajero automotriz",
    descripcion: "Apertura de vehículos y duplicado de llaves con chip.",
    rating: 4.7,
    verified: true,
    whatsapp: "+59171000021"
  },
  {
    _id: "22",
    nombre: "Sofía Castro",
    posicion: { lat: -17.4008, lng: -66.1409 },
    especialidad: "Costurera",
    descripcion: "Arreglos de ropa y confección de trajes típicos.",
    rating: 4.3,
    verified: true,
    whatsapp: "+59171000022"
  },
  {
    _id: "23",
    nombre: "Gerardo Suárez",
    posicion: { lat: -17.3799, lng: -66.1361 },
    especialidad: "Mecánico de motos",
    descripcion: "Reparación y mantenimiento de motocicletas.",
    rating: 4.5,
    verified: false,
    whatsapp: "+59171000023"
  },
  {
    _id: "24",
    nombre: "Estela López",
    posicion: { lat: -17.4071, lng: -66.1680 },
    especialidad: "Decoradora de eventos",
    descripcion: "Decoración de bodas, cumpleaños y eventos corporativos.",
    rating: 4.8,
    verified: true,
    whatsapp: "+59171000024"
  },
  {
    _id: "25",
    nombre: "Wilson Vargas",
    posicion: { lat: -17.3915, lng: -66.1699 },
    especialidad: "Pintor automotriz",
    descripcion: "Pintura, pulido y restauración de autos.",
    rating: 4.6,
    verified: true,
    whatsapp: "+59171000025"
  },
  {
    _id: "26",
    nombre: "Tatiana Rocha",
    posicion: { lat: -17.3810, lng: -66.1250 },
    especialidad: "Diseñadora gráfica",
    descripcion: "Diseños para publicidad y redes sociales.",
    rating: 4.7,
    verified: false,
    whatsapp: "+59171000026"
  },
  {
    _id: "27",
    nombre: "Cristian Méndez",
    posicion: { lat: -17.4088, lng: -66.1522 },
    especialidad: "Reparador de celulares",
    descripcion: "Cambio de pantallas, baterías y software.",
    rating: 4.9,
    verified: true,
    whatsapp: "+59171000027"
  },
  {
    _id: "28",
    nombre: "Raquel Calderón",
    posicion: { lat: -17.3791, lng: -66.1612 },
    especialidad: "Limpieza de hogares",
    descripcion: "Limpieza general y profunda de departamentos y casas.",
    rating: 4.4,
    verified: true,
    whatsapp: "+59171000028"
  },
  {
    _id: "29",
    nombre: "Mario Jiménez",
    posicion: { lat: -17.3724, lng: -66.1432 },
    especialidad: "Instalador de cámaras de seguridad",
    descripcion: "Cámaras IP, DVR, configuración remota.",
    rating: 4.6,
    verified: true,
    whatsapp: "+59171000029"
  },
  {
    _id: "30",
    nombre: "Diana Pinto",
    posicion: { lat: -17.3956, lng: -66.1322 },
    especialidad: "Maestra de obras",
    descripcion: "Construcción y supervisión de proyectos.",
    rating: 4.8,
    verified: true,
    whatsapp: "+59171000030"
  },
  {
    _id: "31",
    nombre: "Óscar Peña",
    posicion: { lat: -17.4022, lng: -66.1768 },
    especialidad: "Técnico en computadoras",
    descripcion: "Mantenimiento de PC, formateo y redes.",
    rating: 4.7,
    verified: true,
    whatsapp: "+59171000031"
  },
  {
    _id: "32",
    nombre: "Rocío Alvarado",
    posicion: { lat: -17.3846, lng: -66.1478 },
    especialidad: "Modista",
    descripcion: "Confección de ropa femenina a medida.",
    rating: 4.5,
    verified: false,
    whatsapp: "+59171000032"
  },
  {
    _id: "33",
    nombre: "Javier Terán",
    posicion: { lat: -17.3921, lng: -66.1673 },
    especialidad: "Técnico electrónico",
    descripcion: "Reparación de televisores y equipos de sonido.",
    rating: 4.6,
    verified: true,
    whatsapp: "+59171000033"
  },
  {
    _id: "34",
    nombre: "Patricia Navarro",
    posicion: { lat: -17.4080, lng: -66.1500 },
    especialidad: "Manicurista",
    descripcion: "Uñas acrílicas, semipermanentes y decoraciones.",
    rating: 4.9,
    verified: false,
    whatsapp: "+59171000034"
  },
  {
    _id: "35",
    nombre: "Nelson Choque",
    posicion: { lat: -17.3934, lng: -66.1404 },
    especialidad: "Instalador de paneles solares",
    descripcion: "Energía solar para hogares y empresas.",
    rating: 4.8,
    verified: true,
    whatsapp: "+59171000035"
  },
  {
    _id: "36",
    nombre: "Ruth Crespo",
    posicion: { lat: -17.3738, lng: -66.1530 },
    especialidad: "Técnica en limpieza industrial",
    descripcion: "Limpieza profunda de fábricas y talleres.",
    rating: 4.4,
    verified: true,
    whatsapp: "+59171000036"
  },
  {
    _id: "37",
    nombre: "Eduardo Claure",
    posicion: { lat: -17.4047, lng: -66.1669 },
    especialidad: "Reparador de electrodomésticos",
    descripcion: "Cocinas, licuadoras, lavadoras.",
    rating: 4.7,
    verified: true,
    whatsapp: "+59171000037"
  },
  {
    _id: "38",
    nombre: "Julieta Vargas",
    posicion: { lat: -17.3890, lng: -66.1711 },
    especialidad: "Decoradora de interiores",
    descripcion: "Asesoría estética y funcional de espacios.",
    rating: 4.9,
    verified: true,
    whatsapp: "+59171000038"
  },
  {
    _id: "39",
    nombre: "Víctor Andrade",
    posicion: { lat: -17.3957, lng: -66.1293 },
    especialidad: "Técnico en redes",
    descripcion: "Configuración de routers y redes LAN.",
    rating: 4.5,
    verified: false,
    whatsapp: "+59171000039"
  },
  {
    _id: "40",
    nombre: "Beatriz Salazar",
    posicion: { lat: -17.3864, lng: -66.1608 },
    especialidad: "Chef a domicilio",
    descripcion: "Cocina gourmet y tradicional boliviana.",
    rating: 4.9,
    verified: true,
    whatsapp: "+59171000040"
  },
  {
    _id: "41",
    nombre: "Rubén Arias",
    posicion: { lat: -17.4059, lng: -66.1576 },
    especialidad: "Técnico sanitario",
    descripcion: "Mantenimiento de baños, duchas y grifos.",
    rating: 4.3,
    verified: true,
    whatsapp: "+59171000041"
  },
  {
    _id: "42",
    nombre: "Karen Méndez",
    posicion: { lat: -17.3873, lng: -66.1517 },
    especialidad: "Estilista",
    descripcion: "Peinados, maquillaje y estética integral.",
    rating: 4.8,
    verified: true,
    whatsapp: "+59171000042"
  },
  {
    _id: "43",
    nombre: "Juan Mamani",
    posicion: { lat: -17.3815, lng: -66.1399 },
    especialidad: "Técnico en paneles solares",
    descripcion: "Instalación y mantenimiento de sistemas solares.",
    rating: 4.7,
    verified: false,
    whatsapp: "+59171000043"
  },
  {
    _id: "44",
    nombre: "Daniela Rocha",
    posicion: { lat: -17.3975, lng: -66.1651 },
    especialidad: "Decoradora de pasteles",
    descripcion: "Pastelería artística para eventos.",
    rating: 4.9,
    verified: true,
    whatsapp: "+59171000044"
  },
  {
    _id: "45",
    nombre: "Héctor Ledezma",
    posicion: { lat: -17.3880, lng: -66.1448 },
    especialidad: "Reparador de lavadoras",
    descripcion: "Servicio técnico de lavadoras y secadoras.",
    rating: 4.6,
    verified: true,
    whatsapp: "+59171000045"
  },
  {
    _id: "46",
    nombre: "Carla Quispe",
    posicion: { lat: -17.4002, lng: -66.1385 },
    especialidad: "Repostera",
    descripcion: "Tortas y postres personalizados.",
    rating: 4.8,
    verified: true,
    whatsapp: "+59171000046"
  },
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
  }, [ubicacionManager]);

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
  }, [userLocation, permisoDecidido, ubicacionManager]);

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
