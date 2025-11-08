// src/app/agenda/page.tsx
"use client";
import { useEffect, useState } from "react";
import AppointmentButton from "./components/AgendarCitaButton";
import Sidebar from "./components/Sidebar";
import { useNewOffersPolling } from "@/hooks/useNewOffersPolling";
import NewOffersNotification from "@/components/NewOffersNotification";
import OffersBadge from "@/components/OffersBadge";

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
  const [showNotification, setShowNotification] = useState(false);
  const [newOffersData, setNewOffersData] = useState<{
    count: number;
    servicios: any[];
  }>({ count: 0, servicios: [] });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🟢 CREAR FUNCIÓN REUTILIZABLE PARA CARGAR SERVICIOS
  const fetchServicios = () => {
    fetch(`${API_URL}/api/devcode/servicios`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success && Array.isArray(response.data)) {
          setServicios(response.data);
        } else {
          console.error("Respuesta inesperada del backend:", response);
          setServicios([]);
        }
      })
      .catch((err) => console.error("Error al cargar servicios:", err));
  };

  // Cliente hardcodeado (reemplaza con autenticación real)
  const clienteId = "68fb93e079308369b5a0f264";

  // Hook de polling
  const { nuevasOfertas, checking, error, markAsRead } = useNewOffersPolling({
    clienteId,
    enabled: true, // Activar polling
    //intervalMs: 15 * 60 * 1000, // 15 minutos
    intervalMs: 15 * 1000,
    onNewOffers: (count, servicios) => {
      console.log(`🔔 ${count} nuevas ofertas detectadas`);
      setNewOffersData({ count, servicios });
      setShowNotification(true);

      // Notificación del navegador (si tiene permisos)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('¡Nuevas ofertas disponibles!', {
          body: `Se ${count === 1 ? 'ha publicado' : 'han publicado'} ${count} nueva${count === 1 ? '' : 's'} oferta${count === 1 ? '' : 's'} de trabajo`,
          icon: '/favicon.ico',
          badge: '/badge.png',
        });
      }
    },
  });

  // Cargar servicios
 /* useEffect(() => {
    fetch(`${API_URL}/api/devcode/servicios`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success && Array.isArray(response.data)) {
          setServicios(response.data);
        } else {
          console.error("Respuesta inesperada del backend:", response);
          setServicios([]);
        }
      })
      .catch((err) => console.error("Error al cargar servicios:", err));
  }, []);*/
  
  useEffect(() => {
    fetchServicios(); // Llamada inicial
  }, []);
  
  // Solicitar permisos de notificaciones al cargar
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  /*const handleViewOffers = async () => {
    // Marcar como vistas
    if (newOffersData.servicios.length > 0) {
      try {
        await markAsRead(newOffersData.servicios.map((s) => s._id));
        setNewOffersData({ count: 0, servicios: [] });
      } catch (err) {
        console.error('Error al marcar ofertas como vistas:', err);
      }
    }
  };*/

  const handleViewOffers = async () => {
    // Marcar como vistas
    if (newOffersData.servicios.length > 0) {
      try {
        await markAsRead(newOffersData.servicios.map((s) => s._id));
        
        // 🟢 PASO 3: FORZAR LA RECARGA DE DATOS PARA MOSTRAR LA NUEVA OFERTA
        fetchServicios(); 

        setNewOffersData({ count: 0, servicios: [] });
      } catch (err) {
        console.error('Error al marcar ofertas como vistas:', err);
      }
    }
  };

  const handleDismissNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 relative">
      <Sidebar />

      {/* Notificación flotante */}
      {showNotification && newOffersData.count > 0 && (
        <NewOffersNotification
          count={newOffersData.count}
          onDismiss={handleDismissNotification}
          onViewOffers={handleViewOffers}
        />
      )}

      {/* Badge de notificaciones */}
      <OffersBadge
        count={nuevasOfertas}
        onClick={() => setShowNotification(true)}
      />

      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl px-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1 text-left">
                Servicios Profesionales
              </h1>
              <h3 className="text-left text-gray-600">
                Encuentra y agenda el servicio que necesitas
              </h3>
            </div>

            {/* Indicador de verificación */}
            {checking && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Verificando nuevas ofertas...
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl px-4">
          {servicios.map((prov) => (
            <div
              key={prov._id}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between min-h-[250px]"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-500 text-white font-bold rounded-xl h-12 w-12 flex items-center justify-center mr-4">
                  {prov.proveedorId?.nombre
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "NA"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{prov.nombre}</h3>
                  <p className="text-gray-600 text-sm">
                    {prov.proveedorId?.nombre || "Proveedor no asignado"}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-sm flex-1">{prov.descripcion}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-purple-600 font-bold text-lg">
                  ${prov.precio}/hora
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-yellow-400 ${
                        i < prov.rating ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-gray-700 font-semibold text-sm">
                    {prov.rating} {prov.rating === 1 ? "estrella" : "estrellas"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                {prov.proveedorId && (
                  <AppointmentButton
                    proveedorId={prov.proveedorId._id}
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