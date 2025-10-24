// Entorno de prueba para ver el contenido del componente Agendar Cita
//
"use client";

import AppointmentButton from "../epic_example/components/AgendarCitaButton";
import Sidebar from "./components/Sidebar";

export default function Home() {
  // Datos de ejemplo para los proveedores de servicios
  const proveedores = [
    { id: 1, nombreServicio: "Consult1oría en Marketing Digital", especialista: "María Rodríguez", descripcion: "Sesión de consultoría personalizada para optimizar tu estrategia digital. Incluye análisis de redes sociales, SEO y campañas publicitarias.", precio: 75, rating: 4.9 },
    { id: 2, nombreServicio: "Asesoría Financiera", especialista: "Juan Pérez", descripcion: "Planificación financiera y análisis de inversiones para pequeñas empresas.", precio: 60, rating: 4.7 },
    { id: 3, nombreServicio: "Clases de Yoga", especialista: "Ana Gómez", descripcion: "Sesiones de yoga personalizadas para mejorar flexibilidad y bienestar mental.", precio: 40, rating: 2.8 },
    { id: 4, nombreServicio: "Diseño Web", especialista: "Carlos Mendoza", descripcion: "Creación de sitios web modernos y responsivos adaptados a tu negocio.", precio: 80, rating: 4.6 },
    { id: 5, nombreServicio: "Fotografía Profesional", especialista: "Lucía Torres", descripcion: "Sesiones fotográficas para eventos, productos y retratos profesionales.", precio: 100, rating: 5.0 },
    { id: 6, nombreServicio: "Clases de Guitarra", especialista: "Ricardo López", descripcion: "Aprende guitarra desde cero o perfecciona tus técnicas con clases personalizadas.", precio: 50, rating: 4.9 },
    { id: 7, nombreServicio: "Entrenamiento Personal", especialista: "Sofía Martínez", descripcion: "Planes de entrenamiento físico adaptados a tus objetivos y nivel.", precio: 55, rating: 4.8 },
    { id: 8, nombreServicio: "Consultoría Legal", especialista: "Fernando Díaz", descripcion: "Asesoría legal para pequeñas empresas y emprendedores en contratos y regulaciones.", precio: 90, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 relative">
      {/* Sidebar añadido */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl px-4 mb-6">
          <h1 className="text-3xl font-bold mb-1 text-left">Servicios Profesionales</h1>
          <h3 className="text-left text-gray-600">Encuentra y agenda el servicio que necesitas</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl px-4">
          {proveedores.map((prov) => (
            <div key={prov.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between min-h-[250px]">
              {/* Encabezado con iniciales */}
              <div className="flex items-center mb-4">
                <div className="bg-purple-500 text-white font-bold rounded-xl h-12 w-12 flex items-center justify-center mr-4">
                  {prov.especialista.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{prov.nombreServicio}</h3>
                  <p className="text-gray-600 text-sm">{prov.especialista}</p>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-gray-700 text-sm flex-1">{prov.descripcion}</p>

              {/* Precio y rating */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-purple-600 font-bold text-lg">${prov.precio}/hora</span>
                <span className="text-yellow-500">
                  {"★".repeat(Math.floor(prov.rating))}{" "}
                  <span className="text-gray-500 text-sm">({prov.rating})</span>
                </span>
              </div>

              {/* Botón */}
              <div className="mt-4 flex justify-end">
                <AppointmentButton />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
