"use client";
import { useEffect, useState } from "react";
import AppointmentButton from "./components/AgendarCitaButton";
import Sidebar from "./components/Sidebar";

interface Servicio {
  _id: string;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
  rating: number;
  proveedorId: {
    _id: string;
    nombre: string;
  };
}

export default function Home() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

useEffect(() => {
  fetch(`${API_URL}/api/devcode/servicios`)
    .then(res => res.json())
    .then(response => {
      // response tiene la forma { success: true, data: [...] }
      if (response.success && Array.isArray(response.data)) {
        setServicios(response.data);
      } else {
        console.error("Respuesta inesperada del backend:", response);
        setServicios([]);
      }
    })
    .catch(err => console.error("Error al cargar servicios:", err));
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 relative">
      <Sidebar />
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl px-4 mb-6">
          <h1 className="text-3xl font-bold mb-1 text-left">Servicios Profesionales</h1>
          <h3 className="text-left text-gray-600">Encuentra y agenda el servicio que necesitas</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl px-4">
        {servicios.map((prov) => (
          <div key={prov._id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between min-h-[250px]">
            <div className="flex items-center mb-4">
              <div className="bg-purple-500 text-white font-bold rounded-xl h-12 w-12 flex items-center justify-center mr-4">
                {prov.proveedorId?.nombre?.split(" ").map(n => n[0]).join("") || "NA"}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{prov.nombre}</h3>
                <p className="text-gray-600 text-sm">{prov.proveedorId?.nombre || "Proveedor no asignado"}</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm flex-1">{prov.descripcion}</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-purple-600 font-bold text-lg">${prov.precio}/hora</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-purple-600 font-bold text-lg">${prov.rating} estrella</span>
            </div>

            <div className="mt-4 flex justify-end">
              {prov.proveedorId && (
                <AppointmentButton
                  proveedorId={prov.proveedorId._id}  // seguro ahora
                  servicioId={prov._id}
                />
              )}
            </div>
          </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}
